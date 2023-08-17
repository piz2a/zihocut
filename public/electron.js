"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var isDev = require("electron-is-dev");
var electron_prompt_1 = require("electron-prompt");
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
electron_1.ipcMain.handle('SEND_MAIN_PING', function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log(arg);
        return [2 /*return*/, "hehe"];
    });
}); });
electron_1.ipcMain.handle('PROMPT_URL', function (event, title, label) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, electron_prompt_1["default"])({
                title: title,
                label: label,
                value: "",
                inputAttrs: {
                    type: 'url'
                },
                type: 'input'
            }).then(function (result) { return result; })["catch"](console.error)];
    });
}); });
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
/*
const path = window.require('path')
const url = window.require('url')
const PythonShell = window.require('python-shell')
const {dialog} = electron.remote;
/*

const PUBLIC_PATH = path.join(__dirname, process.env.PUBLIC_URL)
const PYTHON_PATH = path.join(PUBLIC_PATH, 'venv/Scripts/python')
 */
/*
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
