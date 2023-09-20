import type { Browser } from 'puppeteer';

class PuppeteerError extends Error {
  constructor(name: string, error: Error) {
    super(error.message);
    this.name = name;
  }
}
export async function executePuppeteerCommand<T>(
  command: () => Promise<T>,
  browser: Browser,
  commandName: string,
) {
  try {
    const data = await command();
    return data;
  } catch (error) {
    await browser.close();
    throw new PuppeteerError(commandName, error as Error);
  }
}
