import { chromium } from 'playwright';
import { resolve } from 'path';
const root=resolve(import.meta.dirname,'..');
const browser=await chromium.launch();
for (const [width,name] of [[1440,'desktop'],[390,'mobile']]) {
  const page=await browser.newPage({ viewport:{width,height:900}, deviceScaleFactor:1 });
  await page.goto(`file://${root}/site/location.html#kit`,{waitUntil:'domcontentloaded'});
  await page.addStyleTag({content:'*{animation:none!important;transition:none!important}'});
  await page.waitForTimeout(400);
  const metrics=await page.evaluate(()=>{const nav=document.querySelector('#nav')?.getBoundingClientRect();const head=document.querySelector('#kit h2')?.getBoundingClientRect();const section=document.querySelector('#kit')?.getBoundingClientRect();return {navHeight:nav?.height,navBottom:nav?.bottom,titleTop:head?.top,titleVisible:(head?.top??-1)>=((nav?.bottom??0)+4),sectionTop:section?.top,imgWidth:document.querySelector('.kit-main-figure img')?.getBoundingClientRect().width,labels:document.querySelectorAll('.kit-label').length}});
  await page.screenshot({path:`${root}/_previews/location-kit-finish-${name}.png`,fullPage:false});
  await page.locator('#kit').screenshot({path:`${root}/_previews/location-kit-section-${name}.png`});
  console.log(name,JSON.stringify(metrics));
  await page.close();
}
await browser.close();
