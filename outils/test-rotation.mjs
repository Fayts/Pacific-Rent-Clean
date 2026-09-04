import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.join(__dirname, '..', 'site', 'index.html');
const OUT = path.join(__dirname, '..', '_previews');

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

await page.goto('file://' + SITE, { waitUntil: 'load' });
// scroll vers la machine
await page.evaluate(() => {
  const el = document.getElementById('machine');
  el.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(4000); // laisse le preload tourner

// état du module
const info = await page.evaluate(() => {
  const turn = document.getElementById('turn');
  const img = document.getElementById('turnImg');
  const r = turn.getBoundingClientRect();
  return {
    rect: { w: Math.round(r.width), h: Math.round(r.height), visible: r.width > 0 && r.height > 0 && turn.offsetParent !== null },
    curSrc: img.getAttribute('src'),
    loadedClass: turn.classList.contains('loaded'),
    frames: [...Array(36)].map((_, i) => { const im = new Image(); im.src = `assets/machine/m${String(i).padStart(2, '0')}.webp`; return im.complete; })
  };
});

await page.screenshot({ path: path.join(OUT, 'mach-avant.png') });

// simule un glisser ferme vers la gauche (fait tourner)
const turn = page.locator('#turn');
const box = await turn.boundingBox();
const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
await page.mouse.move(cx, cy);
await page.mouse.down();
for (let i = 0; i < 25; i++) await page.mouse.move(cx - i * 22, cy, { steps: 2 });
await page.mouse.up();
await page.waitForTimeout(900);

const after = await page.evaluate(() => document.getElementById('turnImg').getAttribute('src'));
await page.screenshot({ path: path.join(OUT, 'mach-apres.png') });

console.log(JSON.stringify({ info, after, errors }, null, 2));
await browser.close();
