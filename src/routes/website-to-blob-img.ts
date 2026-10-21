import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getBrowser } from '../utils/browser.js';

interface WebsiteToBlobImgQuery {
  url: string;
  format?: 'png' | 'jpeg' | 'webp';
  width?: number;
  height?: number;
  wait?: number;
}

const SCREENSHOT_FORMAT_TO_MIME: Record<NonNullable<WebsiteToBlobImgQuery['format']>, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

function isTimeoutError(error: unknown): boolean {
  return error instanceof Error && error.name === 'TimeoutError';
}

export default async function websiteToBlobImg(fastify: FastifyInstance) {
  fastify.get('/website-to-blob-img', async (
    request: FastifyRequest<{ Querystring: WebsiteToBlobImgQuery }>,
    reply: FastifyReply,
  ) => {
    const {
      url: urlParam,
      format: formatParam = 'png',
      width = 1280,
      height = 720,
      wait = undefined,
    } = request.query;

    if (!urlParam) {
      return reply.status(400).send({ error: 'URL is required' });
    }

    const url = decodeURIComponent(urlParam);

    if (!(formatParam in SCREENSHOT_FORMAT_TO_MIME)) {
      return reply.status(400).send({
        error: 'Invalid format',
        allowed: Object.keys(SCREENSHOT_FORMAT_TO_MIME),
      });
    }

    const format = formatParam as keyof typeof SCREENSHOT_FORMAT_TO_MIME;
    const contentType = SCREENSHOT_FORMAT_TO_MIME[format];

    let browser: Awaited<ReturnType<typeof getBrowser>> | undefined;

    try {
      browser = await getBrowser({ width: Number(width), height: Number(height) });

      const page = await browser.newPage();

      // `load` waits for every subresource. Analytics, websockets, and long-polling
      // often never finish, so navigation only waits for the DOM.
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });

      try {
        await page.waitForNetworkIdle({ idleTime: 500, timeout: 10_000 });
      } catch (error) {
        // A page that never goes quiet should still be captured.
        if (!isTimeoutError(error)) {
          throw error;
        }
      }

      if (typeof Number(wait) === 'number' && !Number.isNaN(Number(wait))) {
        await new Promise((resolve) => setTimeout(resolve, Number(wait)));
      }

      const blob = await page.screenshot({ type: format });

      return reply.type(contentType).send(blob);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Failed to capture screenshot';
      return reply.status(500).send({ error: message });
    } finally {
      await browser?.close();
    }
  });
}
