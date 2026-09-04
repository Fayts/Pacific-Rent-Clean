#!/usr/bin/env node
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dir, '../_previews');
mkdirSync(OUT,{recursive:true});
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1440,height:900} });
for (const v of ['vA','vB']) {
  const h = resolve(__dir, `mock-${v}.html`);
  await page.goto('file://'+h,{waitUntil:'networkidle',timeout:60000});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(700);
  const out = resolve(OUT, `six-${v}-raw.png`);
  await page.screenshot({path:out, fullPage:true});
  const sh=await page.evaluate(()=>document.body.scrollHeight);
  console.log(`${v} → hauteur ${sh}px : ${out}`);
}
await browser.close();
