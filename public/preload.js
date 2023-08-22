import { contextBridge } from 'electron'
import remote from 'electron-remote'

contextBridge.exposeInMainWorld('remote', remote);

const performHeavyTask = window.remote.require('electron').performTaskProcess;

performHeavyTask(5, (result) => {
    console.log('Task process result:', result);
});

/*
const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => {
        const validChannels = ["youtube-download"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        const validChannels = ["youtube-download-complete"];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
        }
    }
})
 */