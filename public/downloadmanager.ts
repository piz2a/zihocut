import { App, BrowserWindow } from 'electron'
import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import * as isDev from 'electron-is-dev'

const VIDEO_DIRNAME = 'YouTubeCropDownloads'

export default class DownloadManager {
    private readonly PYTHON_BASE_PATH: string
    private readonly VIDEO_PATH: string

    constructor(app: App) {
        this.PYTHON_BASE_PATH = path.join(isDev ? __dirname : process.resourcesPath, '../extra/python')
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
}
