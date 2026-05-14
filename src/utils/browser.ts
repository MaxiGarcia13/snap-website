import type { Viewport } from 'puppeteer-core';
import process from 'node:process';
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';

export async function getBrowser({ width = 1280, height = 720 }: { width?: number; height?: number }) {
  const headless = true;

  const defaultViewport: Viewport = {
    width,
    height,
    deviceScaleFactor: 1,
    isMobile: false,
    isLandscape: true,
  };

  if (process.env.IS_SERVERLESS) {
    const executablePath = await chromium.executablePath();

    chromium.setGraphicsMode = false;

    return puppeteerCore.launch({
      args: puppeteerCore
        .defaultArgs({
          args: chromium.args,
          headless: 'shell',
        }),
      defaultViewport,
      executablePath,
      headless,
    });
  }

  const puppeteer = await import('puppeteer');

  return puppeteer.launch({ defaultViewport, headless });
}
