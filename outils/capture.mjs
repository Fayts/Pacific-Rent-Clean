#!/usr/bin/env node
// Capture d'écran du site Pacific Rent&Clean (V2) en pleine page.
// Usage : node outils/capture.mjs  [--desktop] [--mobile] [--out DIR]
// Lit site/index.html et génère des PNG pleine page.

import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dir = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(__dir, '../site/index.html');
const OUT = resolve(__dir, '../_previews');

const args = process.argv.slice(2);
const wantDesktop = args.includes('--desktop') || args.includes('--all') || args.length === 0;
const wantMobile = args.includes('--mobile') || args.includes('--all') || args.length === 0;

mkdirSync(OUT, { recursive: true });

console.log(`📄 Page : ${SITE}`);

try {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const configs = [];
  if (wantDesktop) configs.push({ name: 'desktop', vw: 1440, vh: 900 });
  if (wantMobile) configs.push({ name: 'mobile', vw: 390, vh: 844 });

  for (const c of configs) {
    await page.setViewportSize({ width: c.vw, height: c.vh });
    await page.goto('file://' + SITE, { waitUntil: 'networkidle', timeout: 60000 });
    // laisse un peu de temps au film d'épaissir / aux polices
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const out = resolve(OUT, `apercu-${c.name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    const h = await page.evaluate(() => document.body.scrollHeight);
    console.log(`🖼️ ${c.vw}x${c.vh} — hauteur page ${h}px → ${out}`);
  }

  await browser.close();
  console.log('✅ Terminé.');
} catch (e) {
  console.error('❌ Échec :', e.message);
  process.exit(1);
}
