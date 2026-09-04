import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.join(__dirname, '..', 'site', 'index.html');
const OUT = path.join(__dirname, '..', '_previews');

const markers = {
  hero: null, prestations: null, methode: null,
  location: null, reserver: null, footer: null,
};

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('file://' + SITE, { waitUntil: 'load' });
await page.waitForTimeout(1500);

// repère les sections par id / classe / balise
const found = await page.evaluate(() => {
  const ids = ['hero', 'prestations', 'machine', 'procede', 'fourche',
    'location', 'marche', 'tarifs', 'faq', 'reserver'];
  const out = {};
  for (const id of ids) {
    const el = document.getElementById(id) || document.querySelector(`section[id="${id}"]`);
    if (el) out[id] = window.scrollY + el.getBoundingClientRect().top;
  }
  // bas de page
  out.footer = document.body.scrollHeight - 400;
  return out;
});
console.log('repères:', JSON.stringify(found));

// ordre = tri par position
const ordered = Object.entries(found).filter(([, v]) => v != null).sort((a, b) => a[1] - b[1]);

const shots = [];
for (const [name, y] of ordered) {
  await page.evaluate(sc => window.scrollTo({ top: sc, behavior: 'instant' }), Math.max(0, y));
  await page.waitForTimeout(700);
  const file = path.join(OUT, `sec-${name}.png`);
  await page.screenshot({ path: file });
  shots.push({ name, y, file });
  console.log('capturé', name, 'à', y);
}

await browser.close();
console.log('DONE', shots.map(s => s.name).join(', '));
