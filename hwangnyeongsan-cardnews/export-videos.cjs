const { chromium } = require('playwright');
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const FPS = 30;
const DURATION = 4;
const WIDTH = 1080;
const HEIGHT = 1350;

function resolveFfmpeg() {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  const probe = spawnSync('where.exe', ['ffmpeg'], { encoding: 'utf8' });
  if (probe.status === 0) return probe.stdout.trim().split(/\r?\n/)[0];
  throw new Error('FFmpeg를 찾을 수 없습니다. FFMPEG_PATH 환경 변수에 ffmpeg.exe 경로를 지정하세요.');
}

function createEncoder(ffmpeg, output) {
  return spawn(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'image2pipe', '-vcodec', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-vf', `scale=${WIDTH}:${HEIGHT}:flags=lanczos`, output
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
}

(async () => {
  const ffmpeg = resolveFfmpeg();
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await chromium.launch({ headless: true, executablePath: edge });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1450 }, deviceScaleFactor: 1 });
  const source = `file:///${path.join(__dirname, 'index.html').replace(/\\/g, '/')}`;
  const outputDir = path.join(__dirname, 'videos');
  fs.mkdirSync(outputDir, { recursive: true });

  for (let card = 1; card <= 5; card += 1) {
    await page.goto(`${source}?card=${card}`, { waitUntil: 'networkidle' });
    await page.evaluate(async ({ width, height }) => {
      await document.fonts.ready;
      const deck = document.querySelector('#deck');
      deck.style.width = `${width}px`;
      deck.style.height = `${height}px`;
      deck.style.maxWidth = 'none';
      document.querySelectorAll('.nav').forEach(node => node.style.display = 'none');
      document.getAnimations().forEach(animation => animation.pause());
    }, { width: WIDTH, height: HEIGHT });

    const output = path.join(outputDir, `card-${card}.mp4`);
    const encoder = createEncoder(ffmpeg, output);
    for (let frame = 0; frame < FPS * DURATION; frame += 1) {
      const time = frame * (1000 / FPS);
      await page.evaluate(ms => {
        document.getAnimations().forEach(animation => {
          animation.pause();
          animation.currentTime = ms;
        });
      }, time);
      const jpeg = await page.locator('#deck').screenshot({ type: 'jpeg', quality: 90 });
      if (!encoder.stdin.write(jpeg)) await new Promise(resolve => encoder.stdin.once('drain', resolve));
    }
    encoder.stdin.end();
    await new Promise((resolve, reject) => {
      encoder.on('close', code => code === 0 ? resolve() : reject(new Error(`FFmpeg 종료 코드: ${code}`)));
      encoder.on('error', reject);
    });
    console.log(`Exported card ${card}/5`);
  }
  await browser.close();
  console.log('Exported 5 MP4 videos to videos/.');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
