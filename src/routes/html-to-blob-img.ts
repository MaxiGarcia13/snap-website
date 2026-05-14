import type { FastifyInstance, FastifyRequest } from 'fastify';
import puppeteer from 'puppeteer';

interface HtmlToBlobImgRequest {
  url: string;
  format?: 'png' | 'jpeg' | 'webp';
}

export default async function htmlToBlobImg(fastify: FastifyInstance) {
  fastify.get('/html-to-blob-img', async (
    request: FastifyRequest<{ Querystring: HtmlToBlobImgRequest }>,
    reply,
  ) => {
    const { url, format = 'png' } = request.query;

    if (!url) {
      return reply.status(400).send({ error: 'URL is required' });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.content();

    const blob = await page.screenshot({ type: format });
    await browser.close();

    return reply.send(blob);
  });
}
