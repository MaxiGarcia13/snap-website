import assert from 'node:assert/strict';
import process from 'node:process';
import { describe, it } from 'node:test';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:3456';

const PAGE = 'data:text/html,<html><body><h1>snap</h1></body></html>';
const encodedPage = encodeURIComponent(PAGE);
const LIVE_PAGE = 'https://runjs-playground.vercel.app/';

const PNG_SIG = [0x89, 0x50, 0x4E, 0x47];
const JPEG_SIG = [0xFF, 0xD8, 0xFF];
const RIFF_SIG = [0x52, 0x49, 0x46, 0x46];
const WEBP_SIG = [0x57, 0x45, 0x42, 0x50];

function bytesEqual(actual: Uint8Array, expected: number[]) {
  return expected.every((byte, index) => actual[index] === byte);
}

async function get(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);
  const rawPayload = Buffer.from(await res.arrayBuffer());

  return {
    statusCode: res.status,
    headers: {
      'content-type': res.headers.get('content-type'),
    },
    rawPayload,
    async json() {
      return JSON.parse(rawPayload.toString('utf8')) as unknown;
    },
  };
}

describe('GET /website-to-blob-img', () => {
  it('returns 400 when url is missing', async () => {
    const res = await get('/website-to-blob-img');

    assert.equal(res.statusCode, 400);
    assert.deepEqual(await res.json(), { error: 'URL is required' });
  });

  it('returns 400 when format is invalid', async () => {
    const res = await get(`/website-to-blob-img?url=${encodedPage}&format=gif`);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(await res.json(), {
      error: 'Invalid format',
      allowed: ['png', 'jpeg', 'webp'],
    });
  });

  it('defaults to png when format is omitted', { timeout: 60_000 }, async () => {
    const res = await get(`/website-to-blob-img?url=${encodedPage}`);

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/png');
    assert.ok(res.rawPayload.length > 100);
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 4), PNG_SIG));
  });

  it('returns png when format=png', { timeout: 60_000 }, async () => {
    const res = await get(`/website-to-blob-img?url=${encodedPage}&format=png`);

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/png');
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 4), PNG_SIG));
  });

  it('returns jpeg when format=jpeg', { timeout: 60_000 }, async () => {
    const res = await get(`/website-to-blob-img?url=${encodedPage}&format=jpeg`);

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/jpeg');
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 3), JPEG_SIG));
  });

  it('returns webp when format=webp', { timeout: 60_000 }, async () => {
    const res = await get(`/website-to-blob-img?url=${encodedPage}&format=webp`);

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/webp');
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 4), RIFF_SIG));
    assert.ok(bytesEqual(res.rawPayload.subarray(8, 12), WEBP_SIG));
  });

  it('accepts custom width and height', { timeout: 60_000 }, async () => {
    const res = await get(`/website-to-blob-img?url=${encodedPage}&width=800&height=600`);

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/png');
    assert.ok(res.rawPayload.length > 100);
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 4), PNG_SIG));
  });

  it('accepts wait', { timeout: 60_000 }, async () => {
    const res = await get(`/website-to-blob-img?url=${encodedPage}&wait=100`);

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/png');
    assert.ok(res.rawPayload.length > 100);
  });

  it('captures a live page that may never become network idle', { timeout: 40_000 }, async () => {
    const startedAt = Date.now();
    const res = await get(`/website-to-blob-img?url=${encodeURIComponent(LIVE_PAGE)}`);
    const elapsed = Date.now() - startedAt;

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/png');
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 4), PNG_SIG));
    assert.ok(elapsed < 25_000);
  });

  it('accepts all parameters together', { timeout: 60_000 }, async () => {
    const res = await get(
      `/website-to-blob-img?url=${encodedPage}&format=jpeg&width=640&height=480&wait=50`,
    );

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'image/jpeg');
    assert.ok(res.rawPayload.length > 100);
    assert.ok(bytesEqual(res.rawPayload.subarray(0, 3), JPEG_SIG));
  });
});
