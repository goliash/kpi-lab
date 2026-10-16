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

## License

[MIT](LICENSE).
