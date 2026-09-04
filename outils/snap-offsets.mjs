import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.join(__dirname, '..', 'site', 'index.html');
const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('file://' + SITE, { waitUntil: 'load' });
await page.waitForTimeout(1200);
const ids = ['hero','prestations','machine','procede','fourche','location','marche','tarifs','faq','reserver'];
const pos = await page.evaluate((ids) => {
  const out = {};
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) out[id] = Math.round(window.scrollY + el.getBoundingClientRect().top);
  }
  out.footer = document.body.scrollHeight - 300;
  out.pageH = document.body.scrollHeight;
  return out;
}, ids);
console.log(JSON.stringify(pos));
await browser.close();
