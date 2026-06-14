# F1 New Tab Extension

Chrome extension (Manifest V3). Replaces the new tab page with the next F1 race weekend.

## Structure

```
manifest.json    Extension manifest
Icon.png         Extension icon
dist/            Built UI (generated — not committed)
extension.zip    Packaged extension (generated — not committed)
```

The UI lives in `../ui/` and is built into `dist/` here at package time.

## Building and packaging

From the repo root:

```bash
npm run build:extension
```

This builds the UI in extension mode, copies the output to `extension/dist/`, and produces `extension.zip`.

## Loading unpacked in Chrome

1. Run `npm run build:extension` from the repo root
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select this `extension/` directory

## Publishing to the Chrome Web Store

Upload `extension.zip` to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
