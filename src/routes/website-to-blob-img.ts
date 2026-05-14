import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getBrowser } from '../utils/browser.js';

interface WebsiteToBlobImgQuery {
  url: string;
  format?: 'png' | 'jpeg' | 'webp';
  width?: number;
  height?: number;
}

const SCREENSHOT_FORMAT_TO_MIME: Record<NonNullable<WebsiteToBlobImgQuery['format']>, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

export default async function websiteToBlobImg(fastify: FastifyInstance) {
  fastify.get('/website-to-blob-img', async (
    request: FastifyRequest<{ Querystring: WebsiteToBlobImgQuery }>,
    reply: FastifyReply,
  ) => {
    const {
      url,
      format: formatParam = 'png',
      width = 1280,
      height = 720,
    } = request.query;

    if (!url) {
      return reply.status(400).send({ error: 'URL is required' });
    }

    if (!(formatParam in SCREENSHOT_FORMAT_TO_MIME)) {
      return reply.status(400).send({
        error: 'Invalid format',
        allowed: Object.keys(SCREENSHOT_FORMAT_TO_MIME),
      });
    }

    const format = formatParam as keyof typeof SCREENSHOT_FORMAT_TO_MIME;
    const contentType = SCREENSHOT_FORMAT_TO_MIME[format];

    try {
      const browser = await getBrowser({ width, height });

      const page = await browser.newPage();

      await page.goto(url);
      await page.content();
      await page.waitForNetworkIdle();

      const blob = await page.screenshot({ type: format });
      await browser.close();

      return reply.type(contentType).send(blob);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Failed to capture screenshot' });
    }
  });
}
