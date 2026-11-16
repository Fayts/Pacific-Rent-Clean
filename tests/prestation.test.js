const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const rules = require('../site/assets/js/prestation-rules');
const handler = require('../site/api/prestation');

test('la grille Prestations et le panier proposent les douze mêmes tarifs', () => {
  const page = readFileSync(require.resolve('../site/prestations.html'), 'utf8');
  const rows = Array.from(page.matchAll(/<tr><th scope="row">([^<]+)<\/th><td>([\d ]+) F<\/td><\/tr>/g));
  assert.equal(rows.length, 12);
  for (const [, label, number] of rows)
    assert.equal(rules.catalog.find(p => p.label === label)?.price, Number(number.replaceAll(' ', '')));
});

test('J0 interdit, urgence demain uniquement, standard à partir de J+2 à Tahiti', () => {
  const before = new Date('2028-02-29T09:59:59Z');
  const after = new Date('2028-02-29T10:00:00Z');
  for (const [now, today, tomorrow, standard] of [[before, '2028-02-28', '2028-02-29', '2028-03-01'],
    [after, '2028-02-29', '2028-03-01', '2028-03-02']]) {
    for (const mode of ['urgent', 'standard']) assert.equal(rules.validDate(today, mode, now), false);
    assert.ok(rules.validDate(tomorrow, 'urgent', now));
    assert.equal(rules.validDate(tomorrow, 'standard', now), false);
    assert.equal(rules.validDate(standard, 'urgent', now), false);
    assert.ok(rules.validDate(standard, 'standard', now));
    assert.equal(rules.validDate('2029-02-29', 'standard', now), false);
  }
});

test('montants multi-articles, frais par commune, urgence unique par demande', () => {
  for (const [commune, fee] of [['Papeete',0],['Pirae',0],['Arue',0],['Mahina',0],['Faa’a',1500],['Papenoo',1500],['Autre commune',2500]]) {
    for (const mode of ['standard','urgent']) {
      const price = rules.quote([{ id: 'matelas-queen', quantity: 1 }, { id: 'tapis-moyen', quantity: 2 }], mode, commune);
      assert.equal(price.total, 19000 + fee + (mode === 'urgent' ? 1500 : 0));
    }
  }
});

function setup(t) {
  process.env.RESEND_API_KEY = 'test';
  const sent = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    sent.push(JSON.parse(options.body));
    return { ok: true, json: async () => ({ id: 'test-id' }) };
  });
  const valid = { name: 'TEST', email: 'test@example.invalid', mobile: '00000000', address: 'TEST',
    requestId: 'aaaa0000-0000-4000-b000-000000000001', mode: 'urgent', date: rules.dateRange('urgent').min,
    items: [{ id: 'matelas-double', quantity: 2 }], commune: 'Papenoo', formAgeMs: 5000 };
  async function submit(overrides) {
    const res = { setHeader() {}, status(code) { this.code = code; return this; }, json(data) { this.data = data; } };
    await handler({ method: 'POST', body: { ...valid, ...overrides } }, res);
    return res;
  }
  return { submit, sent };
}

test('le serveur ignore les prix transmis et envoie une demande de validation', async t => {
  const { submit, sent } = setup(t);
  const res = await submit({ total: 1, urgent: 0, travel: 0, items: [{ id: 'matelas-double', quantity: 2, price: 1 }] });
  assert.equal(res.code, 200);
  assert.equal(res.data.emailId, 'test-id');
  assert.match(sent[0].text, /valider manuellement/);
  assert.ok(sent[0].text.includes('Total : ' + rules.money(23000)));
});

test('l’API refuse un panier ou des coordonnées invalides avant tout envoi', async t => {
  const { submit, sent } = setup(t);
  for (const overrides of [{ items: [] }, { items: [null] }, { items: [{ id: 'auto', quantity: 1 }] },
    ...[0,-1,1.5,'2',Number.MAX_SAFE_INTEGER].map(quantity => ({ items: [{ id: 'fauteuil', quantity }] })),
    { date: '2099-02-31' }, { mode: 'autre' }, { commune: 'inconnue' }, { commune: 'Autre commune' },
    { email: 'test' }, { name: ' ' }, { mobile: '' }, { address: '' }, { website: 'bot' }])
    assert.equal((await submit(overrides)).code, 400);
  assert.equal(sent.length, 0);
});
