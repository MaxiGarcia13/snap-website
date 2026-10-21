import process from 'node:process';
import { buildApp } from './build-app.js';

const fastify = await buildApp();

fastify.listen({ port: typeof process.env.PORT === 'string' ? Number.parseInt(process.env.PORT) : 3000 })
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });
