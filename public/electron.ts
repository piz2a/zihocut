import { app, BrowserWindow, ipcMain } from 'electron'
import { fork } from 'child_process'
import * as path from 'path'
import * as isDev from 'electron-is-dev'

const BASE_URL = 'http://localhost:3000'

let window: BrowserWindow | null
const downloaderChild = fork(path.join(__dirname, 'downloadmanager.js'))
// @ts-ignore
downloaderChild.send('appPath', [app.getAppPath()])

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

const downloaderChildResponse: {queueVideo: boolean | null, isComplete: boolean | null} = {queueVideo: null, isComplete: null}

downloaderChild.on('message', (m, result: boolean) => {
    switch (m) {
        case 'queueVideoReply':
            downloaderChildResponse.queueVideo = result
            break
        case 'getIsCompleteReply':
            downloaderChildResponse.isComplete = result
            break
    }
})

ipcMain.handle('SEND_MAIN_PING', async (event, arg) => {
    console.log(arg)
    return "hehe"
})

ipcMain.handle('QUEUE_VIDEO', (event, url: string) => {
    // @ts-ignore
    downloaderChild.send('queueVideo', [url])
    while (downloaderChildResponse.queueVideo === null) {}
    const result = downloaderChildResponse.queueVideo
    downloaderChildResponse.queueVideo = null
    return result
})

ipcMain.handle('GET_IS_COMPLETE', (event, id: string) => {
    // @ts-ignore
    downloaderChild.send('isComplete', [id])
    while (downloaderChildResponse.isComplete === null) {}
    const result = downloaderChildResponse.isComplete
    downloaderChildResponse.isComplete = null
    return result
})

app.on('ready', () => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    // @ts-ignore
    downloaderChild.send('stop', [])
    downloaderChild.kill()
    if (process.platform !== 'darwin') app.quit()
})

// contextBridge.exposeInMainWorld('performTaskProcess', downloadManager.taskProcess)

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