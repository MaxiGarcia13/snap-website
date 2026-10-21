import type { FastifyInstance } from 'fastify';
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { buildApp } from '../src/app.js';

const PAGE = 'data:text/html,<html><body><h1>snap</h1></body></html>';
const encodedPage = encodeURIComponent(PAGE);

const PNG_SIG = [0x89, 0x50, 0x4E, 0x47];
const JPEG_SIG = [0xFF, 0xD8, 0xFF];
const RIFF_SIG = [0x52, 0x49, 0x46, 0x46];
const WEBP_SIG = [0x57, 0x45, 0x42, 0x50];

function bytesEqual(actual: Uint8Array, expected: number[]) {
  return expected.every((byte, index) => actual[index] === byte);
}

describe('GET /website-to-blob-img', () => {
  let app: FastifyInstance;

  before(async () => {
    app = await buildApp({ disableRateLimit: true, logger: false });
  });

  after(async () => {
    await app.close();
  });

  it('returns 400 when url is missing', async () => {
    const res = await app.inject({ method: 'GET', url: '/website-to-blob-img' });

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.json(), { error: 'URL is required' });
  });

  it('returns 400 when format is invalid', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/website-to-blob-img?url=${encodedPage}&format=gif`,
    });

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.json(), {
      error: 'Invalid format',
      allowed: ['png', 'jpeg', 'webp'],
    });
  });

  it('defaults to png when format is omitted', { timeout: 60_000 }, async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/website-to-blob-img?url=${encodedPage}`,
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/png');
    assert.ok(res.rawPayload.length > 100);
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 4), PNG_SIG));
  });

  it('returns png when format=png', { timeout: 60_000 }, async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/website-to-blob-img?url=${encodedPage}&format=png`,
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/png');
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 4), PNG_SIG));
  });

  it('returns jpeg when format=jpeg', { timeout: 60_000 }, async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/website-to-blob-img?url=${encodedPage}&format=jpeg`,
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/jpeg');
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 3), JPEG_SIG));
  });

  it('returns webp when format=webp', { timeout: 60_000 }, async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/website-to-blob-img?url=${encodedPage}&format=webp`,
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/webp');
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 4), RIFF_SIG));
    assert.ok(bytesEqual(res.rawPayload.subarray(8, 12), WEBP_SIG));
  });

  it('accepts custom width and height', { timeout: 60_000 }, async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/website-to-blob-img?url=${encodedPage}&width=800&height=600`,
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/png');
    assert.ok(res.rawPayload.length > 100);
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 4), PNG_SIG));
  });

  it('accepts wait', { timeout: 60_000 }, async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/website-to-blob-img?url=${encodedPage}&wait=100`,
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/png');
    assert.ok(res.rawPayload.length > 100);
  });

  it('accepts all parameters together', { timeout: 60_000 }, async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/website-to-blob-img?url=${encodedPage}&format=jpeg&width=640&height=480&wait=50`,
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/jpeg');
    assert.ok(res.rawPayload.length > 100);
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 3), JPEG_SIG));
  });
});
