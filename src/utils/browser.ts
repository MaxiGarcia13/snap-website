import type { Viewport } from 'puppeteer-core';
import process from 'node:process';
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';

export async function getBrowser({ width = 1280, height = 720 }: { width?: number; height?: number }) {
  const defaultViewport: Viewport = {
    width,
    height,
    deviceScaleFactor: 1,
    isMobile: false,
    isLandscape: true,
  };

  if (process.env.IS_SERVERLESS) {
    const executablePath = await chromium.executablePath();
    const headless = 'shell' as const;

    chromium.setGraphicsMode = false;

    return puppeteerCore.launch({
      args: await puppeteerCore.defaultArgs({
        args: chromium.args,
        headless,
      }),
      defaultViewport,
      executablePath,
      headless,
    });
  }

  const puppeteer = await import('puppeteer');

  // GitHub Actions (and similar CI) run as an unprivileged user; Chrome's
  // sandbox needs extra capabilities that aren't available there.
  const args = process.env.CI
    ? ['--no-sandbox', '--disable-setuid-sandbox']
    : undefined;

  return puppeteer.launch({ defaultViewport, headless: true, args });
}
