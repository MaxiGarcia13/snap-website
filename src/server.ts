import process from 'node:process';
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});

fastify.get('/', async () => {
  return { hello: 'world from snap-html' };
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
