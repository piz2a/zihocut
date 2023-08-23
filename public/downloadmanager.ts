import { App, BrowserWindow } from 'electron'
import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

const VIDEO_DIRNAME = 'YouTubeCropDownloads'

export default class DownloadManager {
    // private complete: { id: string, successful: boolean }[] = []
    private PYTHON_BASE_PATH: string
    private VIDEO_PATH: string

    constructor(app: App) {
        this.PYTHON_BASE_PATH = path.join(app.getAppPath(), 'extra', 'python')
        this.VIDEO_PATH = path.join(app.getPath('documents'), VIDEO_DIRNAME)
        if (!fs.existsSync(this.VIDEO_PATH)){
            fs.mkdirSync(this.VIDEO_PATH);
        }
    }

    queueVideo(id: string, window: BrowserWindow | null) {
        console.log(`Downloading video: ${id}`)
        spawn(
            path.join(this.PYTHON_BASE_PATH, 'python-embed', 'python-3.11.4-embed-amd64/python.exe'),
            [path.join(this.PYTHON_BASE_PATH, 'download.py'), `https://www.youtube.com/watch?v=${id}`, this.VIDEO_PATH]
        ).on('close', (code) => {
            console.log(`ID: ${id}, Python script code: ${code}`)
            if (window !== null) {
                window.webContents.send('DOWNLOAD_COMPLETE', {id: id, complete: code === 0})
            }
        }).stderr.on('data', (data) => {
            console.log(data.toString())
        })
    }

    /*
    isComplete(id: string) {
        return this.complete.some((element) => element.id === id && element.successful)
    }
     */
}
