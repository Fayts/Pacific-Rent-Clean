#!/usr/bin/env node
import { chromium } from 'playwright';
import { dirname, resolve, extname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync, createReadStream } from 'fs';
import { createServer } from 'http';

const __dir = dirname(fileURLToPath(import.meta.url));
const siteDir = resolve(__dir, '..', 'site');
const pages = ['index.html', 'prestations.html', 'location.html', 'faq.html', 'reserver.html'];

const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.webp':'image/webp', '.mp4':'video/mp4', '.svg':'image/svg+xml' };
const server = createServer((req, res) => {
  const pathname = decodeURIComponent((req.url || '/').split('?')[0]);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  const file = resolve(siteDir, relative);
  if (!file.startsWith(siteDir) || !existsSync(file)) { res.writeHead(404); res.end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise(resolveReady => server.listen(0, '127.0.0.1', resolveReady));
const port = server.address().port;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const errors = [];
const summary = [];
for (const p of pages) {
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => pageErrors.push(err.message));
  try {
    await page.goto(`http://127.0.0.1:${port}/${p}`, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(1000);
    const title = await page.title();
    const h1 = await page.locator('h1').first().textContent().catch(() => null);
    const height = await page.evaluate(() => document.body.scrollHeight);
    const navLinks = await page.locator('.nav-links a').count();
    const secCount = await page.locator('main section, main header').count();
    summary.push({ page:p, title, h1:h1 ? h1.trim().replace(/\s+/g, ' ').slice(0,80) : null, height, navLinks, sections:secCount });
    if (consoleErrors.length) errors.push({ page:p, type:'console', details:consoleErrors });
    if (pageErrors.length) errors.push({ page:p, type:'pageerror', details:pageErrors });
  } catch (e) { errors.push({ page:p, type:'navigation', details:e.message }); }
  await page.close();
}
await browser.close();
await new Promise(r => server.close(r));
console.log('\n=== RÉSUMÉ ===');
for (const s of summary) console.log(`✓ ${s.page.padEnd(18)} | ${String(s.height).padStart(5)} px | nav=${s.navLinks} | sec=${s.sections} | h1=${s.h1}`);
console.log('\n=== ERREURS ===');
if (!errors.length) console.log('Aucune erreur console / page / navigation.');
for (const e of errors) { console.log(`✗ ${e.page} [${e.type}]`); for (const d of (Array.isArray(e.details) ? e.details : [e.details])) console.log(`   - ${String(d).slice(0,200)}`); }
if (errors.length) process.exitCode = 1;
console.log('\n=== NAV CHECK ===');
for (const p of pages) {
  const html = readFileSync(resolve(siteDir,p), 'utf8');
  const links = ['prestations.html','location.html','faq.html','reserver.html'].map(n => html.includes(n) ? '✓' : '✗').join(' ');
  console.log(`${p.padEnd(18)} | nav links: ${links} | mailto: ${html.includes('pacificrentclean@gmail.com') ? '✓' : '✗'}`);
}
