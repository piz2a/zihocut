import { app, BrowserWindow, MenuItemConstructorOptions, shell, dialog } from 'electron'
import * as isDev from 'electron-is-dev'
import * as fs from 'fs'
import {CONFIG_FILE_PATH, DOWNLOAD_PATH, EXPORT_PATH, loadPath} from "./electron"

const isMac = process.platform === 'darwin'

const appMenu: MenuItemConstructorOptions = {
    label: app.name,
    submenu: [
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
    ]
}

const viewMenu: MenuItemConstructorOptions = {
    label: 'View',
    submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' }
    ]
}

async function changeDirectory(window: BrowserWindow, whatToChange: string) {
    const newPaths = dialog.showOpenDialogSync(window, {
        title: 'Change Download Directory',
        defaultPath: whatToChange,
        properties: ['openDirectory']
    })
    if (newPaths === undefined) {
        return
    }

    const newPath = newPaths[0]
    fs.writeFileSync(CONFIG_FILE_PATH, `DOWNLOAD_PATH=${
        whatToChange === DOWNLOAD_PATH ? newPath : DOWNLOAD_PATH
    }\nEXPORT_PATH=${
        whatToChange === EXPORT_PATH ? newPath : EXPORT_PATH
    }`)

    loadPath()
}

export function template(window: BrowserWindow): MenuItemConstructorOptions[] {
    const template_default: MenuItemConstructorOptions[] = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Change Download Directory',
                    click: async () => await changeDirectory(window, DOWNLOAD_PATH)
                },
                {
                    label: 'Change Export Directory',
                    click: async () => await changeDirectory(window, EXPORT_PATH)
                },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Github',
                    click: async () => {
                        await shell.openExternal('https://github.com/piz2a/zihocut')
                    }
                }
            ]
        }
    ]

    return [
        ...(isMac ? [appMenu] : []),
        ...template_default,
        ...(isDev ? [viewMenu] : [])
    ]
}
