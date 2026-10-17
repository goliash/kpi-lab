# KPI Lab

Fourteen inventory, ordering, shipping and plant-floor measures, each with its formula and a
plain-words lesson: inventory accuracy, turns, days of supply, reorder point, safety stock, order
size (EOQ), fill rate, on-time shipping, perfect orders, backorder rate, picks per hour, OEE, scrap
rate and takt time.

It runs entirely on your device. Nothing you type is sent anywhere.

## Get it

| Where | How |
|---|---|
| **Windows, Mac, Linux** | [Latest release](https://github.com/goliash/kpi-lab/releases/latest): installer or no-install `.exe`, `.dmg` (Apple chip or Intel), `.AppImage` or `.deb`. See [docs/INSTALL.md](docs/INSTALL.md). |
| **Phone or any browser** | Open [john.goliash.com/kpi-lab](https://john.goliash.com/kpi-lab), then **File › Install on this device** (iPhone: Share › Add to Home Screen). It gets its own icon and works offline. |
| **On the web** | Inside [john.goliash.com](https://john.goliash.com/#lab). |

## How it's built

- `index.html`, `css/`, `js/kpi-lab.js`: the app, plain HTML, CSS and JavaScript, no framework.
  Classic File / Edit / Measures / View / Help menus, keyboard shortcuts, save (browser storage),
  CSV export, print.
- `kpi-lab.webmanifest`, `kpi-sw.js`: make it installable and offline.
- `desktop/`: the same app in an [Electron](https://www.electronjs.org/) window. It never goes
  online: every web request is refused and links open in your normal browser.
- `.github/workflows/release.yml`: on a version tag (`v1.0.0`), GitHub builds the Windows, Mac and
  Linux apps and attaches them to a release.

Run the desktop app from source:

```bash
cd desktop
cp ../css/*.css ../js/kpi-lab.js app/     # Windows: copy the same files by hand
npm install
npm start
```

Release a new version: bump `version` in `desktop/package.json`, then
`git tag v1.0.1 && git push --tags`.

## Connecting Your Own Google Analytics (GA4)

You can track how visitors interact with the 14 measures (which calculators are selected, calculated, or exported) using your own Google Analytics 4 property:

### 1. Web & PWA Version
In `index.html`:
- Replace `G-XXXXXXXXXX` with your Google Analytics 4 Measurement ID.
- Replace `GTM-XXXXXXX` with your Google Tag Manager Container ID.

### 2. Desktop App (Electron)
In the `desktop/` folder:
- Copy `telemetry-config.example.json` to `telemetry-config.json`:
  ```json
  {
    "measurementId": "G-YOUR-ID-HERE",
    "enabled": true
  }
  ```
- Alternatively, launch with an environment variable:
  ```bash
  export GA_MEASUREMENT_ID="G-YOUR-ID-HERE"
  npm start
  ```
- To disable all telemetry, set `"enabled": false` or `GA_DISABLE=1`.

> **Privacy Guarantee:** Telemetry only transmits the event name, measure name (e.g. "Inventory turns"), and action type (e.g. CSV download). Zero user input numbers or financial values are ever transmitted.

## Telemetry Vault Dashboard (Demo on GitHub Pages)

The repository includes a password-protected Telemetry & Analytics Dashboard featuring a live event stream console, 14-measure dispatch simulation matrix, and Google Looker Studio report embedding:

- **Live Demo on GitHub Pages**: [https://goliash.github.io/kpi-lab/telemetry-vault-demo.html](https://goliash.github.io/kpi-lab/telemetry-vault-demo.html)
- **Demo Access Key**: `demo-analytics-2026!`
- **Running Your Own Vault**:
  1. Rename `telemetry-vault-demo.html` to your own private secret URL (e.g. `telemetry-vault-<random-token>.html`).
  2. Set your custom salt and password hash in `analytics-auth.json` (or use `tools/set-analytics-password.py`).
  3. Enter your own Looker Studio embed URL in the dashboard to view your custom analytics reports.

## License

[MIT](LICENSE).
