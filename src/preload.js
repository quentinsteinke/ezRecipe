const { ipcRenderer } = require('electron');

window.ipcRenderer = ipcRenderer;

console.log('preload.js loaded');