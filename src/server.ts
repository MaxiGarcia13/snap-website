import process from 'node:process';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import initRoutes from './routes/index.js';

const fastify = Fastify({
  logger: true,
});

await fastify.register(rateLimit, {
  max: 10,
  timeWindow: '1 minute',
});

initRoutes(fastify);

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
