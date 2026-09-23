import { chromium } from 'playwright';
import { resolve } from 'path';
const root=resolve(import.meta.dirname,'..');
const browser=await chromium.launch();
for (const [width,name] of [[1440,'desktop'],[390,'mobile']]) {
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
 await page.goto(`file://${root}/site/prestations.html`,{waitUntil:'load'});
 await page.evaluate(()=>document.querySelectorAll('img[loading="lazy"]').forEach(img=>img.loading='eager'));
 await page.evaluate(()=>{document.querySelectorAll('.rev').forEach(el=>el.classList.add('in')); document.querySelectorAll('.stag').forEach(el=>el.classList.add('in'));});
 await page.waitForTimeout(100);
 for (const id of ['matelas','canapes','auto','tapis']) {
   const el=page.locator('#'+id);
   await el.screenshot({path:`${root}/_previews/prestation-${id}-${name}.png`});
   const m=await el.evaluate(e=>({height:e.getBoundingClientRect().height,image:e.querySelector('.svc-fig')?.getBoundingClientRect().height,text:e.querySelector('.svc-copy,.svc-1>div,.svc-2>div,.svc-4>div')?.innerText}));
   console.log(name,id,JSON.stringify({height:m.height,image:m.image}));
 }
 await page.close();
}
await browser.close();
