import { chromium } from 'playwright';
import { resolve } from 'path';
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, '_previews', 'location-six-temps.png');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('file://' + resolve(root, 'site/location.html'), { waitUntil: 'load', timeout: 30000 });
await page.evaluate(async () => {
  for (const img of document.images) img.loading = 'eager';
  const total = document.documentElement.scrollHeight;
  for (let y = 0; y <= total; y += 250) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 800));
  [...document.querySelectorAll('*')].forEach(e => { const p = getComputedStyle(e).position; if (p === 'fixed' || p === 'sticky') e.style.display = 'none'; });
});
const info = await page.evaluate(() => ({ height: document.body.scrollHeight, method: !!document.querySelector('#methode'), six: document.querySelectorAll('#six-temps .proc-step').length, nav: [...document.querySelectorAll('.nav-links a')].map(a => a.textContent.trim()) }));
await page.locator('#methode').screenshot({ path: out });
console.log(JSON.stringify({ ...info, capture: out }));
await browser.close();