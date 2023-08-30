import { eq, sql } from 'drizzle-orm';
import { launch } from 'puppeteer';
import type { Page } from 'puppeteer';
import { jobs } from '~/server/drizzle/schema';
import type { InsertJob } from '~/server/drizzle/schema';

const headless = true;

const notifiableFilter: InsertJob['filter'][] = ['relevant'];

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
    await sleep(4000);
    await scrapeJobs(page);
    await page.click('[data-test="tab-most-recent"]');
    sleep(4000);
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
    'nuxt.js',
    'vue',
    'vue.js',
    'nestjs',
    'nest.js',
    'laravel',
    'nodejs',
    'node.js',
    'sveltekit',
    'svelte',
    'astro',
    'javascript',
    'typescript',
    'tailwind',
    'bootstrap',
    'full stack',
    'flowbite',
    'web developer',
    'landing page',
    'nextjs',
    'next.js',
    'reactjs',
    'react.js',
    'react',
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
    '.net',
    'python',
    'android',
    'ios',
    'mobile app',
    'java',
    'react native',
  ];

  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
  await sleep(4000);

  const jobTitles = await page.$$eval('h2.job-tile-title > a', (group) =>
    group.map((g) => ({ title: g.innerText, url: g.href })),
  );

  const jobDescriptions = await page.$$eval(
    'div.up-line-clamp-v2-wrapper > div.up-line-clamp-v2 > span',
    (group) => group.map((g) => g.innerText),
  );

  const jobPosted = await page.$$eval(
    '[data-test="posted-on"] > span',
    (group) => group.map((g) => g.innerText),
  );

  const jobPayment = await page.$$eval(
    '[data-test="payment-verification-status"] > strong',
    (group) => group.map((g) => g.innerText),
  );

  const allJobs: InsertJob[] = [];
  jobTitles.forEach((job, index) => {
    if (jobPayment[index] === 'Payment verified') {
      allJobs.push({
        ...job,
        description: jobDescriptions[index],
        postedTime: getTimeFromString(jobPosted[index].replace('.', ' ')),
        filter: 'notsure',
      });
    }
  });

  const visitedJobs = await page.$$eval(
    'section.up-card-visited > div > div > h3 > a',
    (group) => group.map((g) => g.href),
  );

  for await (const [index, job] of allJobs.entries()) {
    const { url, title, description } = job;
    const count = (
      await drizzle
        .select({ count: sql<number>`count(${jobs.id})` })
        .from(jobs)
        .where(eq(jobs.url, url))
    )[0].count;
    if (count > 0) {
      allJobs.splice(index, 1);
      continue;
    }

    const text = `${title} ${description}`;
    const isRelevant = relevantWords.some((word) =>
      searchExactWord(text, word),
    );
    const isIrrelevant = irrelevantWords.some((word) =>
      searchExactWord(text, word),
    );
    if (isRelevant && isIrrelevant) {
      job.filter = 'relevant-irrelevant';
    } else if (isRelevant) {
      job.filter = 'relevant';
    } else if (isIrrelevant) {
      job.filter = 'irrelevant';
    }

    const visisted = visitedJobs.includes(url);
    if (!visisted) {
      const { data, error } = await promise(
        () => drizzle.insert(jobs).values(job),
        true,
      );

      const hasNotifiableJob = notifiableFilter.includes(job.filter);
      if (hasNotifiableJob) {
        await pushNotification(job.title);
      }

      if (data) {
        const clickEvent = await promise(() =>
          page.click(`[href="${url.replace('https://www.upwork.com', '')}"]`),
        );
        if (!clickEvent.error) {
          await sleep(1000);
          await page.goBack();
          await sleep(500);
        }
      } else {
        console.error({ error, job });
      }
    }
  }

  return allJobs;
}

function searchExactWord(text: string, word: string): boolean {
  const regex = new RegExp(`\\b${word}\\b`, 'i');
  return regex.test(text);
}
