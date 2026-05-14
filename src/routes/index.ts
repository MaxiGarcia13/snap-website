import type { FastifyInstance } from 'fastify';
import packageJson from '../../package.json' with { type: 'json' };
import websiteToBlobImg from './website-to-blob-img.js';

export default async function initRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (_, reply) => {
    return reply.status(200).send({
      message: 'Snap Website API is running',
      version: packageJson.version,
      timestamp: new Date().toISOString(),
      author: packageJson.author,
      endpointAvailable: [
        {
          path: '/website-to-blob-img',
          description: 'Capture a screenshot of a website and return it as a blob image',
          query: {
            url: {
              type: 'string',
              description: 'The URL of the website to capture',
              required: true,
            },
            format: {
              type: 'string',
              description: 'The format of the image to return',
              required: false,
              values: ['png', 'jpeg', 'webp'],
              default: 'png',
            },
            width: {
              type: 'number',
              description: 'The width of the image to return',
              required: false,
              default: 1280,
            },
            height: {
              type: 'number',
              description: 'The height of the image to return',
              required: false,
              default: 720,
            },
          },
        },
      ],
    });
  });

  await fastify.register(websiteToBlobImg);
}
