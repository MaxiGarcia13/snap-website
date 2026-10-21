import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import initRoutes from './routes/index.js';

export interface BuildAppOptions {
  /** Disable rate limiting so e2e suites can hit the API freely. */
  disableRateLimit?: boolean;
  logger?: boolean;
}

export async function buildApp(options: BuildAppOptions = {}) {
  const { disableRateLimit = false, logger = true } = options;

  const fastify = Fastify({ logger });

  if (!disableRateLimit) {
    await fastify.register(rateLimit, {
      max: 20,
      timeWindow: '1 minute',
    });
  }

  await initRoutes(fastify);

  return fastify;
}
