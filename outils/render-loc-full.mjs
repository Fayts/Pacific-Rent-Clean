#!/usr/bin/env node
import { chromium } from 'playwright';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');
const out = resolve(root, '_previews', 'fusion-location-complete.png');

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('file://' + resolve(root, 'site/index.html'), { waitUntil: 'load', timeout: 60000 });

// 1) Forcer le chargement de TOUTES les images lazy en défilant toute la page
await page.evaluate(async () => {
  const total = document.documentElement.scrollHeight;
  const step = 500;
  for (let y = 0; y <= total; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 40));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 300));
});

// 2) Attendre que toutes les images soient complètes
await page.evaluate(async () => {
  const imgs = [...document.images];
  await Promise.all(imgs.map(img => img.complete ? 0 : new Promise(res => {
    img.addEventListener('load', () => res(), { once: true });
    img.addEventListener('error', () => res(), { once: true });
    setTimeout(res, 3000);
  })));
});
await page.waitForTimeout(1500);

// 3) Masquer l'élément collant (menu sticky) pour une capture représentative
await page.evaluate(() => {
  [...document.querySelectorAll('*')].forEach(e => {
    const p = getComputedStyle(e).position;
    if (p === 'fixed' || p === 'sticky') e.style.setProperty('display', 'none', 'important');
  });
});
await page.waitForTimeout(300);

// 4) Screenshot de l'ÉLÉMENT #location entier
const el = page.locator('#location');
await el.screenshot({ path: out });

const h = await el.evaluate(e => Math.round(e.getBoundingClientRect().height));
console.log('#location height:', h, 'px ->', out);
await b.close();
