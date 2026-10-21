import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PLAYGROUND_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../public/playground.html',
);

async function sendPlayground(_request: FastifyRequest, reply: FastifyReply) {
  const html = await readFile(PLAYGROUND_PATH, 'utf8');
  return reply.type('text/html').send(html);
}

export default async function playground(fastify: FastifyInstance) {
  fastify.get('/', sendPlayground);
  fastify.get('/playground', sendPlayground);
}
