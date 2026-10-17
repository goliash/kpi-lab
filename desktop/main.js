/* KPI Lab desktop app (Electron).  TECHNICAL_john.goliash.com.md §4.23
   The window shows app/index.html: the same KPI Lab as john.goliash.com
   (kpi-lab.js, kpi-lab.css, style.css), with its own File / Edit /
   Measures / View / Help menus, so Electron's menu bar is turned off.
   Links to websites open in the normal browser. Saved numbers stay in
   the app's own storage. Telemetry is privacy-first (0-PII, no numbers)
   and sent only to Google Analytics when online. */
const { app, BrowserWindow, Menu, shell, session, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');

function isWeb(url) { return /^https?:\/\//i.test(url); }

// Telemetry configuration (can be overridden by telemetry-config.json or env)
let telemetryConfig = {
  measurementId: 'G-XXXXXXXXXX',
  enabled: true
};

function loadTelemetryConfig() {
  try {
    const localCfg = path.join(__dirname, 'telemetry-config.json');
    const userCfg = path.join(app.getPath('userData'), 'telemetry-config.json');
    const cfgPath = fs.existsSync(localCfg) ? localCfg : (fs.existsSync(userCfg) ? userCfg : null);
    if (cfgPath) {
      const data = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      if (data.measurementId) telemetryConfig.measurementId = data.measurementId;
      if (data.enabled !== undefined) telemetryConfig.enabled = Boolean(data.enabled);
    }
  } catch (e) {}
  if (process.env.GA_MEASUREMENT_ID) {
    telemetryConfig.measurementId = process.env.GA_MEASUREMENT_ID.trim();
  }
  if (process.env.GA_DISABLE === '1' || process.env.GA_DISABLE === 'true') {
    telemetryConfig.enabled = false;
  }
}

// Persistent anonymous client ID for GA4 (UUID v4)
function getAnonymousClientId() {
  try {
    const idPath = path.join(app.getPath('userData'), 'analytics_client_id.txt');
    if (fs.existsSync(idPath)) {
      const existing = fs.readFileSync(idPath, 'utf8').trim();
      if (existing) return existing;
    }
    const newId = crypto.randomUUID ? crypto.randomUUID() : (Math.random().toString(36).substring(2) + '.' + Date.now());
    fs.mkdirSync(app.getPath('userData'), { recursive: true });
    fs.writeFileSync(idPath, newId, 'utf8');
    return newId;
  } catch (e) {
    return 'anon-desktop-user';
  }
}

async function sendTelemetry(data) {
  if (!telemetryConfig.enabled) return;
  const tid = telemetryConfig.measurementId;
  if (!tid || /X{4}/.test(tid)) return; // Skip placeholder IDs

  const cid = getAnonymousClientId();
  const eventName = data.event || 'kpi_desktop_interaction';
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const uptime = Math.round(process.uptime());

  const params = new URLSearchParams({
    v: '2',
    tid: tid,
    cid: cid,
    en: eventName,
    'ep.app_platform': 'desktop',
    'ep.content_type': 'kpi_measure',
    'ep.os_name': os.platform(),
    'ep.os_version': os.release(),
    'ep.system_arch': os.arch(),
    'ep.app_version': app.getVersion(),
    'ep.runtime_seconds': String(uptime),
    'ep.local_hour': String(now.getHours()),
    'ep.local_day': days[now.getDay()],
    'ep.time_of_use': `${days[now.getDay()]} ${now.getHours()}:00`
  });

  if (data.measure_id) params.set('ep.measure_id', data.measure_id);
  if (data.measure_name) params.set('ep.measure_name', data.measure_name);
  if (data.measure_group) params.set('ep.measure_group', data.measure_group);
  if (data.action_name) params.set('ep.action_name', data.action_name);
  if (data.download_type) params.set('ep.download_type', data.download_type);
  if (data.active_duration_seconds) params.set('ep.active_duration_seconds', String(data.active_duration_seconds));
  if (data.distinct_measures_count) params.set('ep.distinct_measures_count', String(data.distinct_measures_count));

  try {
    const url = `https://www.google-analytics.com/g/collect?${params.toString()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    await fetch(url, { method: 'POST', mode: 'no-cors', signal: controller.signal });
    clearTimeout(timeout);
  } catch (err) {
    // Offline or network error: fail silently with zero impact on app usage
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1120, height: 800, minWidth: 360, minHeight: 560,
    title: 'KPI Lab', backgroundColor: '#0f151c', show: false,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      spellcheck: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  ipcMain.on('app-close', () => { try { win.close(); } catch (e) {} });
  ipcMain.on('kpi-telemetry', (event, data) => { sendTelemetry(data); });

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

// Disable unnecessary background components
app.commandLine.appendSwitch('disable-component-update');

Menu.setApplicationMenu(null);   // the lab draws its own menus

app.whenReady().then(() => {
  loadTelemetryConfig();
  session.defaultSession.setSpellCheckerEnabled(false);

  // Allow telemetry to Google Analytics / GTM while blocking all other external requests
  session.defaultSession.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*'] }, (details, done) => {
    const u = details.url;
    if (/^https:\/\/(?:[a-zA-Z0-9-]+\.)*(?:google-analytics\.com|googletagmanager\.com|analytics\.google\.com)\//.test(u)) {
      return done({ cancel: false });
    }
    done({ cancel: true });
  });

  createWindow();
  sendTelemetry({ event: 'kpi_app_launch' });
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('before-quit', () => {
  sendTelemetry({
    event: 'kpi_app_quit',
    runtime_seconds: Math.round(process.uptime())
  });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
