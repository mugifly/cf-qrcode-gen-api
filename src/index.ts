import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import QRCode from "qrcode-svg";
import { hexColor } from "./schema";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get(
  "/qrcode.svg",
  zValidator(
    "query",
    z.object({
      text: z
        .string()
        .min(1, "text is required")
        .max(2048, "text must be within 2048 characters"),
      px: z.coerce.number().int().min(10).max(2048).default(300),
      qrcolor: hexColor.default("000000"),
      bgcolor: hexColor.default("ffffff"),
    }),
  ),
  async (c) => {
    const { text, px, qrcolor, bgcolor } = c.req.valid("query");

    // Rate limiting with IP address
    const ip = c.req.header("CF-Connecting-IP") ?? "unknown";
    const { success } = await c.env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return c.text("Rate limit exceeded. Try again later.", 429);
    }

    // Find a cached response for the same request
    const cache = caches.default;
    const cacheKey = new Request(c.req.url);
    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate QR code SVG
    const qr = new QRCode({
      content: text,
      width: px,
      height: px,
      color: "#" + qrcolor,
      background: "#" + bgcolor,
      join: true,
      container: "svg",
      pretty: false,
      xmlDeclaration: false,
    });

    const svg = qr.svg();

    // Generate response with a cache configuration
    const CACHE_TTL = 60 * 60 * 24 * 365; // 1 year
    const response = new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": `public, max-age=${CACHE_TTL}, immutable`,
      },
    });

    // Cache the response for future requests
    c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));

    // Send the response
    return response;
  },
);

export default app;
