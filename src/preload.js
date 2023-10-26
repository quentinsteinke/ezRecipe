const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      // whitelist channels for ipcRenderer
      let validIpcChannels = ["get-random-recipe"];
      if (validIpcChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      // whitelist channels for ipcRenderer
      let validIpcChannels = ["send-random-recipe"];
      if (validIpcChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    fileExists: (path) => {
      // You can add more checks here to restrict file access
      return fs.existsSync(path);
    }
  }
);
