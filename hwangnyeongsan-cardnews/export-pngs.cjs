const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await chromium.launch({ headless: true, executablePath: edge });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1500 }, deviceScaleFactor: 1 });
  const source = `file:///${path.join(__dirname, 'index.html').replace(/\\/g, '/')}`;
  for (let card = 1; card <= 5; card += 1) {
    await page.goto(`${source}?card=${card}&static=1`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const deck = document.querySelector('#deck');
      deck.style.width = '1080px';
      deck.style.height = '1350px';
      deck.style.maxWidth = 'none';
      document.querySelectorAll('.nav').forEach(node => node.style.display = 'none');
    });
    await page.locator('#deck').screenshot({ path: path.join(__dirname, 'previews', `card-${card}.png`) });
  }
  await browser.close();
  console.log('Exported 5 PNG previews to previews/.');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
