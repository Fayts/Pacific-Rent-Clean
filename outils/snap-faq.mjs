import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
const __dir = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(__dir, '../site/index.html');
const b = await chromium.launch({ args: ['--no-sandbox','--disable-dev-shm-usage'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('file://' + SITE, { waitUntil: 'load' });
await p.waitForTimeout(1000);
const nQ = await p.evaluate(()=>document.querySelectorAll('#faqList .q').length);
console.log('questions FAQ:', nQ);
await p.evaluate(()=>window.scrollTo({top: document.getElementById('faq').getBoundingClientRect().top + scrollY - 60, behavior:'instant'}));
await p.waitForTimeout(800);
await p.screenshot({ path: path.resolve(__dir,'../_previews/faq-5.png') });
// test toggle : ouvre puis ferme la 1re question
const r1 = await p.evaluate(()=>{
  const b0 = document.querySelector('#faqList .q button');
  b0.click();
  return { expanded: b0.getAttribute('aria-expanded'), aOpen: document.getElementById('a1').classList.contains('open') };
});
await p.waitForTimeout(300);
await p.screenshot({ path: path.resolve(__dir,'../_previews/faq-ouverte.png') });
const r2 = await p.evaluate(()=>{
  const b0 = document.querySelector('#faqList .q button');
  b0.click();
  return { expanded: b0.getAttribute('aria-expanded') };
});
console.log('toggle 1er clic:', JSON.stringify(r1), '| 2e clic (replié):', JSON.stringify(r2));
await b.close();
