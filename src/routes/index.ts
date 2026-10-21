import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { APP_INFO } from '../doc/app.js';
import playground from './playground.js';
import websiteToBlobImg from './website-to-blob-img.js';

export default async function initRoutes(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: '*',
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
  });

  fastify.get('/info', async (_, reply) => {
    return reply.status(200).send(APP_INFO);
  });

  await fastify.register(playground);
  await fastify.register(websiteToBlobImg);
}
