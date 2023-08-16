"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var isDev = require("electron-is-dev");
var BASE_URL = 'http://localhost:3000';
var window;
var createWindow = function () {
    window = new electron_1.BrowserWindow({
        width: 800,
        height: 700,
        icon: path.join(__dirname, 'logo64.png'),
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    window.removeMenu();
    window.setResizable(false);
    window.once('ready-to-show', function () {
        // @ts-ignore
        window.show();
    });
    if (isDev) {
        window.loadURL(BASE_URL);
        window.webContents.openDevTools();
    }
    else {
        window.loadFile(path.join(__dirname, '../build/index.html'));
    }
    window.on('closed', function () {
        window = null;
    });
};
electron_1.app.on('ready', function () {
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
