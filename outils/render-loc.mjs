#!/usr/bin/env node
import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
const __dir = dirname(fileURLToPath(import.meta.url));
const SITE = resolve(__dir,'../site/index.html');
const OUT = resolve(__dir,'../_previews'); mkdirSync(OUT,{recursive:true});
const browser = await chromium.launch();
const page = await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('file://'+SITE,{waitUntil:'networkidle',timeout:60000});
await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(1200);
const h = await page.evaluate(()=>document.body.scrollHeight);
await page.screenshot({path:resolve(OUT,'fusion-location-page.png'),fullPage:true});
// zoom choix (fork) — scroll au sommet de #location
const loc = await page.locator('#location').boundingBox();
await page.evaluate((y)=>window.scrollTo(0,y-40),{y:loc.y});
await page.waitForTimeout(500);
await page.screenshot({path:resolve(OUT,'fusion-location-choix.png')});
console.log('hauteur page =',h,'px ; location y=',Math.round(loc.y));
await browser.close();
