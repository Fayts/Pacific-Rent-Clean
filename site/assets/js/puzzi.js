/* ============================================================
   PACIFIC RENT&CLEAN · le Puzzi 10/1 en volume
   Tourne-disque de 36 images + points d'accroche.
   Chargé par index.html (aperçu) et location.html (détail).
   ============================================================ */
(function(){
"use strict";
if(!document.getElementById('turn')) return;

const TURN={"n":36,"best":{"pistolet":33,"fauteuil":35,"sale":0,"propre":0,"flexible":26},"f":[{"pistolet":[27.23,60.88,1],"fauteuil":[45.36,67.2,1],"sale":[49.35,20.5,1],"propre":[49.35,39,1],"flexible":[23.81,58.8,0]},{"pistolet":[22.28,60.43,1],"fauteuil":[39.69,66.96,1],"sale":[50.13,20.5,1],"propre":[50.13,39,1],"flexible":[25.88,58.49,0]},{"pistolet":[18.58,59.88,1],"fauteuil":[34.51,66.52,1],"sale":[50.89,20.5,1],"propre":[50.89,39,1],"flexible":[28.44,58.21,0]},{"pistolet":[16.17,59.26,1],"fauteuil":[30.05,65.9,1],"sale":[51.6,20.5,1],"propre":[51.6,39,1],"flexible":[31.38,57.95,0]},{"pistolet":[15.01,58.57,0.72],"fauteuil":[26.46,65.12,1],"sale":[52.24,20.5,1],"propre":[52.24,39,1],"flexible":[34.62,57.72,0]},{"pistolet":[15.02,57.84,0.23],"fauteuil":[23.85,64.2,1],"sale":[52.8,20.5,1],"propre":[52.8,39,1],"flexible":[38.08,57.54,0]},{"pistolet":[16.05,57.1,0],"fauteuil":[22.22,63.16,0.98],"sale":[53.25,20.5,1],"propre":[53.25,39,1],"flexible":[41.7,57.41,0]},{"pistolet":[17.98,56.36,0],"fauteuil":[21.57,62.04,0.51],"sale":[53.58,20.5,1],"propre":[53.58,39,1],"flexible":[45.41,57.32,0]},{"pistolet":[20.65,55.65,0],"fauteuil":[21.81,60.88,0.02],"sale":[53.78,20.5,1],"propre":[53.78,39,1],"flexible":[49.18,57.29,0]},{"pistolet":[23.94,54.99,0],"fauteuil":[22.85,59.71,0],"sale":[53.85,20.5,1],"propre":[53.85,39,1],"flexible":[52.95,57.32,0]},{"pistolet":[27.71,54.4,0],"fauteuil":[24.59,58.56,0],"sale":[53.78,20.5,1],"propre":[53.78,39,1],"flexible":[56.67,57.4,0]},{"pistolet":[31.87,53.89,0],"fauteuil":[26.92,57.47,0],"sale":[53.58,20.5,1],"propre":[53.58,39,1],"flexible":[60.3,57.53,0]},{"pistolet":[36.31,53.49,0],"fauteuil":[29.74,56.47,0],"sale":[53.25,20.5,1],"propre":[53.25,39,1],"flexible":[63.77,57.71,0]},{"pistolet":[40.95,53.21,0],"fauteuil":[32.95,55.59,0],"sale":[52.8,20.5,1],"propre":[52.8,39,1],"flexible":[67.04,57.93,0]},{"pistolet":[45.71,53.04,0],"fauteuil":[36.47,54.87,0],"sale":[52.24,20.5,1],"propre":[52.24,39,1],"flexible":[70.01,58.18,0]},{"pistolet":[50.52,53.01,0],"fauteuil":[40.21,54.31,0],"sale":[51.6,20.5,1],"propre":[51.6,39,1],"flexible":[72.61,58.47,0]},{"pistolet":[55.32,53.11,0],"fauteuil":[44.1,53.95,0],"sale":[50.89,20.5,1],"propre":[50.89,39,1],"flexible":[74.73,58.77,0]},{"pistolet":[60.03,53.33,0],"fauteuil":[48.07,53.78,0],"sale":[50.13,20.5,1],"propre":[50.13,39,1],"flexible":[76.26,59.08,0]},{"pistolet":[64.58,53.67,0],"fauteuil":[52.07,53.82,0],"sale":[49.35,20.5,1],"propre":[49.35,39,1],"flexible":[77.07,59.4,0.33]},{"pistolet":[68.89,54.13,0],"fauteuil":[56.02,54.06,0],"sale":[48.57,20.5,1],"propre":[48.57,39,1],"flexible":[77.04,59.7,0.81]},{"pistolet":[72.87,54.67,0],"fauteuil":[59.87,54.49,0],"sale":[47.81,20.5,1],"propre":[47.81,39,1],"flexible":[76.05,59.99,1]},{"pistolet":[76.43,55.3,0],"fauteuil":[63.53,55.11,0],"sale":[47.1,20.5,1],"propre":[47.1,39,1],"flexible":[74.01,60.25,1]},{"pistolet":[79.43,55.99,0],"fauteuil":[66.95,55.9,0],"sale":[46.46,20.5,1],"propre":[46.46,39,1],"flexible":[70.88,60.47,1]},{"pistolet":[81.76,56.72,0],"fauteuil":[70.03,56.82,0],"sale":[45.9,20.5,1],"propre":[45.9,39,1],"flexible":[66.7,60.66,1]},{"pistolet":[83.27,57.46,0],"fauteuil":[72.68,57.85,0],"sale":[45.45,20.5,1],"propre":[45.45,39,1],"flexible":[61.6,60.79,1]},{"pistolet":[83.82,58.2,0.47],"fauteuil":[74.81,58.97,0],"sale":[45.12,20.5,1],"propre":[45.12,39,1],"flexible":[55.81,60.88,1]},{"pistolet":[83.28,58.91,0.95],"fauteuil":[76.31,60.13,0],"sale":[44.92,20.5,1],"propre":[44.92,39,1],"flexible":[49.63,60.91,1]},{"pistolet":[81.52,59.57,1],"fauteuil":[77.08,61.31,0.2],"sale":[44.85,20.5,1],"propre":[44.85,39,1],"flexible":[43.44,60.88,1]},{"pistolet":[78.48,60.16,1],"fauteuil":[77,62.46,0.68],"sale":[44.92,20.5,1],"propre":[44.92,39,1],"flexible":[37.6,60.8,1]},{"pistolet":[74.16,60.66,1],"fauteuil":[76,63.55,1],"sale":[45.12,20.5,1],"propre":[45.12,39,1],"flexible":[32.42,60.67,1]},{"pistolet":[68.66,61.06,1],"fauteuil":[74.02,64.54,1],"sale":[45.45,20.5,1],"propre":[45.45,39,1],"flexible":[28.15,60.49,1]},{"pistolet":[62.18,61.35,1],"fauteuil":[71.05,65.42,1],"sale":[45.9,20.5,1],"propre":[45.9,39,1],"flexible":[24.93,60.27,1]},{"pistolet":[55.01,61.51,1],"fauteuil":[67.13,66.15,1],"sale":[46.46,20.5,1],"propre":[46.46,39,1],"flexible":[22.79,60.01,1]},{"pistolet":[47.52,61.55,1],"fauteuil":[62.39,66.7,1],"sale":[47.1,20.5,1],"propre":[47.1,39,1],"flexible":[21.71,59.73,0.86]},{"pistolet":[40.14,61.45,1],"fauteuil":[57,67.07,1],"sale":[47.81,20.5,1],"propre":[47.81,39,1],"flexible":[21.6,59.43,0.38]},{"pistolet":[33.26,61.23,1],"fauteuil":[51.23,67.23,1],"sale":[48.57,20.5,1],"propre":[48.57,39,1],"flexible":[22.34,59.11,0]}]};

(function(){
  const turn=document.getElementById('turn');
  if(!turn) return;
  const img=document.getElementById('turnImg');
  const ring=document.getElementById('turnRing');
  const hots=[...turn.querySelectorAll('.hot')];
  const items=[...document.querySelectorAll('.mach-item[data-hot]')];
  const N=TURN.n;
  const pad=n=>String(n).padStart(2,'0');
  const src=i=>'assets/machine/m'+pad(((i%N)+N)%N)+'.webp';

  let idx=0, shownIdx=-1, vel=0, dragging=false, lastX=0, lastT=0;
  let active=null, target=null, targetT=0, targetFrom=0;
  let idleAt=performance.now()+6000, raf=null, inView=false, loaded=false, armed=false;
  const rm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- chargement des 36 images, derriere un anneau honnete --- */
  function preload(){
    if(armed) return; armed=true;
    let got=0;
    for(let i=0;i<N;i++){
      const im=new Image();
      im.onload=im.onerror=()=>{
        got++;
        if(ring) ring.style.setProperty('--ld',Math.round(126*(1-got/N)));
        if(got===N){loaded=true;turn.classList.add('loaded');draw(true);}
      };
      im.src=src(i);
    }
    setTimeout(()=>{if(!loaded){loaded=true;turn.classList.add('loaded');}},15000);
  }

  /* --- ecriture DOM uniquement au changement --- */
  function draw(force){
    const i=((Math.round(idx)%N)+N)%N;
    if(i!==shownIdx||force){
      shownIdx=i;
      img.src=src(i);
      turn.setAttribute('aria-valuenow',Math.round(i*360/N));
      turn.setAttribute('aria-valuetext',Math.round(i*360/N)+' degrés');
      const fr=TURN.f[i];
      for(const h of hots){
        const a=fr[h.dataset.hot]; if(!a) continue;
        h.style.left=a[0]+'%'; h.style.top=a[1]+'%';
        h.style.setProperty('--o',a[2]);
        h.dataset.behind=a[2]<0.34?'1':'0';
      }
    }
  }

  function tick(now){
    let busy=false;
    if(target!==null){
      const k=Math.min(1,(now-targetT)/620);
      const e=1-Math.pow(1-k,3);
      idx=targetFrom+(target-targetFrom)*e;
      if(k>=1){idx=target;target=null;} else busy=true;
    } else if(!dragging){
      if(Math.abs(vel)>0.0006){ idx+=vel*16.667; vel*=0.93; busy=true; }
      else if(!rm()&&!active&&inView&&now>idleAt){ idx+=0.055; busy=true; }
    }
    draw(false);
    raf = busy||dragging ? requestAnimationFrame(tick) : null;
  }
  function kick(){ if(raf===null) raf=requestAnimationFrame(tick); }

  /* --- glisser --- */
  function down(e){
    dragging=true; vel=0; target=null; turn.classList.add('dragging','touched');
    lastX=e.clientX; lastT=performance.now();
    try{turn.setPointerCapture(e.pointerId);}catch(_){}
    kick(); e.preventDefault();
  }
  function move(e){
    if(!dragging) return;
    const now=performance.now(), dx=e.clientX-lastX, dt=Math.max(8,now-lastT);
    const perPx=(N*1.35)/turn.getBoundingClientRect().width;
    idx-=dx*perPx; vel=-(dx*perPx)/dt;   // la face proche suit le doigt
    lastX=e.clientX; lastT=now;
    draw(false);
  }
  function up(e){
    if(!dragging) return;
    dragging=false; turn.classList.remove('dragging');
    idleAt=performance.now()+6000;
    try{turn.releasePointerCapture(e.pointerId);}catch(_){}
    kick();
  }
  turn.addEventListener('pointerdown',down);
  turn.addEventListener('pointermove',move);
  turn.addEventListener('pointerup',up);
  turn.addEventListener('pointercancel',up);
  turn.addEventListener('keydown',e=>{
    const step=e.shiftKey?3:1;
    if(e.key==='ArrowLeft'){idx-=step;target=null;vel=0;turn.classList.add('touched');draw(false);e.preventDefault();}
    else if(e.key==='ArrowRight'){idx+=step;target=null;vel=0;turn.classList.add('touched');draw(false);e.preventDefault();}
    idleAt=performance.now()+6000;
  });

  /* --- selection d'une piece : la machine se tourne pour la montrer --- */
  function spinTo(i){
    const cur=((idx%N)+N)%N;
    let d=i-cur; if(d>N/2) d-=N; if(d<-N/2) d+=N;
    if(rm()){ idx=cur+d; draw(false); return; }
    targetFrom=idx; target=idx+d; targetT=performance.now(); kick();
  }
  function select(name){
    active=(active===name)?null:name;
    hots.forEach(h=>h.setAttribute('aria-pressed',String(h.dataset.hot===active)));
    items.forEach(i=>i.setAttribute('aria-pressed',String(i.dataset.hot===active)));
    if(active!=null&&TURN.best[active]!=null){ turn.classList.add('touched'); spinTo(TURN.best[active]); }
    idleAt=performance.now()+8000;
  }
  hots.concat(items).forEach(el=>el.addEventListener('click',()=>select(el.dataset.hot)));

  new IntersectionObserver(es=>{
    inView=es[0].isIntersecting;
    if(inView){ preload(); idleAt=performance.now()+3000; kick(); }
  },{rootMargin:'300px'}).observe(turn);

  draw(true);
  select('propre');
  idx=0; draw(true);
})();

})();
