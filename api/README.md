# F1 API

Express server that scrapes the F1 website to return data for the current or next race weekend.

## How it works

1. Fetches `formula1.com/en/racing/{year}.html` and extracts the session API key embedded in the page
2. Calls `api.formula1.com/v1/event-tracker` with that key
3. Shapes the response — computes `meetingNumber`, `startAndEndDate`, and `circuitImage.url` — and returns it as JSON

Single endpoint: `GET /api` — returns the active or next race event.

## Development

```bash
npm install
npm run dev    # hot-reloading dev server on port 3000
npm test       # run tests
```

Or from the repo root: `npm run dev` starts the API and UI together.

## Deployment

The full stack (API + UI) runs via Docker Compose from the repo root:

```bash
npm run docker:up
```

Runs on port 3000. To change the port, update the `ports` mapping in `docker-compose.yml`.

## Nginx

Proxy pass to the container:

```nginx
location / {
    proxy_pass http://localhost:3000/;
}
```
