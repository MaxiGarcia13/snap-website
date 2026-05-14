# snap-website

REST API that captures screenshots of web pages using [Puppeteer](https://pptr.dev/) and [Fastify](https://fastify.dev/).

## Requirements

- Node.js (see your local version; TypeScript targets modern Node)
- Chrome for Puppeteer (installed automatically via the `prepare` script after `npm install`)

## Setup

```bash
npm install
```

The `prepare` script runs `npx puppeteer browsers install chrome` so Puppeteer can launch a browser.

## Scripts

| Command            | Description                            |
| ------------------ | -------------------------------------- |
| `npm run dev`      | Run the server with hot reload (tsx)   |
| `npm run build`    | Compile TypeScript to `dist/`          |
| `npm start`        | Run compiled server (`dist/server.js`) |
| `npm run lint`     | ESLint                                 |
| `npm run lint:fix` | ESLint with auto-fix                   |

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

The server listens on **port 3000** by default.

## API

### `GET /website-to-blob-img`

Returns a screenshot of the given page as binary image data.

**Query parameters**

| Name     | Required | Description                                       |
| -------- | -------- | ------------------------------------------------- |
| `url`    | Yes      | Page to capture (must be loadable by the server). |
| `format` | No       | `png` (default), `jpeg`, or `webp`.               |

**Success**

- Status `200`
- `Content-Type`: `image/png`, `image/jpeg`, or `image/webp` depending on `format`

**Errors**

- `400` — Missing `url`, or invalid `format`
- `500` — Screenshot failed (e.g. navigation or browser error)

**Example**

```bash
curl -o screenshot.png "http://localhost:3000/website-to-blob-img?url=https://example.com&format=png"
```

## Rate limiting

Requests are limited to **10 per minute** per client (see `src/server.ts`).

## License

ISC

## Repository

[github.com/MaxiGarcia13/snap-website](https://github.com/MaxiGarcia13/snap-website)
