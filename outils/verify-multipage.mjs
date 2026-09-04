#!/usr/bin/env node
import { chromium } from 'playwright';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync } from 'fs';

const __dir = dirname(fileURLToPath(import.meta.url));
const siteDir = resolve(__dir, '..', 'site');

const pages = ['index.html', 'prestations.html', 'location.html', 'methode.html', 'faq.html', 'reserver.html'];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const errors = [];
const summary = [];

for (const p of pages) {
  const filePath = resolve(siteDir, p);
  if (!existsSync(filePath)) {
    errors.push({ page: p, type: 'missing-file' });
    continue;
  }
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => pageErrors.push(err.message));
  page.on('requestfailed', req => {
    const url = req.url();
    if (url.startsWith('http://localhost') || url.startsWith('http://127.') || url.includes('pacific-rent-clean')) return;
    if (req.failure() && req.failure().errorText === 'net::ERR_ABORTED') return;
  });
  try {
    await page.goto('file://' + filePath, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(800);
    const title = await page.title();
    const h1 = await page.locator('h1').first().textContent().catch(() => null);
    const height = await page.evaluate(() => document.body.scrollHeight);
    const navLinks = await page.locator('.nav-links a').count();
    const secCount = await page.locator('main section, main header').count();
    summary.push({ page: p, ok: true, title, h1: h1 ? h1.trim().slice(0, 80) : null, height, navLinks, sections: secCount });
    if (consoleErrors.length) errors.push({ page: p, type: 'console', details: consoleErrors });
    if (pageErrors.length) errors.push({ page: p, type: 'pageerror', details: pageErrors });
  } catch (e) {
    errors.push({ page: p, type: 'navigation', details: e.message });
  }
  await page.close();
}

await browser.close();

console.log('\n=== RÉSUMÉ ===');
for (const s of summary) {
  console.log(`${s.ok ? '✓' : '✗'} ${s.page.padEnd(20)} | ${String(s.height).padStart(5)} px | nav=${s.navLinks} | sec=${s.sections} | h1=${s.h1}`);
  console.log(`   title: ${s.title}`);
}

if (errors.length) {
  console.log('\n=== ERREURS ===');
  for (const e of errors) {
    console.log(`✗ ${e.page} [${e.type}]`);
    if (e.details) {
      const d = Array.isArray(e.details) ? e.details : [e.details];
      for (const line of d) console.log(`   - ${line.slice(0, 200)}`);
    }
  }
} else {
  console.log('\nAucune erreur console / page / navigation.');
}

// Vérifie la présence de la nav dans chaque page
console.log('\n=== NAV CHECK ===');
for (const p of pages) {
  const html = readFileSync(resolve(siteDir, p), 'utf8');
  const has = (needle) => html.includes(needle);
  const ok = ['prestations.html', 'location.html', 'methode.html', 'faq.html', 'reserver.html', 'pacificrentclean@gmail.com']
    .every(n => has(n) || p === 'reserver.html' && n === 'pacificrentclean@gmail.com');
  console.log(`${p.padEnd(20)} | nav links: ${['prestations.html','location.html','methode.html','faq.html','reserver.html'].map(n => has(n) ? '✓' : '✗').join(' ')} | mailto: ${has('pacificrentclean@gmail.com') ? '✓' : '✗'}`);
}
