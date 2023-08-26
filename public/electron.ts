import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as isDev from 'electron-is-dev'
import * as fs from 'fs'
import * as url from "url";
import { spawn } from "child_process";


const BASE_URL = 'http://localhost:3000'

let window: BrowserWindow | null

// const DOWNLOAD_PROTOCOL = 'download'
const VIDEO_DIRNAME = 'ZihoCut'
const PYTHON_BASE_PATH = path.join(isDev ? __dirname : process.resourcesPath, '../extra/python')
const VIDEO_PATH = path.join(app.getPath('documents'), VIDEO_DIRNAME)
if (!fs.existsSync(VIDEO_PATH)){
    fs.mkdirSync(VIDEO_PATH);
}

function getId(URL: string): string | null {
    if (!URL.startsWith('https://') && !URL.startsWith('http://'))
        URL = 'https://' + URL
    const parsed = url.parse(URL, true)
    if (parsed.hostname === 'youtu.be' && parsed.pathname != null)
        return parsed.pathname.slice('/'.length)
    if (parsed.hostname !== 'youtube.com' && parsed.hostname !== 'www.youtube.com')
        return null
    if (parsed.pathname === '/watch' && parsed.query.v) {
        if (Array.isArray(parsed.query.v))
            return null
        return parsed.query.v
    } else if (parsed.pathname != null && parsed.pathname.startsWith('/shorts/'))
        return parsed.pathname.slice('/shorts/'.length)
    return null
}

/*
function fileHandler(req: Request) {
    const id = req.url.slice(`${DOWNLOAD_PROTOCOL}://`.length)
    const fileURL = url.pathToFileURL(path.join(VIDEO_PATH, `${id}.mp4`)).toString()
    console.log(fileURL)
    return net.fetch(fileURL)
}
*/

function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 700,
        icon: path.join(__dirname, 'logo64.png'),
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    window.removeMenu()
    window.setResizable(isDev)

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

ipcMain.handle('GET_VIDEO_PATH', () => VIDEO_PATH)
ipcMain.handle('GET_ID_FROM_URL', (event, url: string) => getId(url))
ipcMain.handle('QUEUE_VIDEO', (event, id: string) => {
    const sendCompleteMessage = (code: number | null) => {
        if (window !== null)
            window.webContents.send('DOWNLOAD_COMPLETE', {id: id, complete: code === 0})
    }
    console.log(`Downloading video: ${id}`)
    if (fs.existsSync(path.join(VIDEO_PATH, `${id}.mp4`))) {
        console.log('Video already exists: Downloading canceled')
        setTimeout(() => sendCompleteMessage(0), 500)
        return
    }
    spawn(
        path.join(PYTHON_BASE_PATH, 'python-embed', 'python-3.11.4-embed-amd64/python.exe'),
        [path.join(PYTHON_BASE_PATH, 'download.py'), `https://www.youtube.com/watch?v=${id}`, VIDEO_PATH]
    ).on('close', (code) => {
        console.log(`ID: ${id}, Python script code: ${code}`)
        sendCompleteMessage(code)
    }).stderr.on('data', (data) => {
        console.log(data.toString())
    })
})

app.on('ready', () => {
    // protocol.handle(DOWNLOAD_PROTOCOL, fileHandler)
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
