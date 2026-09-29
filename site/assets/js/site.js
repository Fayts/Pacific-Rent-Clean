/* ============================================================
   PACIFIC RENT&CLEAN · comportements communs à toutes les pages
   Chargé par index, prestations, location, methode, faq, reserver.
   ============================================================ */
(function(){
"use strict";

/* ============================================================
   1. le bandeau d'instrument (présent sur l'accueil seulement)
   ============================================================ */
(function(){
  const track=document.getElementById('track');
  if(!track) return;
  const items=['Injection extraction','Matériel professionnel','Intervention à domicile',
               'Location disponible','Produits professionnels','Tahiti','Ouvert 7j/7'];
  let html='';
  for(let r=0;r<6;r++) html+=items.map(t=>'<span>'+t+'</span>').join('');
  track.innerHTML=html;
})();

/* ============================================================
   2. la barre de navigation se densifie une fois le haut passé
   ============================================================ */
(function(){
  const nav=document.getElementById('nav');
  if(!nav) return;
  const top=document.getElementById('top');
  if(top&&'IntersectionObserver' in window){
    new IntersectionObserver(es=>{
      nav.classList.toggle('solid',!es[0].isIntersecting);
    },{threshold:0,rootMargin:'-70px 0px 0px 0px'}).observe(top);
  }else{
    const paint=()=>nav.classList.toggle('solid',window.scrollY>70);
    addEventListener('scroll',paint,{passive:true});
    paint();
  }
})();

/* ============================================================
   3. le menu des petits écrans
   ============================================================ */
(function(){
  const burger=document.getElementById('navBurger');
  const menu=document.getElementById('menu');
  if(!burger||!menu) return;
  const closeBtn=menu.querySelector('.menu-close');

  function set(open){
    document.body.classList.toggle('menu-open',open);
    burger.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-hidden',String(!open));
    if(open){const first=menu.querySelector('a'); if(first) first.focus();}
    else burger.focus();
  }
  burger.addEventListener('click',()=>set(true));
  if(closeBtn) closeBtn.addEventListener('click',()=>set(false));
  menu.addEventListener('click',e=>{if(e.target.closest('a')) set(false);});
  addEventListener('keydown',e=>{
    if(e.key==='Escape'&&document.body.classList.contains('menu-open')) set(false);
  });
  matchMedia('(min-width: 901px)').addEventListener('change',e=>{
    if(e.matches&&document.body.classList.contains('menu-open')) set(false);
  });
  menu.setAttribute('aria-hidden','true');
})();

/* ============================================================
   4. entrées chorégraphiées
   ============================================================ */
(function(){
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.rev,.stag,.pass,.proc').forEach(el=>el.classList.add('in'));
    return;
  }
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target;
      el.classList.add('in');
      if(el.classList.contains('stag')) setTimeout(()=>el.classList.add('done'),1200);
      io.unobserve(el);
    });
  },{rootMargin:'0px 0px -12% 0px',threshold:.08});
  document.querySelectorAll('.rev,.stag,.pass,.proc').forEach(el=>io.observe(el));
})();

/* la ligne du procédé, mesurée pour se dessiner juste */
(function(){
  const path=document.querySelector('.proc-line path');
  if(!path) return;
  const len=path.getTotalLength?path.getTotalLength():1200;
  path.style.setProperty('--len',len);
})();

/* ============================================================
   5. FAQ : une seule réponse ouverte par liste
   ============================================================ */
document.querySelectorAll('.q > button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const q=btn.parentElement;
    const list=q.parentElement;
    const open=btn.getAttribute('aria-expanded')==='true';
    list.querySelectorAll('.q').forEach(other=>{
      other.removeAttribute('open');
      const b=other.querySelector('button');
      if(b) b.setAttribute('aria-expanded','false');
    });
    if(!open){q.setAttribute('open','');btn.setAttribute('aria-expanded','true');}
  });
});

/* ============================================================
   6. les formulaires : le message est préparé dans la messagerie
   ============================================================ */
document.querySelectorAll('form[data-mailto]').forEach(form=>{
  const msg=form.querySelector('[data-form-msg]');
  const say=t=>{if(msg) msg.textContent=t;};
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const get=n=>{const el=form.elements[n];return el?String(el.value).trim():'';};
    const nom=get('nom'), mail=get('mail'), tel=get('tel'), objet=get('objet'), txt=get('msg');
    if(!nom||!mail||!txt){say('Il manque le nom, le courriel ou le besoin.');return;}
    const to=form.dataset.mailto;
    if(!to){say('L’adresse de destination n’est pas branchée sur ce site.');return;}
    const sujet=(form.dataset.subject||'Demande · Pacific Rent&Clean')+(objet?' · '+objet:'');
    const body='Nom : '+nom+'\nCourriel : '+mail+
               '\nTéléphone : '+(tel||'non communiqué')+
               (objet?'\nObjet : '+objet:'')+'\n\n'+txt;
    window.location.href='mailto:'+to+'?subject='+encodeURIComponent(sujet)+
                         '&body='+encodeURIComponent(body);
    say('Votre messagerie s’ouvre avec le message prêt. Il ne part qu’une fois envoyé.');
  });
});

/* le formulaire serveur de la page contact */
document.querySelectorAll('form[data-contact-form]').forEach(form=>{
  const shell=form.closest('[data-contact-shell]');
  const success=shell?shell.querySelector('[data-contact-success]'):null;
  const status=form.querySelector('[data-contact-status]');
  const loaded=form.elements.loadedAt;
  if(loaded) loaded.value=String(Date.now());
  const say=t=>{if(status) status.textContent=t||'';};
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(form.classList.contains('is-loading')) return;
    const fd=new FormData(form);
    const payload=Object.fromEntries(fd.entries());
    if(!payload.name||!payload.email||!payload.message){say('Merci de compléter le nom, l’e-mail et le message.');return;}
    form.classList.add('is-loading');
    const button=form.querySelector('button[type="submit"]');
    if(button){button.disabled=true;button.textContent='Envoi…';}
    say('Envoi du message en cours.');
    try{
      const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await res.json().catch(()=>({}));
      if(!res.ok||data.ok===false) throw new Error(data.message||'L’envoi n’a pas abouti.');
      say('');
      if(shell) shell.classList.add('is-sent');
      if(success){success.setAttribute('aria-hidden','false');setTimeout(()=>success.focus(),120);}
    }catch(err){
      say(err&&err.message?err.message:'L’envoi est momentanément indisponible.');
    }finally{
      form.classList.remove('is-loading');
      if(button){button.disabled=false;button.textContent='Envoyer';}
    }
  });
});

/* le formulaire de location */
document.querySelectorAll('form[data-location-form]').forEach(form=>{
  const shell=form.closest('[data-location-shell]');
  const success=shell?shell.querySelector('[data-location-success]'):null;
  const status=form.querySelector('[data-location-status]');
  const loaded=form.elements.loadedAt;
  const dateInput=form.elements.date;
  const commune=form.elements.commune;
  const address=form.elements.address;
  const handoffNote=form.querySelector('[data-handoff-note]');
  const submit=form.querySelector('button[type="submit"]');
  const fmt=n=>Number(n||0).toLocaleString('fr-FR')+' XPF';
  const packageMeta={standard:{label:'Standard',price:6390},'auto-home':{label:'Auto-Home',price:7990}};
  const free=new Set(['Papeete','Pirae','Arue','Mahina']);
  const mid=new Set(['Faa’a','Papenoo']);
  const say=t=>{if(status) status.textContent=t||'';};
  const setSummary=(key,value)=>{const el=form.querySelector('[data-summary="'+key+'"]'); if(el) el.textContent=value||'—';};
  const selected=n=>{const el=form.querySelector('input[name="'+n+'"]:checked'); return el?el.value:'';};
  const deliveryFee=()=>{
    if(selected('handoff')!=='Livraison à domicile') return 0;
    const c=commune?commune.value:'';
    if(!c) return 0;
    if(free.has(c)) return 0;
    if(mid.has(c)) return 1500;
    return 2500;
  };
  const today=new Date(); today.setHours(0,0,0,0); today.setDate(today.getDate()+2);
  const min=today.toISOString().slice(0,10);
  if(dateInput) dateInput.min=min;
  if(loaded) loaded.value=String(Date.now());
  const params=new URLSearchParams(location.search);
  const preset=params.get('forfait');
  if(packageMeta[preset]){
    const el=form.querySelector('input[name="package"][value="'+preset+'"]');
    if(el) el.checked=true;
  }else if(params.get('type')==='location'){
    const el=form.querySelector('input[name="package"][value="standard"]');
    if(el) el.checked=true;
  }
  function update(){
    const pack=packageMeta[selected('package')];
    const fee=deliveryFee();
    const handoff=selected('handoff');
    if(address){
      const needsAddress=handoff==='Livraison à domicile';
      address.required=needsAddress;
      address.closest('.field')?.classList.toggle('is-hidden',!needsAddress);
    }
    if(handoffNote){
      handoffNote.textContent=handoff==='Retrait à un point convenu'
        ? 'Indiquez votre commune : nous vous contactons pour fixer le point de retrait convenu.'
        : 'Pour une livraison, indiquez la commune et l’adresse. La localisation ou le repère reste facultatif.';
    }
    setSummary('package',pack?pack.label+' — '+fmt(pack.price):'—');
    setSummary('date',dateInput&&dateInput.value?dateInput.value:'—');
    setSummary('handoff',handoff||'—');
    setSummary('commune',commune&&commune.value?commune.value:'—');
    setSummary('delivery',fmt(fee));
    setSummary('payment',selected('payment')||'—');
    setSummary('total',fmt((pack?pack.price:0)+fee));
  }
  form.addEventListener('input',update);
  form.addEventListener('change',update);
  update();
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    say('');
    if(form.classList.contains('is-loading')) return;
    update();
    if(!form.checkValidity()){
      form.reportValidity();
      say('Merci de compléter les champs obligatoires.');
      return;
    }
    const fd=new FormData(form);
    const payload=Object.fromEntries(fd.entries());
    form.classList.add('is-loading');
    if(submit){submit.disabled=true;submit.textContent='ENVOI…';}
    say('Envoi de votre demande en cours.');
    try{
      const res=await fetch('/api/location',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await res.json().catch(()=>({}));
      if(!res.ok||data.ok===false) throw new Error(data.message||'L’envoi n’a pas abouti.');
      say('');
      if(shell) shell.classList.add('is-sent');
      if(success){success.setAttribute('aria-hidden','false');setTimeout(()=>success.focus(),120);}
    }catch(err){
      say(err&&err.message?err.message:'L’envoi est momentanément indisponible.');
    }finally{
      form.classList.remove('is-loading');
      if(submit){submit.disabled=false;submit.textContent='ENVOYER MA DEMANDE';}
    }
  });
});

/* ============================================================
   7. mouvement réduit, dans les deux sens
   ============================================================ */
(function(){
  const rmq=matchMedia('(prefers-reduced-motion: reduce)');
  function pin(){
    document.body.classList.add('rm');
    document.querySelectorAll('.rev,.stag,.pass,.proc').forEach(el=>el.classList.add('in'));
    document.querySelectorAll('.stag').forEach(el=>el.classList.add('done'));
    const path=document.querySelector('.proc-line path');
    if(path) path.style.strokeDashoffset='0';
  }
  function unpin(){
    document.body.classList.remove('rm');
    const path=document.querySelector('.proc-line path');
    if(path) path.style.strokeDashoffset='';
  }
  rmq.addEventListener('change',e=>{e.matches?pin():unpin();});
  if(rmq.matches) pin();
})();

/* ============================================================
   8. on met tout en pause quand l'onglet est caché
   ============================================================ */
document.addEventListener('visibilitychange',()=>{
  document.body.classList.toggle('paused',document.hidden);
});

})();
