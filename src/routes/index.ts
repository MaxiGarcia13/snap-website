import type { FastifyInstance } from 'fastify';
import htmlToBlobImg from './html-to-blob-img.js';

export default async function initRoutes(fastify: FastifyInstance) {
  await fastify.register(htmlToBlobImg);
}
