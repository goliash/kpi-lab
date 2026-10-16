/* KPI Lab desktop app preload script (Electron).
   Exposes safe window closing to renderer under contextIsolation. */
const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  window.__electronClose = () => ipcRenderer.send('app-close');
});
