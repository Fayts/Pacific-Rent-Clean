import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
const __dir = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(__dir, '../site/index.html');
const b = await chromium.launch({ args: ['--no-sandbox','--disable-dev-shm-usage'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('file://' + SITE, { waitUntil: 'load' });
await p.waitForTimeout(1100);
const info = await p.evaluate(()=>{
  const m = document.getElementById('marche');
  const r = m.getBoundingClientRect();
  return {h: document.body.scrollHeight, marcheTop: r.top + scrollY, marcheH: m.offsetHeight,
          sections: document.querySelectorAll('section[id]').length,
          marcheExists: !!document.getElementById('marche')};
});
console.log('scrollHeight', info.h, '| marcheTop', info.marcheTop.toFixed(0), '| marcheH', info.marcheH, '| sections', info.sections);
// zoom sur le bloc fusionné
const top = info.marcheTop - 380;
await p.evaluate((t)=>window.scrollTo({top:t, behavior:'instant'}), top);
await p.waitForTimeout(900);
await p.screenshot({ path: path.resolve(__dir,'../_previews/marche-fusion.png') });
await b.close();
console.log('OK marche-fusion.png');
