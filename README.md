# F1 New Tab

A Chrome extension that replaces the new tab page with the next F1 race weekend — showing the schedule, a countdown, and the circuit image.

## Structure

```
extension/   Chrome extension (Manifest V3)
api/         Self-hosted API server (Node/Express)
```

The extension fetches race data from the API. The background service worker caches responses in `chrome.storage.local` for up to 12 hours, refreshing automatically when the next session starts.

## Quick start

See the README in each directory:

- [api/](api/) — run the API locally or via Docker
- [extension/](extension/) — build and load the extension
