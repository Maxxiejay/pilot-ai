const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  showChat: () => ipcRenderer.invoke('show-chat'),
  closeChat: () => ipcRenderer.invoke('close-chat'),
  captureScreen: () => ipcRenderer.invoke('capture-screen'),
  minimizeToTray: () => ipcRenderer.invoke('minimize-to-tray'),
  
  // For the gemini API
  sendToGemini: (prompt, imageData) => ipcRenderer.invoke('send-to-gemini', prompt, imageData)
});
