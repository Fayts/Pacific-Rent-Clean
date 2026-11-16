const { test } = require('node:test');
const assert = require('node:assert/strict');
const { minimumDate, isAllowed } = require('../site/assets/js/location-dates');
process.env.RESEND_API_KEY = 'local-test';
const handler = require('../site/api/location');

test('J+2 suit minuit à Tahiti, même au changement d’année ou de mois', () => {
  for (const [instant, expected] of [
    ['2026-12-30T09:59:59.999Z', '2026-12-31'],
    ['2026-12-30T10:00:00.000Z', '2027-01-01'],
    ['2028-02-27T10:00:00.000Z', '2028-02-29'],
    ['2027-02-27T10:00:00.000Z', '2027-03-01'],
  ]) {
    const now = new Date(instant);
    assert.equal(minimumDate(now), expected);
    assert.ok(isAllowed(expected, now));
    const previous = new Date(expected + 'T00:00:00Z');
    previous.setUTCDate(previous.getUTCDate() - 1);
    assert.equal(isAllowed(previous.toISOString().slice(0, 10), now), false);
  }
});

// Le transport Resend est remplacé avant chaque appel du véritable handler.
function request(t, receipt = { id: 'test-email-id' }) {
  const messages = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    messages.push(JSON.parse(options.body));
    return { ok: true, json: async () => receipt };
  });
  const valid = {
    package: 'standard', date: minimumDate(), handoff: 'Livraison à domicile',
    commune: 'Arue', address: 'Rue test', firstName: 'Client', lastName: 'Test',
    email: 'client@example.org', mobile: '87000000', payment: 'Virement',
    acceptedCgs: 'on', loadedAt: Date.now() - 5000,
  };
  async function submit(overrides) {
    const res = { setHeader() {}, end(body) {
      if (this.statusCode === 200) assert.equal(JSON.parse(body).emailId, receipt.id);
    } };
    await handler({ method: 'POST', body: JSON.stringify({ ...valid, ...overrides }) }, res);
    return res.statusCode;
  }
  return { submit, messages, valid };
}

test('une demande filtrée ne déclenche ni envoi ni confirmation', async t => {
  const { submit, messages } = request(t);
  for (const overrides of [{ website: 'robot' }, { loadedAt: null }, { loadedAt: Date.now() }, { loadedAt: 'abc' }]) {
    assert.equal(await submit(overrides), 400);
  }
  assert.equal(messages.length, 0);
});

test('une réponse Resend sans identifiant ne confirme pas la demande', async t => {
  const { submit } = request(t, {});
  assert.equal(await submit({}), 502);
});

test('le serveur refuse les dates impossibles, incomplètes ou trop proches', async t => {
  const { submit, messages } = request(t);
  for (const date of ['2099-02-29', '2096-02-31', '2099-04-31', '2099-13-01',
    '2099-00-01', '2099-01-00', '2099-1-01', '2099-12-01T00:00:00Z', '2000-01-01', ['2099-12-01']]) {
    assert.equal(await submit({ date }), 400, String(date));
  }
  assert.equal(messages.length, 0);
});

test('chaque champ obligatoire est contrôlé avant tout envoi', async t => {
  const { submit, messages, valid } = request(t);
  for (const field of Object.keys(valid).filter(field => field !== 'loadedAt')) {
    assert.equal(await submit({ [field]: undefined }), 400, field);
  }
  for (const overrides of [{ package: 'constructor' }, { email: 'invalide' },
    { firstName: '   ' }, { payment: 'carte' }, { handoff: 'inconnu' },
    { acceptedCgs: false }, { acceptedCgs: 'false' }]) {
    assert.equal(await submit(overrides), 400);
  }
  assert.equal(messages.length, 0);
});

test('les frais de remise et le total sont recalculés pour chaque mode et commune', async t => {
  const { submit, messages } = request(t);
  const fees = { Papeete: 0, Pirae: 0, Arue: 0, Mahina: 0, 'Faa’a': 1500, Papenoo: 1500, 'Autre commune': 2500 };
  for (const handoff of ['Livraison à domicile', 'Retrait à un point convenu']) {
    for (const [commune, fee] of Object.entries(fees)) {
      for (const [pack, price] of [['standard', 6390], ['auto-home', 7990]]) {
        const address = handoff === 'Livraison à domicile' ? 'Rue test' : '';
        assert.equal(await submit({ commune, handoff, address, package: pack, fee: 1, total: 1 }), 200);
        const lines = messages.at(-1).text.split('\n');
        assert.ok(lines.includes('Frais de remise : ' + fee.toLocaleString('fr-FR') + ' XPF'));
        assert.ok(lines.includes('TOTAL : ' + (price + fee).toLocaleString('fr-FR') + ' XPF'));
      }
    }
  }
});

test('l’acceptation reçue avec la demande figure dans les deux formats du courriel', async t => {
  const { submit, messages } = request(t);
  for (const acceptedCgs of ['on', true, 'true']) {
    const before = Date.now();
    assert.equal(await submit({ acceptedCgs }), 200);
    const { text, html } = messages.at(-1);
    const record = text.match(/^CGS Location acceptées : oui — reçu le (.+)$/m);
    assert.ok(record);
    const time = Date.parse(record[1]);
    assert.ok(time >= before && time <= Date.now());
    assert.ok(html.includes(record[0]));
  }
});
