# F1 New Tab

A Chrome extension that replaces the new tab page with the next F1 race weekend — showing the schedule, a countdown, and the circuit image. Also deployable as a standalone web app.

## Structure

```
api/         Node/Express server — fetches live race data from F1
ui/          Vite app — the new tab UI (builds for extension or web)
extension/   Chrome extension packaging — manifest, icons, promo assets
```

## Development

Run the API and UI dev servers together:

```bash
npm run dev
```

The UI dev server proxies `/api` to `http://localhost:3000`, so you can work on the UI in a browser without an extension.

## Chrome extension

Build and package for the Chrome Web Store:

```bash
npm run build:extension
```

Produces `extension/extension.zip`. See [extension/](extension/) for loading unpacked in Chrome.

## Web app (Docker)

Build and run the full stack:

```bash
npm run docker:up
```

The API serves the built UI as static files on port 3000.
