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
 const metrics=await page.evaluate(()=>Object.fromEntries(['matelas','canapes','auto','tapis'].map(id=>{const el=document.getElementById(id);const img=el.querySelector('.svc-fig');return [id,{height:el.getBoundingClientRect().height,imageHeight:img?.getBoundingClientRect().height,text:el.querySelector('.svc-word')?.textContent.trim()}]})));
 await page.screenshot({path:`${root}/_previews/prestations-finish-${name}.png`,fullPage:true});
 await page.locator('#prestations').screenshot({path:`${root}/_previews/prestations-categories-${name}.png`});
 console.log(name,JSON.stringify(metrics));
 await page.close();
}
await browser.close();
