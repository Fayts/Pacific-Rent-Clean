#!/usr/bin/env node
import { chromium } from 'playwright';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');
const siteDir = resolve(root, 'site');
const outDir = resolve(root, '_previews', 'multipage');

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto('file://' + resolve(siteDir, 'index.html'), { waitUntil: 'load', timeout: 30000 });
// Attendre que la vidéo soit tentée + scroller
await page.evaluate(async () => {
  await new Promise(r => setTimeout(r, 1500));
  const total = document.documentElement.scrollHeight;
  for (let y = 0; y <= total; y += 200) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 1500));
});
const bodyH = await page.evaluate(() => document.body.scrollHeight);
const docH = await page.evaluate(() => document.documentElement.scrollHeight);
const secOffsets = await page.evaluate(() => {
  return ['voies','prestations','machine','faq','reserver'].map(id => {
    const el = document.getElementById(id);
    return el ? { id, top: el.getBoundingClientRect().top + window.scrollY, height: el.getBoundingClientRect().height } : null;
  });
});
console.log('bodyH:', bodyH, 'docH:', docH);
console.log('sections:', JSON.stringify(secOffsets, null, 2));
await browser.close();
