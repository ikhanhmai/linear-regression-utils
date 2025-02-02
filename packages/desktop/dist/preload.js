"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('api', {
    // Add any methods you want to expose to the renderer process here
    saveData: (data) => electron_1.ipcRenderer.invoke('save-data', data),
    loadData: () => electron_1.ipcRenderer.invoke('load-data')
});
