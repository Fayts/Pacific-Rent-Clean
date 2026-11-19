'use strict';

(() => {
  const form = document.querySelector('#prestation-form');
  const fields = form.elements;
  const cart = document.querySelector('#articles');
  const summary = document.querySelector('#summary');
  const status = document.querySelector('#status');
  const add = document.querySelector('#add');
  const submit = form.querySelector('[type=submit]');
  const rules = prestationRules;
  const groups = { matelas: 'Matelas', canapes: 'Canapés', tapis: 'Tapis' };
  const requestId = crypto.randomUUID();
  let acceptedAt;
  let consentStamp;
  fields.acceptedCgs.addEventListener('change', () => {
    consentStamp = undefined;
    acceptedAt = fields.acceptedCgs.checked ? new Date().toISOString() : undefined;
  });
  const quoteLink = form.querySelector('a[href*="demande=devis"]');
  const openedAt = performance.now();

  for (const [commune, fee] of rules.travelFees) {
    fields.commune.add(new Option(commune + ' — ' + rules.money(fee), commune));
  }
  const template = document.querySelector('#article-template');
  const options = template.content.querySelector('.product');
  for (const [category, label] of Object.entries(groups)) {
    const group = document.createElement('optgroup');
    group.label = label;
    for (const product of rules.catalog.filter(item => item.category === category)) {
      group.append(new Option(product.label + ' — ' + rules.money(product.price), product.id));
    }
    options.append(group);
  }

  function addRow(preset) {
    const row = template.content.firstElementChild.cloneNode(true);
    const product = row.querySelector('.product');
    if (preset) product.value = preset.id;
    row.querySelector('.remove').addEventListener('click', () => {
      row.remove();
      add.focus();
      update();
    });
    cart.append(row);
    update();
    return product;
  }
  function items() {
    return Array.from(cart.children, row => ({
      id: row.querySelector('.product').value, quantity: row.querySelector('.quantity').valueAsNumber,
    }));
  }
  function line(label, value, className = '') {
    const wrapper = document.createElement('div');
    wrapper.className = className;
    const term = document.createElement('dt');
    const detail = document.createElement('dd');
    term.textContent = label;
    detail.textContent = value;
    wrapper.append(term, detail);
    summary.append(wrapper);
  }
  function update() {
    const mode = fields.mode.value;
    const commune = fields.commune.value;
    const range = rules.dateRange(mode);
    fields.date.min = range.min;
    fields.date.max = range.max;
    const other = commune === 'Autre commune';
    document.querySelector('#other-field').hidden = !other;
    fields.otherCommune.disabled = !other;
    fields.otherCommune.required = other;
    Array.from(cart.children).forEach((row, index) => {
      row.querySelector('legend').textContent = 'Article ' + (index + 1);
    });
    const selected = rules.catalog.find(product => product.id === items()[0]?.id);
    const quoteUrl = new URL('contact.html?demande=devis#demande-devis', location.href);
    if (selected) quoteUrl.searchParams.set('textile', selected.category);
    quoteLink.href = quoteUrl.href;
    summary.replaceChildren();
    try {
      // En attendant la commune, seul le sous-total articles est affiché.
      const price = rules.quote(items(), mode, commune || 'Papeete');
      for (const item of price.lines) line(item.quantity + ' × ' + item.label, rules.money(item.amount));
      line('Date souhaitée', fields.date.value ? fields.date.value.split('-').reverse().join('/') : 'À choisir');
      line('Articles', rules.money(price.subtotal));
      line('Supplément intervention urgente', rules.money(price.urgent));
      line('Déplacement', commune ? rules.money(price.travel) : 'Commune à choisir');
      line('Total', commune ? rules.money(price.total) : 'À préciser', 'summary-total');
    } catch (error) {
      line('Panier', error.message);
    }
  }
  add.addEventListener('click', () => addRow().focus());
  form.addEventListener('input', update);
  form.addEventListener('change', event => {
    if (event.target.name === 'mode') {
      const range = rules.dateRange(fields.mode.value);
      if (fields.mode.value === 'urgent') fields.date.value = range.min;
      else if (fields.date.value && !rules.validDate(fields.date.value, 'standard')) fields.date.value = '';
    }
    update();
  });
  fields.date.addEventListener('focus', update);
  const category = new URLSearchParams(location.search).get('categorie');
  addRow(rules.catalog.find(item => item.category === category));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    update();
    if (!form.reportValidity()) return;
    const payload = Object.fromEntries(new FormData(form));
    payload.acceptedAt = acceptedAt;
    payload.items = items();
    payload.requestId = requestId;
    payload.formAgeMs = Math.floor(performance.now() - openedAt);
    try {
      rules.quote(payload.items, payload.mode, payload.commune);
      if (!rules.validDate(payload.date, payload.mode)) throw new Error('Vérifiez la date souhaitée à Tahiti.');
      submit.disabled = true;
      form.classList.add('is-loading');
      status.textContent = 'Envoi de votre demande…';
      async function post(data) {
        const response = await fetch('/api/prestation', { method: 'POST',
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.message || 'L’envoi a échoué. Réessayez.');
        return result;
      }
      if (!consentStamp) {
        const prepared = await post({ ...payload, prepareConsent: true });
        if (!prepared.stamp) throw new Error('Rechargez le formulaire puis réessayez.');
        consentStamp = prepared.stamp;
      }
      const result = await post({ ...payload, stamp: consentStamp });
      if (!result.emailId) throw new Error('L’envoi a échoué. Réessayez.');
      form.hidden = true;
      const sent = document.querySelector('#sent');
      sent.hidden = false;
      sent.focus();
    } catch (error) {
      status.textContent = error.message;
    } finally {
      form.classList.remove('is-loading');
      submit.disabled = false;
    }
  });
})();
