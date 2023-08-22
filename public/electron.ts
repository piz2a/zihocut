import { app, BrowserWindow, ipcMain, contextBridge } from 'electron'
import * as path from 'path'
import * as isDev from 'electron-is-dev'
import DownloadManager from "./downloadmanager";

const BASE_URL = 'http://localhost:3000'

let window: BrowserWindow | null
const downloadManager = new DownloadManager()

const createWindow = () => {
    window = new BrowserWindow({
        width: 800,
        height: 700,
        icon: path.join(__dirname, 'logo64.png'),
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    window.removeMenu()
    window.setResizable(false)

    window.once('ready-to-show', () => {
        // @ts-ignore
        window.show()
    })

    if (isDev) {
        window.loadURL(BASE_URL)
        window.webContents.openDevTools()
    } else {
        window.loadFile(path.join(__dirname, '../build/index.html'))
    }

    window.on('closed', () => {
        window = null;
    })
}

ipcMain.handle('SEND_MAIN_PING', async (event, arg) => {
    console.log(arg)
    return "hehe"
})

ipcMain.handle('QUEUE_VIDEO', (event, url: string) => {
    return downloadManager.queueVideo(url)
})

ipcMain.handle('GET_IS_COMPLETE', (event, id: string) => {
    return downloadManager.isComplete(id)
})

app.on('ready', () => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    downloadManager.stop()
    if (process.platform !== 'darwin') app.quit()
})

contextBridge.exposeInMainWorld('performTaskProcess', downloadManager.taskProcess)

/*
const path = window.require('path')
const url = window.require('url')
const PythonShell = window.require('python-shell')
const {dialog} = electron.remote;

const PUBLIC_PATH = path.join(__dirname, process.env.PUBLIC_URL)
const PYTHON_PATH = path.join(PUBLIC_PATH, 'venv/Scripts/python')

const video_id = url.parse(text, true)
console.log(video_id)

PythonShell.run('download.py', {
    mode: 'text',
    pythonPath: PYTHON_PATH,
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: PUBLIC_PATH,
    args: ['value1', 'value2', 'value3'],
}).then((messages: string[]) => {
    for (let message in messages) {
        console.log(message)
    }
})
 */