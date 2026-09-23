import { chromium } from 'playwright';
import { resolve } from 'path';
const root=resolve(import.meta.dirname,'..'); const browser=await chromium.launch();
for (const [width,name] of [[1440,'desktop'],[390,'mobile']]) {
 const page=await browser.newPage({viewport:{width,height:900}}); await page.goto(`file://${root}/site/index.html`,{waitUntil:'load'});
 await page.evaluate(()=>{document.querySelectorAll('img[loading="lazy"]').forEach(i=>i.loading='eager');document.querySelectorAll('.rev,.stag').forEach(e=>e.classList.add('in'));});
 await page.waitForTimeout(400); await page.evaluate(()=>location.hash='voies'); await page.waitForTimeout(300);
 const info=await page.evaluate(()=>({scrollY,nav:document.querySelector('.nav')?.getBoundingClientRect().toJSON(),heading:document.querySelector('#voies .fork-head')?.getBoundingClientRect().toJSON(),title:document.querySelector('#voies .fork-head h2')?.getBoundingClientRect().toJSON()}));
 await page.screenshot({path:`${root}/_previews/accueil-voies-anchor-${name}.png`}); console.log(name,JSON.stringify(info)); await page.close(); }
await browser.close();
