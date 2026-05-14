import process from 'node:process';
import Fastify from 'fastify';
import initRoutes from './routes/index.js';

const fastify = Fastify({
  logger: true,
});

initRoutes(fastify);

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
