/* ============================================================
   PACIFIC RENT&CLEAN · le héros défilé de l'accueil
   Découpage du texte + film piloté par le défilement.
   Chargé par index.html seulement.
   ============================================================ */
(function(){
"use strict";

const hero=document.getElementById('hero');
const stage=document.getElementById('stage');
const video=document.getElementById('heroVideo');
const posterLayer=document.getElementById('poster');
let ring=document.getElementById('ring');
if(!hero||!stage||!video||!posterLayer||!ring) return;

/* ============================================================
   0. utilitaires
   ============================================================ */
const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
const smoothstep=(p,e0,e1)=>{const t=clamp((p-e0)/(e1-e0),0,1);return t*t*(3-2*t);};
function rng(seed){let s=seed>>>0;return()=>(s=(s*1664525+1013904223)>>>0)/4294967296;}

/* ============================================================
   1. découpage du texte, fait une fois au chargement
   ============================================================ */
function splitText(el){
  const mode=el.dataset.split;
  if(!mode) return;
  const text=el.textContent.trim();
  const r=rng(parseInt(el.dataset.seed||'7',10));
  const words=text.split(' ');
  const emIndex=el.dataset.em?parseInt(el.dataset.em,10):-1;
  let total=0; words.forEach(w=>total+=w.length);
  el.innerHTML='';
  const sr=document.createElement('span'); sr.className='sr'; sr.textContent=text; el.appendChild(sr);
  const vis=document.createElement('span'); vis.setAttribute('aria-hidden','true'); el.appendChild(vis);
  let ci=0;
  words.forEach((word,wi)=>{
    const w=document.createElement('span'); w.className='w';
    if(wi===emIndex) w.classList.add('em');
    if(mode==='word'){
      w.style.setProperty('--th',(wi/Math.max(1,words.length))*0.5+r()*0.06);
      w.textContent=word;
    }else{
      for(const ch of word){
        const c=document.createElement('span'); c.className='c'; c.textContent=ch;
        c.style.setProperty('--th',(ci/Math.max(1,total))*0.5+r()*0.05);
        c.style.setProperty('--jy',((ci%2===0)?-1:1)*(22+r()*16)+'px');
        w.appendChild(c); ci++;
      }
    }
    vis.appendChild(w);
    if(wi<words.length-1) vis.appendChild(document.createTextNode(' '));
  });
}
document.querySelectorAll('[data-split]').forEach(splitText);

/* ============================================================
   2. le héros défilé
   ============================================================ */
const VIDEO_URL='assets/hero-scrub.mp4';
const VIDEO_BYTES=13894882;
const POSTER_URL='assets/hero-poster.jpg';
const ENDING_URL='assets/hero-ending.jpg';

const bands=[...document.querySelectorAll('.band')].map(el=>({
  el, a:parseFloat(el.dataset.a), b:parseFloat(el.dataset.b), op:-1, k:-1
}));

let target=0, shown=0, rafId=null, lastTick=0;
let seekBusy=false, pendingTime=null;
let heroOnScreen=true, scrubOn=false, heroInit=false;
let loadK=0, loadStart=0, loadRunning=false;

function heroProgress(){
  const range=hero.offsetHeight-window.innerHeight;
  if(range<=0) return 0;
  return clamp((-hero.getBoundingClientRect().top)/range,0,1);
}

function requestSeek(t){
  if(!video.duration||!isFinite(t)) return;
  if(seekBusy){pendingTime=t;return;}
  seekBusy=true;
  try{video.currentTime=t;}catch(e){seekBusy=false;}
}
video.addEventListener('seeked',()=>{
  seekBusy=false;
  if(pendingTime!==null){const t=pendingTime;pendingTime=null;requestSeek(t);}
});
video.addEventListener('error',()=>{seekBusy=false;pendingTime=null;failVideo();});

function updateCaptions(p){
  for(const b of bands){
    const len=b.b-b.a;
    const f=Math.min(0.02,len/3);
    const isFirst=b.a===0, isLast=b.b===1;
    const inEase=isFirst?1:smoothstep(p,b.a,b.a+f);
    const outEase=isLast?1:(1-smoothstep(p,b.b-f,b.b));
    let op=inEase*outEase;
    const ramp=Math.min(0.025,len*0.35);
    let k=clamp((p-b.a)/ramp,0,1);
    if(isFirst) k=Math.max(k,loadK);
    if(Math.abs(op-b.op)>0.004){b.op=op;b.el.style.opacity=op.toFixed(3);}
    if(Math.abs(k-b.k)>0.008){b.k=k;b.el.style.setProperty('--k',k.toFixed(3));}
  }
}

function tick(now){
  const dt=Math.min(100,now-(lastTick||now));
  lastTick=now;
  const kk=0.16;
  shown+=(target-shown)*(1-Math.pow(1-kk,dt/16.667));
  let resting=Math.abs(target-shown)<0.0005;
  if(loadRunning){
    loadK=clamp((now-loadStart)/900,0,1);
    if(loadK>=1) loadRunning=false;
    resting=false;
  }
  if(resting){shown=target;rafId=null;lastTick=0;}
  else rafId=requestAnimationFrame(tick);
  if(video.duration) requestSeek(shown*video.duration);
  updateCaptions(shown);
}
function kickLoop(){if(rafId===null&&heroOnScreen&&scrubOn){lastTick=0;rafId=requestAnimationFrame(tick);}}
function onScroll(){target=heroProgress();kickLoop();}

function failVideo(){
  if(ring&&ring.parentNode){
    const chev=document.createElement('div');
    chev.className='chev';
    chev.innerHTML='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    chev.setAttribute('aria-hidden','true');
    ring.replaceWith(chev);
    ring=null;
  }
  video.style.display='none';
}

async function loadHeroBlob(){
  const ctrl=new AbortController();
  let watchdog=setTimeout(()=>ctrl.abort(),20000);
  const res=await fetch(VIDEO_URL,{signal:ctrl.signal});
  if(!res.ok||!res.body) throw new Error('http '+res.status);
  const total=Number(res.headers.get('Content-Length'))||VIDEO_BYTES;
  const reader=res.body.getReader();
  const chunks=[];
  let got=0,lastRing=0;
  for(;;){
    const {done,value}=await reader.read();
    if(done) break;
    clearTimeout(watchdog);
    watchdog=setTimeout(()=>ctrl.abort(),20000);
    chunks.push(value); got+=value.length;
    const frac=Math.min(1,got/total);
    const now=performance.now();
    if(now-lastRing>100||frac===1){
      lastRing=now;
      if(ring) ring.style.setProperty('--ld',Math.round(126*(1-frac)));
    }
  }
  clearTimeout(watchdog);
  if(ring) ring.style.setProperty('--ld',0);
  video.src=URL.createObjectURL(new Blob(chunks,{type:'video/mp4'}));
  video.load();
  video.addEventListener('canplay',()=>{
    if(ring&&ring.parentNode) ring.style.opacity='0';
    requestSeek(heroProgress()*video.duration);
    stage.classList.add('video-ready');
  },{once:true});
}

function initHeroOnce(){
  if(heroInit) return;
  heroInit=true;
  posterLayer.style.backgroundImage="url('"+POSTER_URL+"')";
  loadStart=performance.now(); loadRunning=true; loadK=0;
  let started=false;
  const start=()=>{if(started)return;started=true;loadHeroBlob().catch(failVideo);};
  const img=new Image();
  img.onload=start; img.onerror=start; img.src=POSTER_URL;
  setTimeout(start,4000);
}

const GATES=[
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)'
];
function enableScrub(){
  if(scrubOn) return; scrubOn=true;
  initHeroOnce();
  addEventListener('scroll',onScroll,{passive:true});
  bands.forEach(b=>{b.op=-1;b.k=-1;});
  target=heroProgress(); shown=target;
  updateCaptions(target);
  onScroll();
}
function disableScrub(){
  paintStatic();
  if(!scrubOn) return; scrubOn=false;
  removeEventListener('scroll',onScroll);
  if(rafId!==null){cancelAnimationFrame(rafId);rafId=null;}
}
/* le héros fixe : une seule image téléchargée, l'arrivée au repos du film */
let staticPainted=false;
function paintStatic(){
  if(staticPainted||heroInit) return; staticPainted=true;
  posterLayer.style.backgroundImage="url('"+ENDING_URL+"')";
}
function applyHeroMode(){
  if(GATES.some(q=>matchMedia(q).matches)) disableScrub();
  else enableScrub();
}
GATES.map(q=>matchMedia(q)).forEach(m=>m.addEventListener('change',applyHeroMode));

new IntersectionObserver(es=>{
  heroOnScreen=es[0].isIntersecting;
  if(heroOnScreen) kickLoop();
},{rootMargin:'120px'}).observe(hero);

/* départ */
applyHeroMode();
addEventListener('resize',()=>{if(scrubOn){target=heroProgress();kickLoop();}},{passive:true});

})();
