// TikTok Hashtag Scraper: #AITools

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const hashtag = 'aitools';
  const url = `https://www.tiktok.com/tag/${hashtag}`;

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for video items to load
  await page.waitForSelector('div[data-e2e="challenge-item-list"]', { timeout: 10000 });

  const results = await page.evaluate(() => {
    const cards = document.querySelectorAll('div[data-e2e="challenge-item-list"] > div');
    const output = [];

    cards.forEach(card => {
      const linkEl = card.querySelector('a');
      const titleEl = card.querySelector('h3') || card.querySelector('[data-e2e="browse-video-desc"]');
      const statsEl = card.querySelector('[data-e2e="browse-video-stats"]');

      if (linkEl && titleEl) {
        output.push({
          title: titleEl.textContent.trim(),
          link: linkEl.href,
          views: statsEl ? statsEl.textContent.trim() : 'N/A',
          monetization_angle: 'Create affiliate-style video, use case tutorial, or prompt pack around this tool'
        });
      }
    });

    return output.slice(0, 10);
  });

  await browser.close();

  fs.writeFileSync('tiktok_aitools_trending.json', JSON.stringify(results, null, 2));
  console.log('Scraped TikTok #AITools trends saved to tiktok_aitools_trending.json');
})();