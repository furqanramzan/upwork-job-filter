import { eq, inArray, sql } from 'drizzle-orm';
import { launch } from 'puppeteer';
import type { Browser, Page, PuppeteerLaunchOptions } from 'puppeteer';
import { irrelevantWords, relevantWords } from './constants';
import { jobs } from '~/server/drizzle/schema';
import type { InsertJob } from '~/server/drizzle/schema';

const headless = true;

const notifiableFilter: InsertJob['filter'][] = ['relevant'];

export async function checkJobs() {
  const configs = useRuntimeConfig();

  const executablePath = configs.CHROME_EXECUTABLE_PATH;
  const options: PuppeteerLaunchOptions = {
    headless: headless ? 'new' : false,
    userDataDir: './tmp',
    defaultViewport: { width: 1920, height: 941 },
    args: ['--start-maximized'],
  };
  if (executablePath) {
    options.executablePath = executablePath;
  }
  const browser = await launch(options);
  const page = await browser.newPage();

  let success = true;
  try {
    await page.goto('https://www.upwork.com/nx/find-work/');

    const loggedIn = await page
      .$eval('[name="login[username]"]', () => false)
      .catch(() => true);
    if (!loggedIn) {
      await logIn(
        browser,
        page,
        configs.UPWORK_USERNAME,
        configs.UPWORK_PASSWORD,
      );
    }

    await scrapeJobs(browser, page);
    await executePuppeteerCommand(
      () => page.click('[data-test="tab-best-matches"]'),
      browser,
      'best matches',
    );
    await scrapeJobs(browser, page);
    await executePuppeteerCommand(
      () => page.click('[data-test="tab-most-recent"]'),
      browser,
      'most recent',
    );
    await scrapeJobs(browser, page);
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

async function logIn(
  browser: Browser,
  page: Page,
  email: string,
  password: string,
) {
  await executePuppeteerCommand(
    () => page.focus('input[name="login[username]"]'),
    browser,
    'username focus',
  );
  await executePuppeteerCommand(
    () => page.keyboard.type(email),
    browser,
    'username typing',
  );
  await executePuppeteerCommand(
    () => page.keyboard.press('Enter'),
    browser,
    'username enter',
  );
  await executePuppeteerCommand(
    () => page.waitForSelector('input[name="login[password]"]'),
    browser,
    'password wait',
  );
  await executePuppeteerCommand(
    () => page.click('[data-test="checkbox-label"]'),
    browser,
    'remember me click',
  );
  await executePuppeteerCommand(
    () => page.focus('input[name="login[password]"]'),
    browser,
    'password focus',
  );
  await executePuppeteerCommand(
    () => page.keyboard.type(password),
    browser,
    'password typing',
  );
  await executePuppeteerCommand(
    () => page.keyboard.press('Enter'),
    browser,
    'password enter',
  );
  await executePuppeteerCommand(
    () => page.waitForSelector('[data-test="tab-best-matches"]'),
    browser,
    'wait after login',
  );
}

async function scrapeJobs(browser: Browser, page: Page) {
  await executePuppeteerCommand(
    () => page.waitForSelector('h2.job-tile-title > a'),
    browser,
    'wait for jobs',
  );

  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
  await sleep(3000);

  const jobTitles = await executePuppeteerCommand(
    () =>
      page.$$eval('h2.job-tile-title > a', (group) =>
        group.map((g) => ({ title: g.innerText, url: g.href })),
      ),
    browser,
    'job titles',
  );

  const jobDescriptions = await executePuppeteerCommand(
    () =>
      page.$$eval(
        'div.up-line-clamp-v2-wrapper > div.up-line-clamp-v2 > span',
        (group) => group.map((g) => g.innerText),
      ),
    browser,
    'job descriptions',
  );

  const jobPosted = await executePuppeteerCommand(
    () =>
      page.$$eval('[data-test="posted-on"] > span', (group) =>
        group.map((g) => g.innerText),
      ),
    browser,
    'job posted',
  );

  const jobPayment = await executePuppeteerCommand(
    () =>
      page.$$eval(
        '[data-test="payment-verification-status"] > strong',
        (group) => group.map((g) => g.innerText),
      ),
    browser,
    'job payment',
  );

  const allJobs: InsertJob[] = [];
  const urls = jobTitles.map((x) => x.url);
  const savedJobs = new Set<string>();
  (
    await drizzle.query.jobs.findMany({
      columns: { url: true },
      where: ({ url }) => inArray(url, urls),
    })
  ).forEach(({ url }) => savedJobs.add(url));

  jobTitles.forEach((job, index) => {
    if (jobPayment[index] === 'Payment verified' && !savedJobs.has(job.url)) {
      allJobs.push({
        ...job,
        description: jobDescriptions[index],
        postedTime: getTimeFromString(jobPosted[index].replace('.', ' ')),
        filter: 'notsure',
      });
    }
  });

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

    const { error } = await promise(
      () => drizzle.insert(jobs).values(job),
      true,
    );

    const hasNotifiableJob = notifiableFilter.includes(job.filter);
    if (hasNotifiableJob) {
      if (isDateNotOlderThanMinutes(job.postedTime, 15)) {
        await pushNotification(job.title);
      }
    }

    if (error) {
      console.error({ error, job, jobPosted });
    }
  }

  return allJobs;
}

function searchExactWord(text: string, word: string): boolean {
  const regex = new RegExp(`\\b${word}\\b`, 'i');
  return regex.test(text);
}
