import type { FastifyInstance } from 'fastify';
import packageJson from '../../package.json' with { type: 'json' };
import websiteToBlobImg from './website-to-blob-img.js';

export default async function initRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (_, reply) => {
    return reply.status(200).send({
      message: 'Snap Website API is running',
      version: packageJson.version,
      timestamp: new Date().toISOString(),
    });
  });

  await fastify.register(websiteToBlobImg);
}
