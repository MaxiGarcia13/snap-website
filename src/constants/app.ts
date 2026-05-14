import type { AppInfo } from '../types/app.js';
import packageJson from '../../package.json' with { type: 'json' };
import { WEBSITE_TO_BLOB_IMG_ENDPOINT } from './endpoints/website-to-blob-img.js';

export const APP_INFO: AppInfo = {
  name: packageJson.name,
  version: packageJson.version,
  author: packageJson.author,
  description: packageJson.description,
  homepage: packageJson.homepage,
  timestamp: new Date().toISOString(),
  status: 'active',
  endpoints: [
    WEBSITE_TO_BLOB_IMG_ENDPOINT,
  ],
};
