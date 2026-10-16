/* KPI Lab desktop app (Electron).  TECHNICAL_john.goliash.com.md §4.23
   The window shows app/index.html: the same KPI Lab as john.goliash.com
   (kpi-lab.js, kpi-lab.css, style.css), with its own File / Edit /
   Measures / View / Help menus, so Electron's menu bar is turned off.
   Nothing is loaded from the internet; links to websites open in the
   normal browser. Saved numbers stay in the app's own storage. */
const { app, BrowserWindow, Menu, shell, session } = require('electron');
const path = require('path');

function isWeb(url) { return /^https:\/\//i.test(url); }

function createWindow() {
  const win = new BrowserWindow({
    width: 1120, height: 800, minWidth: 360, minHeight: 560,
    title: 'KPI Lab', backgroundColor: '#0f151c', show: false,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false, spellcheck: false }
  });
  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Links to websites open in the normal browser, never inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => { if (isWeb(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => {
    if (url.startsWith('file://')) return;
    e.preventDefault();
    if (isWeb(url)) shell.openExternal(url);
  });
}

// Offline by design: no spell-check dictionaries, no background downloads.
app.commandLine.appendSwitch('disable-component-update');
app.commandLine.appendSwitch('disable-background-networking');

Menu.setApplicationMenu(null);   // the lab draws its own menus
app.whenReady().then(() => {
  session.defaultSession.setSpellCheckerEnabled(false);
  // The app only ever loads its own files; any web request is refused.
  session.defaultSession.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*'] }, (details, done) => done({ cancel: true }));
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
