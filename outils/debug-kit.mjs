import { chromium } from 'playwright';
import { resolve } from 'path';
const root=resolve(import.meta.dirname,'..');
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
await page.goto(`file://${root}/site/location.html#kit`,{waitUntil:'load'}); await page.waitForTimeout(1000);
const m=await page.evaluate(()=>({img:document.querySelector('.kit-main-figure img')?.getBoundingClientRect().toJSON(),natural:[document.querySelector('.kit-main-figure img')?.naturalWidth,document.querySelector('.kit-main-figure img')?.naturalHeight],labels:[...document.querySelectorAll('.kit-label')].map(x=>({text:x.innerText,rect:x.getBoundingClientRect().toJSON(),opacity:getComputedStyle(x).opacity,display:getComputedStyle(x).display})),composition:document.querySelector('.kit-composition')?.getBoundingClientRect().toJSON(),rev:document.querySelector('.kit-composition')?.className}));
console.log(JSON.stringify(m,null,2));
await page.screenshot({path:`${root}/_previews/puzzi-kit-debug.png`,fullPage:true}); await browser.close();
