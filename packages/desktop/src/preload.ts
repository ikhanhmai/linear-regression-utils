import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // Add any methods you want to expose to the renderer process here
    saveData: (data: unknown) => ipcRenderer.invoke('save-data', data),
    loadData: () => ipcRenderer.invoke('load-data')
  }
);
