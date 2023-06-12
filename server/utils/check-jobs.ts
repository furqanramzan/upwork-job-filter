import { launch } from 'puppeteer';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Job } from '@prisma/client';

export async function checkJobs() {
  const configs = useRuntimeConfig();

  const preventWords = [
    'wordpress',
    'shopify',
    'paypal',
    'elementor',
    'woo commerce',
  ];

  const executablePath =
    '/etc/profiles/per-user/furqan/bin/google-chrome-stable';
  const browser = await launch({
    headless: 'new',
    userDataDir: './tmp',
    executablePath,
  });

  const jobs: Job[] = [];

  try {
    const page = await browser.newPage();
    await page.goto('https://www.upwork.com/nx/find-work/');

    const loggedIn = await page
      .$eval('[name="login[username]"]', () => false)
      .catch(() => true);
    if (!loggedIn) {
      await page.focus('input[name="login[username]"]');
      await page.keyboard.type(configs.UPWORK_USERNAME);
      await page.keyboard.press('Enter');
      await page.waitForSelector('input[name="login[password]"]');
      await page.click('#login_rememberme');
      await page.focus('input[name="login[password]"]');
      await page.keyboard.type(configs.UPWORK_PASSWORD);
      await page.keyboard.press('Enter');
      // TODO: Add wait for selector.
      await sleep(9000);
    }

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await sleep(1000);

    const jobTitles = await page.$$eval('h3.job-tile-title > a', (group) =>
      group.map((g) => ({ title: g.innerText, url: g.href, description: '' })),
    );

    const jobDescriptions = await page.$$eval(
      'div.up-line-clamp-v2-wrapper > div.up-line-clamp-v2 > span',
      (group) => group.map((g) => g.innerText),
    );

    const allJobs = jobTitles.map((job, index) => ({
      ...job,
      description: jobDescriptions[index],
    }));

    const visitedJobs = await page.$$eval(
      'section.up-card-visited > div > div > h3 > a',
      (group) => group.map((g) => g.href),
    );

    for await (const job of allJobs) {
      const url = job.url;
      const title = job.title.toLowerCase();
      const description = job.description.toLowerCase();

      const isFiltered = preventWords.some(
        (word) => title.includes(word) || description.includes(word),
      );

      const visisted = visitedJobs.includes(url);

      if (!visisted) {
        const { data, error } = await promise(() =>
          prisma.job.create({ data: { ...job, isFiltered } }),
        );
        if (data) {
          jobs.push(data);
        } else if (
          error instanceof PrismaClientKnownRequestError &&
          error.code !== 'P2002'
        ) {
          console.error(error);
        }
      }
    }

    for await (const { url } of jobs) {
      await page.click(`[href="${url.replace('https://www.upwork.com', '')}"]`);
      await sleep(1000);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }

  return jobs;
}
