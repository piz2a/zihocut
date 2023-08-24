import { app, BrowserWindow, ipcMain } from 'electron'
import DownloadManager from './downloadmanager'
import * as path from 'path'
import * as isDev from 'electron-is-dev'
import * as url from "url";

const BASE_URL = 'http://localhost:3000'

let window: BrowserWindow | null
const downloadManager = new DownloadManager(app)

function getId(URL: string): string | null {
    if (!URL.startsWith('https://') && !URL.startsWith('http://')) {
        URL = 'https://' + URL
    }
    const parsed = url.parse(URL, true)
    if (parsed.hostname !== 'youtube.com' && parsed.hostname !== 'www.youtube.com')
        return null
    if (parsed.pathname === '/watch' && parsed.query.v) {
        if (Array.isArray(parsed.query.v))
            return null
        return parsed.query.v
    } else if (parsed.pathname != null && parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.slice(8)
    }
    return null
}

const createWindow = () => {
    window = new BrowserWindow({
        width: 800,
        height: 700,
        icon: path.join(__dirname, 'logo64.png'),
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
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

ipcMain.handle('GET_ID_FROM_URL', (event, url: string) => getId(url))
ipcMain.handle('QUEUE_VIDEO', (event, id: string) => downloadManager.queueVideo(id, window))
// ipcMain.handle('GET_IS_COMPLETE', (event, id: string) => downloadManager.isComplete(id))

app.on('ready', () => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
