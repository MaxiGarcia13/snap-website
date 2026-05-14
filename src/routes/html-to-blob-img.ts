import type { FastifyInstance, FastifyRequest } from 'fastify';
import puppeteer from 'puppeteer';

interface HtmlToBlobImgRequest {
  url: string;
  format?: 'png' | 'jpeg' | 'webp';
}

const SCREENSHOT_FORMAT_TO_MIME: Record<NonNullable<HtmlToBlobImgRequest['format']>, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};

export default async function htmlToBlobImg(fastify: FastifyInstance) {
  fastify.get('/html-to-blob-img', async (
    request: FastifyRequest<{ Querystring: HtmlToBlobImgRequest }>,
    reply,
  ) => {
    const { url, format: formatParam = 'png' } = request.query;

    if (!url) {
      return reply.status(400).send({ error: 'URL is required' });
    }

    if (!(formatParam in SCREENSHOT_FORMAT_TO_MIME)) {
      return reply.status(400).send({
        error: 'Invalid format',
        allowed: Object.keys(SCREENSHOT_FORMAT_TO_MIME),
      });
    }

    const contentType = SCREENSHOT_FORMAT_TO_MIME[formatParam];

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(url);
      await page.content();

      const blob = await page.screenshot({ type: formatParam });
      await browser.close();

      return reply.type(contentType).send(blob);
    } catch {
      return reply.status(500).send({ error: 'Failed to capture screenshot' });
    }
  });
}
