import type { FastifyInstance } from 'fastify';
import websiteToBlobImg from './website-to-blob-img.js';

export default async function initRoutes(fastify: FastifyInstance) {
  await fastify.register(websiteToBlobImg);
}
