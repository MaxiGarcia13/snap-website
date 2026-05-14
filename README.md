# snap-website

REST API that captures screenshots of web pages using [Puppeteer](https://pptr.dev/) and [Fastify](https://fastify.dev/).

Locally it uses the full `puppeteer` package with a system Chrome install. When `IS_SERVERLESS` is set, it uses [puppeteer-core](https://pptr.dev/) with [@sparticuz/chromium](https://github.com/Sparticuz/chromium) for environments such as AWS Lambda.

## Requirements

- A recent [Node.js](https://nodejs.org/) LTS release (the project uses `NodeNext` modules and modern syntax)
- For **local** runs: Chrome installed for Puppeteer (`npm run install:chrome` after dependencies are installed)

## Setup

```bash
npm install
npm run install:chrome
```

`install:chrome` runs `npx puppeteer browsers install chrome` so Puppeteer can launch the browser on your machine. Serverless deployments do not need this when using the packaged Chromium path.

## Environment variables

| Variable        | Description                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| `PORT`          | HTTP port (default **3000**)                                                                           |
| `IS_SERVERLESS` | When set (any truthy value), launch Chromium via `@sparticuz/chromium` instead of bundled local Chrome |

Optional [dotenv](https://nodejs.org/api/cli.html#--env-filefile)-style files are supported in production: `npm start` uses `node --env-file-if-exists .env` so you can place `PORT` or other vars in `.env` if you use that workflow.

## Scripts

| Command                  | Description                            |
| ------------------------ | -------------------------------------- |
| `npm run dev`            | Run the server with hot reload (tsx)   |
| `npm run build`          | Compile TypeScript to `dist/`          |
| `npm start`              | Run compiled server (`dist/server.js`) |
| `npm run install:chrome` | Install Chrome for local Puppeteer     |
| `npm run lint`           | ESLint                                 |
| `npm run lint:fix`       | ESLint with auto-fix                   |

## Running

Development:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

The server listens on **port 3000** unless `PORT` is set.

## API

### `GET /`

Returns JSON describing the service, version, and available endpoints (including query parameters for `/website-to-blob-img`).

### `GET /website-to-blob-img`

Returns a screenshot of the given page as binary image data.

**Query parameters**

| Name     | Required | Description                                       |
| -------- | -------- | ------------------------------------------------- |
| `url`    | Yes      | Page to capture (must be loadable by the server). |
| `format` | No       | `png` (default), `jpeg`, or `webp`.               |
| `width`  | No       | Viewport width in pixels (default **1280**).      |
| `height` | No       | Viewport height in pixels (default **720**).      |

**Success**

- Status `200`
- `Content-Type`: `image/png`, `image/jpeg`, or `image/webp` depending on `format`

**Errors**

- `400` — Missing `url`, or invalid `format`
- `500` — Screenshot failed (e.g. navigation or browser error)

**Example**

Check this example with this URL: [Fetcher](https://fetcherapi.vercel.app/?url=aHR0cHM6Ly9zbmFwLXdlYnNpdGUtYXBpLnZlcmNlbC5hcHAvd2Vic2l0ZS10by1ibG9iLWltZw%3D%3D&params=W3siaWQiOiIwZTIxNDE3Zi1iNTYyLTQzZDEtYjMxMC1hNTJlMDY4MmZlNWIiLCJrZXkiOiJ1cmwiLCJ2YWx1ZSI6Imh0dHBzOi8vdmlub3NsbS52ZXJjZWwuYXBwIiwiaGlkZGVuIjpmYWxzZSwibWFza2VkIjpmYWxzZX0seyJpZCI6IjM4NGE4MjAyLTAwNDUtNGI1OS1hOTM1LWE3OTE3MGUwM2QwOSIsImtleSI6IiIsInZhbHVlIjoiIiwiaGlkZGVuIjpmYWxzZSwibWFza2VkIjpmYWxzZX1d).

## Rate limiting

Requests are limited to **10 per minute** per client (see `src/server.ts`).

## License

ISC

## Repository

[github.com/MaxiGarcia13/snap-website](https://github.com/MaxiGarcia13/snap-website)
