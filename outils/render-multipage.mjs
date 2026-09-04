#!/usr/bin/env node
// Capture par "tranches" de viewport, pour contourner le bug fullPage sur les heros 1000vh.
import { chromium } from 'playwright';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
import { execSync } from 'child_process';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');
const siteDir = resolve(root, 'site');
const outDir = resolve(root, '_previews', 'multipage');
mkdirSync(outDir, { recursive: true });

const pages = ['index.html', 'prestations.html', 'location.html', 'methode.html', 'faq.html', 'reserver.html'];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

async function prepare(page) {
  await page.evaluate(async () => {
    for (const img of [...document.images]) {
      if (!img.complete) { try { img.loading = 'eager'; } catch (_) {} }
    }
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y <= total; y += 200) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 1500));
  });
  // Masquer menu sticky
  await page.evaluate(() => {
    [...document.querySelectorAll('*')].forEach(e => {
      const p = getComputedStyle(e).position;
      if (p === 'fixed' || p === 'sticky') e.style.setProperty('display', 'none', 'important');
    });
  });
  await page.waitForTimeout(300);
}

async function slice(page, outBase) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = 900;
  const parts = [];
  for (let y = 0, i = 0; y < total; y += vh, i++) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(300);
    const f = outBase.replace('.png', `-${i}.png`);
    await page.screenshot({ path: f, fullPage: false });
    parts.push(f);
  }
  // Assemblage vertical via PIL
  const finalOut = outBase;
  const { execSync: _ignore } = { execSync };
  const Python = (await import('child_process')).spawnSync;
  const script = `from PIL import Image; ims=[Image.open(p) for p in ${JSON.stringify(parts)}]; w=max(i.width for i in ims); h=sum(i.height for i in ims); canvas=Image.new('RGB',(w,h),(244,241,232)); y=0\n[canvas.paste(i,(0,y)) or (y:=y+i.height) for i in ims]; canvas.save(${JSON.stringify(finalOut)})`;
  const r = Python('python3', ['-c', script], { encoding: 'utf8' });
  if (r.status !== 0) { console.error('PIL err:', r.stderr); throw new Error('PIL'); }
  for (const p of parts) { try { (await import('fs')).unlinkSync(p); } catch (_) {} }
  return finalOut;
}

for (const p of pages) {
  const page = await context.newPage();
  await page.goto('file://' + resolve(siteDir, p), { waitUntil: 'load', timeout: 30000 });
  await prepare(page);
  const file = resolve(outDir, p.replace('.html', '.png'));
  await slice(page, file);
  const h = await page.evaluate(() => document.body.scrollHeight);
  console.log(`✓ ${p} -> ${file} (${h} px)`);
  await page.close();
}

await browser.close();
console.log('\nTous les rendus sont dans', outDir);
