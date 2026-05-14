import type { AppEndpoint } from '../../types/app.js';

export const WEBSITE_TO_BLOB_IMG_ENDPOINT: AppEndpoint = {
  path: '/website-to-blob-img',
  method: 'GET',
  status: 'active',
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
};
