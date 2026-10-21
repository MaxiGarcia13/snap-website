import process from 'node:process';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import initRoutes from './routes/index.js';

const fastify = Fastify({
  logger: true,
});

await fastify.register(rateLimit, {
  max: 20,
  timeWindow: '1 minute',
});

await initRoutes(fastify);

const port = typeof process.env.PORT === 'string'
  ? Number.parseInt(process.env.PORT)
  : 3000;

fastify.listen({ port }).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
