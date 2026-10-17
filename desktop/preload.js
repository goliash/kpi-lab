/* KPI Lab desktop app preload script (Electron).
   Exposes safe window closing and privacy-safe telemetry to renderer under contextIsolation. */
const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  window.__electronClose = () => ipcRenderer.send('app-close');
  window.__electronTelemetry = (data) => ipcRenderer.send('kpi-telemetry', data);
});
