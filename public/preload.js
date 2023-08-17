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