// YouTube Shorts Trending Scraper with Puppeteer

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Navigate to YouTube Trending
  await page.goto('https://www.youtube.com/feed/trending', { waitUntil: 'networkidle2' });

  // Wait for Shorts section
  await page.waitForSelector('ytd-rich-section-renderer');

  const results = await page.evaluate(() => {
    const sections = document.querySelectorAll('ytd-rich-section-renderer');
    const shortsSection = Array.from(sections).find(section =>
      section.innerText.includes('#Shorts') || section.innerText.toLowerCase().includes('shorts')
    );
    if (!shortsSection) return [];

    const items = shortsSection.querySelectorAll('ytd-rich-item-renderer');
    const output = [];

    items.forEach(item => {
      const titleEl = item.querySelector('#video-title');
      const viewsEl = item.querySelector('#metadata-line span');
      const linkEl = item.querySelector('a#thumbnail');

      if (titleEl && linkEl) {
        output.push({
          title: titleEl.textContent.trim(),
          views: viewsEl ? viewsEl.textContent.trim() : 'N/A',
          link: 'https://www.youtube.com' + linkEl.getAttribute('href'),
          monetization_angle: 'Create video reacting to or reviewing this Shorts trend'
        });
      }
    });

    return output.slice(0, 10);
  });

  await browser.close();

  // Save to file
  fs.writeFileSync('shorts_trending.json', JSON.stringify(results, null, 2));
  console.log('Scraped YouTube Shorts trends saved to shorts_trending.json');
})();