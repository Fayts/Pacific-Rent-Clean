import { chromium } from 'playwright';
import { resolve } from 'path';
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, '_previews', 'location-full-latest.png');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('file://' + resolve(root, 'site/location.html'), { waitUntil: 'load', timeout: 30000 });
await page.evaluate(async () => {
  for (const img of document.images) img.loading = 'eager';
  const total = document.documentElement.scrollHeight;
  for (let y = 0; y <= total; y += 220) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 700));
  [...document.querySelectorAll('*')].forEach(e => { const p = getComputedStyle(e).position; if (p === 'fixed' || p === 'sticky') e.style.display = 'none'; });
});
const height = await page.evaluate(() => document.body.scrollHeight);
const viewport = { width: 1440, height: 900 };
const slices = [];
for (let y = 0; y < height; y += viewport.height) {
  await page.evaluate(y => window.scrollTo(0, y), y);
  await page.waitForTimeout(180);
  const h = Math.min(viewport.height, height - y);
  const path = resolve(root, '_previews', `.location-slice-${String(y).padStart(5,'0')}.png`);
  await page.screenshot({ path, clip: { x: 0, y: 0, width: viewport.width, height: h } });
  slices.push(path);
}
await page.evaluate(() => window.scrollTo(0, 0));
console.log(JSON.stringify({ height, slices, full: out }));
await browser.close();
