import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.join(__dirname, '..', 'site');
const frac = Number(process.argv[2] ?? 0.6);

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('file://' + SITE + '/index.html');
// laisser la vidéo blob se charger
await page.waitForTimeout(5000);
const url = await page.url();
const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const target = Math.round(max * frac);
await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), target);
await page.waitForTimeout(2600);
await page.screenshot({ path: path.join(__dirname, '..', '_previews', `hero-${frac.toFixed(2)}.png`) });
await browser.close();
console.log('OK hero ' + frac + ' scroll=' + target);
