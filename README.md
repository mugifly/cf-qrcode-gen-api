# cf-qrcode-gen-api

A fast, lightweight QR code generation API built with [Cloudflare Workers](https://workers.cloudflare.com/) and [Hono](https://hono.dev/).

## Deployment

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mugifly/cf-qrcode-gen-api)

## Usage

```
GET /qrcode.svg?text=<text>[&px=300][&qrcolor=000000][&bgcolor=ffffff]
```

| Parameter | Description                                  | Default  |
| --------- | -------------------------------------------- | -------- |
| `text`    | Content to encode (required, max 2048 chars) | —        |
| `px`      | Image size in pixels (10–2048)               | `300`    |
| `qrcolor` | Foreground color as 6-digit hex              | `000000` |
| `bgcolor` | Background color as 6-digit hex              | `ffffff` |

**Example:**

```
GET /qrcode.svg?text=https://example.com&px=300&qrcolor=000000&bgcolor=ffffff
```

## Development

```sh
npm install
npm run dev       # Start local dev server
npm run deploy    # Deploy to Cloudflare Workers
```
