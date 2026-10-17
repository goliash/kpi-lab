# KPI Lab (desktop)

The KPI Lab from [john.goliash.com](https://john.goliash.com/#lab) in its own window.
Fourteen measures and planning tools for inventory, ordering, shipping and the plant
floor. Each one shows the formula, explains it in plain words and says how to read the
result. It works without the internet, and nothing you type is sent anywhere.

## Run it

1. Install Node.js from https://nodejs.org (one time).
2. Unzip this folder and open a terminal (Command Prompt or PowerShell on Windows) in it.
3. Type `npm install` and wait. It downloads Electron (about 100 MB).
4. Type `npm start`.

## Make an installer

- Windows: `npm run dist:win` makes an installer and a portable .exe in `dist\`.
- Mac: `npm run dist:mac` makes a .dmg (build it on a Mac).
- Linux: `npm run dist:linux` makes an AppImage.

## Using it

- **File**: Save (Ctrl+S) keeps your numbers in the app; Open saved (Ctrl+O); Download
  this result or all 14 as a CSV file for Excel; Print (Ctrl+P); Exit.
- **Edit**: copy the result, reset one measure or all of them, delete saved numbers.
- **Measures**: pick any of the 14.
- **View**: lesson cards on or off, dark mode, full screen.
- **Help**: how to use it, what a KPI is, about.

## Telemetry & Analytics (Privacy-First)

The app reports anonymous usage events (measure selects, calculations, CSV exports) to Google Analytics 4 when online. Zero user numbers or financial figures are ever sent.

To use your own GA4 property or disable telemetry:
- Copy `telemetry-config.example.json` to `telemetry-config.json` and set your `measurementId`.
- Set `"enabled": false` (or run with `GA_DISABLE=1`) to turn off all telemetry completely.

Made by John Goliash. The same code runs on the website: `js/kpi-lab.js`,
`css/kpi-lab.css` and `css/style.css` are copied into `app/` by the site's build step
(see TECHNICAL_john.goliash.com.md §4.23).

