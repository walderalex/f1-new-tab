# F1 API

Express server that scrapes the F1 website to return data for the current or next race weekend.

## How it works

1. Fetches `formula1.com/en/racing/{year}.html` and extracts the session API key embedded in the page
2. Calls `api.formula1.com/v1/event-tracker` with that key
3. Shapes the response — computes `meetingNumber`, `startAndEndDate`, and `circuitImage.url` — and returns it as JSON

Single endpoint: `GET /` — returns the active or next race event.

## Development

```bash
npm install
npm run dev       # hot-reloading dev server on port 3000
npm test          # run tests
```

## Docker

```bash
docker compose up -d
```

Runs on port 3000. To change the port:

```yaml
# docker-compose.yml
ports:
  - "4000:3000"
```

Or set `PORT` as an environment variable when running directly:

```bash
PORT=4000 npm start
```

## Nginx

Proxy pass to the container port:

```nginx
location /f1/ {
    proxy_pass http://localhost:3000/;
}
```
