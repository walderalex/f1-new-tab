# F1 New Tab Extension

Chrome extension (Manifest V3). Replaces the new tab page with the next F1 race weekend.

## Structure

```
newtab/src/background.ts    Service worker — caches API responses, handles refresh logic
newtab/src/main.ts          New tab UI entry point
newtab/                     Vite app — built into newtab/dist/
manifest.json               Extension manifest
```

Both `background.ts` and the newtab UI are built together by Vite into `newtab/dist/`.

## Setup

```bash
cd newtab
npm install
```

## Building

```bash
# from extension/
npm run build
```

Output goes to `newtab/dist/`. Load the `extension/` directory as an unpacked extension in Chrome.

## Development

The newtab communicates with the background service worker via `chrome.runtime.sendMessage`. Outside of a Chrome extension context, that throws — and the newtab falls back to fetching the API directly.

```bash
# 1. start the API
cd ../api && npm run dev

# 2. configure the API URL
cd extension/newtab
cp .env.example .env   # VITE_API_URL=http://localhost:3000

# 3. start the dev server
npm run dev
```

Open the dev server URL in a browser. Data loads directly from the API with no extension required.

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | API server URL, baked in at build time | `http://localhost:3000` |

Set in `newtab/.env` for dev, or pass at build time for production:

```bash
VITE_API_URL=https://api.example.com npm run build
```

## Loading in Chrome

1. `npm run build`
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `extension/` directory

## Publishing to the Chrome Web Store

```bash
# from extension/
npm run package
```

Builds and produces `extension.zip` containing only the files Chrome needs (`manifest.json`, `Icon.png`, `newtab/dist/`). Upload that zip to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
