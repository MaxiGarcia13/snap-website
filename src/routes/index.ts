import type { FastifyInstance } from 'fastify';
import { APP_INFO } from '../constants/app.js';
import websiteToBlobImg from './website-to-blob-img.js';

export default async function initRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (_, reply) => {
    return reply.status(200).send(APP_INFO);
  });

  await fastify.register(websiteToBlobImg);
}
