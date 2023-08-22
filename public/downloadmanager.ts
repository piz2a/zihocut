import { app } from 'electron'
import { spawn } from 'child_process'
// import * as isDev from "electron-is-dev"
import * as url from 'url'
import * as path from 'path'

const PYTHON_BASE_PATH = path.join(app.getAppPath(), 'extra', 'python')

function getId(URL: string): string | null {
    const parsed = url.parse(URL, true)
    if (parsed.hostname !== 'youtube.com' || parsed.pathname !== '/watch' || !parsed.query.v)
        return null
    if (Array.isArray(parsed.query.v))
        return parsed.query.v[0]
    return parsed.query.v
}

export default class DownloadManager {
    private queue: { id: string, task: any }[] = []
    private complete: { id: string, successful: boolean }[] = []
    private downloading = false
    private taskProcessRunning = false

    queueVideo(url: string): boolean {
        const id = getId(url)
        if (id === null) return false
        const pythonTask = () => {
            this.downloading = true
            return spawn(
                path.join(PYTHON_BASE_PATH, 'python-embed', 'python-3.11.4-embed-amd64/python.exe'),
                [`"${path.join(PYTHON_BASE_PATH, 'download.py')}"`, `"${url}"`]
            ).on('close', (code) => {
                this.queue.forEach((pair) => {
                    if (pair.id === url) {
                        this.complete.push({id: id, successful: code !== 0})
                    }
                })
                this.downloading = false
            })
        }
        this.queue.push({id: id, task: pythonTask})
        return true
    }

    isComplete(id: string) {
        return this.complete.some((element) => element.id === id && element.successful)
    }

    taskProcess() {
        this.taskProcessRunning = true
        while (this.taskProcessRunning) {
            while (this.queue.length === 0) {}
            // @ts-ignore
            this.queue.shift().task()
            while (this.downloading) {}
        }
    }

    stop() {
        this.taskProcessRunning = false
    }
}
