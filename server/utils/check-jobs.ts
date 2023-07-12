import { launch } from 'puppeteer';
import type { Page } from 'puppeteer';
import { jobs } from '~/server/drizzle/schema';
import type { InsertJob, Job } from '~/server/drizzle/schema';

const headless = true;

export async function checkJobs() {
  const configs = useRuntimeConfig();

  const executablePath = configs.CHROME_EXECUTABLE_PATH;
  const browser = await launch({
    headless: headless ? 'new' : false,
    userDataDir: './tmp',
    executablePath,
  });

  let success = true;
  try {
    const page = await browser.newPage();
    await page.goto('https://www.upwork.com/nx/find-work/');

    const loggedIn = await page
      .$eval('[name="login[username]"]', () => false)
      .catch(() => true);
    if (!loggedIn) {
      await logIn(page, configs.UPWORK_USERNAME, configs.UPWORK_PASSWORD);
    }

    await scrapeJobs(page);
    await page.click('[data-test="tab-best-matches"]');
    sleep(5000);
    await scrapeJobs(page);
    await page.click('[data-test="tab-most-recent"]');
    sleep(5000);
    await scrapeJobs(page);
  } catch (error) {
    success = false;
    console.error(error);
  } finally {
    await browser.close();
  }

  return {
    success,
  };
}

async function logIn(page: Page, email: string, password: string) {
  await page.focus('input[name="login[username]"]');
  await page.keyboard.type(email);
  await page.keyboard.press('Enter');
  await page.waitForSelector('input[name="login[password]"]');
  await page.click('#login_rememberme');
  await page.focus('input[name="login[password]"]');
  await page.keyboard.type(password);
  await page.keyboard.press('Enter');
  // TODO: Add wait for selector.
  await sleep(9000);
}

async function scrapeJobs(page: Page) {
  const relevantWords = [
    'nuxt',
    'vue',
    'nestjs',
    'laravel',
    'nodejs',
    'sveltekit',
    'svelte',
    'astro',
    'javascript',
    'typescript',
    'tailwind',
    'bootstrap',
    'full stack',
  ];
  const irrelevantWords = [
    'webflow',
    'ruby',
    'magento',
    'C#',
    'wordpress',
    'shopify',
    'angular',
    'elementor',
    'woo commerce',
  ];

  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
  await sleep(4000);

  const jobTitles = await page.$$eval('h3.job-tile-title > a', (group) =>
    group.map((g) => ({ title: g.innerText, url: g.href, description: '' })),
  );

  const jobDescriptions = await page.$$eval(
    'div.up-line-clamp-v2-wrapper > div.up-line-clamp-v2 > span',
    (group) => group.map((g) => g.innerText),
  );

  const jobPosted = await page.$$eval(
    '[data-test="posted-on"] > span',
    (group) => group.map((g) => g.innerText),
  );

  const allJobs = jobTitles.map((job, index) => ({
    ...job,
    description: jobDescriptions[index],
    postedTime: getTimeFromString(jobPosted[index].replace('.', ' ')),
  }));

  const visitedJobs = await page.$$eval(
    'section.up-card-visited > div > div > h3 > a',
    (group) => group.map((g) => g.href),
  );

  for await (const job of allJobs) {
    const url = job.url;
    const title = job.title.toLowerCase();
    const description = job.description.toLowerCase();
    let filter: Job['filter'] = 'notsure';

    const isRelevant = relevantWords.some(
      (word) => title.includes(word) || description.includes(word),
    );
    const isIrrelevant = irrelevantWords.some(
      (word) => title.includes(word) || description.includes(word),
    );
    if (isRelevant && isIrrelevant) {
      filter = 'relevant-irrelevant';
    } else if (isRelevant) {
      filter = 'relevant';
    } else if (isIrrelevant) {
      filter = 'irrelevant';
    }

    const visisted = visitedJobs.includes(url);
    if (!visisted) {
      const values: InsertJob = { ...job, filter };
      const { data, error } = await promise(() =>
        drizzle.insert(jobs).values(values),
      );

      if (data) {
        await page.click(
          `[href="${url.replace('https://www.upwork.com', '')}"]`,
        );
        await sleep(1000);
        await page.goBack();
        await sleep(500);
      } else {
        console.error({ error, values });
      }
    }
  }
}
