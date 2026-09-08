const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await chromium.launch({ headless: true, executablePath: edge });
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
  const source = `file:///${path.join(__dirname, 'index.html').replace(/\\/g, '/')}`;
  await page.goto(`${source}?card=3`, { waitUntil: 'networkidle' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const layout = await page.evaluate(() => {
    const deck = document.querySelector('#deck').getBoundingClientRect();
    const controls = [...document.querySelectorAll('.nav')].map(node => node.getBoundingClientRect());
    return {
      controlsOutsideCard: controls.every(rect => rect.top >= deck.bottom),
      cardInsideViewport: deck.left >= 0 && deck.right <= innerWidth
    };
  });

  const videos = [];
  for (let card = 1; card <= 5; card += 1) {
    const metadata = await page.evaluate(src => new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
      video.onerror = () => reject(new Error(`비디오 로드 실패: ${src}`));
      video.src = src;
    }), `videos/card-${card}.mp4`);
    videos.push({ card, ...metadata });
  }
  console.log(JSON.stringify({ layout, videos, errors }, null, 2));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
