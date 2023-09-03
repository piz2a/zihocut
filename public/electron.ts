import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import * as path from 'path'
import * as isDev from 'electron-is-dev'
import * as fs from 'fs'
import * as url from "url";
import { spawn } from "child_process";
import { template } from "./applicationMenu";


const BASE_URL = 'http://localhost:3000'

let window: BrowserWindow | null

const DOWNLOAD_DIRNAME = 'ZihoCutDownloads'
const EXPORT_DIRNAME = "ZihoCutExports"

const ASSETS_PATH = path.join(isDev ? __dirname : process.resourcesPath, '../assets')
const PYTHON_BASE_PATH = path.join(ASSETS_PATH, 'python')
let EXECUTABLE_PATH: string;
switch (process.platform) {
    case 'win32':
        EXECUTABLE_PATH = path.join(PYTHON_BASE_PATH, 'win32', 'python-3.11.4-embed-amd64/python.exe')
        break
    case 'darwin':
        EXECUTABLE_PATH = path.join(PYTHON_BASE_PATH, 'darwin', 'writevideo')
        break
    case 'linux':
        EXECUTABLE_PATH = path.join(PYTHON_BASE_PATH, 'linux', 'writevideo')
        break
    default:
        throw new Error("Cannot find executable python path")
}

export let DOWNLOAD_PATH = path.join(app.getPath('documents'), DOWNLOAD_DIRNAME)
export let EXPORT_PATH = path.join(app.getPath('documents'), EXPORT_DIRNAME)

export const CONFIG_FILE_PATH = path.join(app.getPath('userData'), 'config.txt')
if (!fs.existsSync(CONFIG_FILE_PATH)) {
    fs.writeFileSync(CONFIG_FILE_PATH, `DOWNLOAD_PATH=${DOWNLOAD_PATH}\nEXPORT_PATH=${EXPORT_PATH}`)
}

export function loadPath() {
    fs.readFileSync(CONFIG_FILE_PATH, { encoding: 'utf8', flag: 'r' }).split('\n').forEach((line) => {
        const [key, value] = line.split('=')
        if (key === 'DOWNLOAD_PATH') {
            DOWNLOAD_PATH = value
        } else if (key === 'EXPORT_PATH') {
            EXPORT_PATH = value
        } else return
        if (!fs.existsSync(value)) {
            fs.mkdirSync(value)
        }
    })
}

loadPath()

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

function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 730,
        icon: path.join(__dirname, 'logo64.png'),
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    })

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

ipcMain.handle('GET_VIDEO_PATH', () => DOWNLOAD_PATH)
ipcMain.handle('GET_ID_FROM_URL', (event, url: string) => getId(url))
ipcMain.handle('QUEUE_VIDEO', (event, id: string) => {
    const sendCompleteMessage = (code: number | null) => {
        if (window !== null)
            window.webContents.send(code === 0 ? 'DOWNLOAD_COMPLETE' : 'DOWNLOAD_FAILED', {id: id, code: code})
    }
    console.log(`Downloading video: ${id}`)

    const python = spawn(
        EXECUTABLE_PATH,
        [
            ...(process.platform === 'win32' ? [path.join(PYTHON_BASE_PATH, 'win32', 'writevideo.py')] : []),
            'download',
            `https://www.youtube.com/watch?v=${id}`,
            DOWNLOAD_PATH
        ]
    )

    python.on('close', (code) => {
        console.log(`ID: ${id}, Download Python script code: ${code}`)
        sendCompleteMessage(code)
    })
    python.stdout.on('data', (data) => {
        const lines = data.toString().split('\n')
        lines.forEach((line: string) => {
            if (line.startsWith('VIDEO_TITLE=') && window !== null) {
                console.log(line)
                window.webContents.send('VIDEO_TITLE', {id: id, title: line.slice('VIDEO_TITLE='.length)})
            }
        })
    })
    python.stderr.on('data', (data) => {
        console.log(data.toString())
    })
})
ipcMain.handle('EXPORT_VIDEO', (event, id: string, intervals: number[][]) => {
    intervals.forEach((interval) => {
        console.log(interval[0], interval[1])
    })
    const sendCompleteMessage = (code: number | null) => {
        if (window !== null)
            window.webContents.send(code === 0 ? 'EXPORT_COMPLETE' : 'EXPORT_FAILED', {id: id})
    }
    console.log(`Exporting video: ${id}`)
    spawn(
        EXECUTABLE_PATH,
        [
            ...(process.platform === 'win32' ? [path.join(PYTHON_BASE_PATH, 'win32', 'writevideo.py')] : []),
            'export',
            id,
            DOWNLOAD_PATH,
            EXPORT_PATH,
            ...intervals.map((interval) => `${interval[0]}-${interval[1]}`)
        ]
    ).on('close', (code) => {
        console.log(`ID: ${id}, Export Python script code: ${code}`)
        sendCompleteMessage(code)
    }).stderr.on('data', (data) => {
        console.log(data.toString())
    })
})

app.on('ready', () => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    if (window !== null) {
        const menu = Menu.buildFromTemplate(template(window))
        Menu.setApplicationMenu(menu)
    }
})

app.on('window-all-closed', () => {
    // if (isDev && fs.existsSync(CONFIG_FILE_PATH)) fs.unlinkSync(CONFIG_FILE_PATH)
    if (process.platform !== 'darwin') app.quit()
})
