const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'pacificrentclean@gmail.com';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Pacific Rent&Clean <onboarding@resend.dev>';
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const PACKAGES = {
  standard: { label: 'Standard', price: 6390 },
  'auto-home': { label: 'Auto-Home', price: 7990 },
};

const PAYMENTS = new Set(['Virement', 'Deblock', 'Espèces']);
const HANDOFFS = new Set(['Livraison à domicile', 'Retrait à un point convenu']);
const FREE_COMMUNES = new Set(['Papeete', 'Pirae', 'Arue', 'Mahina']);
const MID_COMMUNES = new Set(["Faa’a", 'Papenoo']);

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function clean(value, max = 1200) {
  return String(value || '').replace(/[<>]/g, '').replace(/\s+$/g, '').slice(0, max);
}

function escapeHtml(value) {
  return clean(value, 4000)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function minDateString() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

function isDateAllowed(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= minDateString();
}

function deliveryFee(handoff, commune) {
  if (FREE_COMMUNES.has(commune)) return 0;
  if (MID_COMMUNES.has(commune)) return 1500;
  return 2500;
}

function xpf(n) {
  return `${Number(n || 0).toLocaleString('fr-FR')} XPF`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, message: 'Méthode non autorisée.' });
  }

  if (!RESEND_API_KEY) {
    return json(res, 503, { ok: false, message: 'Configuration e-mail manquante.' });
  }

  let data;
  try {
    data = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch {
    return json(res, 400, { ok: false, message: 'Demande illisible.' });
  }

  const honeypot = clean(data.website, 200);
  const loadedAt = Number(data.loadedAt || 0);
  const ageMs = Date.now() - loadedAt;
  if (honeypot || !loadedAt || ageMs < 3000) {
    return json(res, 200, { ok: true });
  }

  const packageId = clean(data.package, 40);
  const selectedPackage = PACKAGES[packageId];
  const date = clean(data.date, 20);
  const handoff = clean(data.handoff, 80);
  const commune = clean(data.commune, 120);
  const address = clean(data.address, 300);
  const landmark = clean(data.landmark, 300);
  const lastName = clean(data.lastName, 120);
  const firstName = clean(data.firstName, 120);
  const email = clean(data.email, 160).trim();
  const mobile = clean(data.mobile, 80);
  const payment = clean(data.payment, 40);
  const accepted = data.acceptedCgs === true || data.acceptedCgs === 'true' || data.acceptedCgs === 'on';

  if (!selectedPackage || !isDateAllowed(date) || !HANDOFFS.has(handoff) || !commune || !lastName || !firstName || !isEmail(email) || !mobile || !PAYMENTS.has(payment) || !accepted) {
    return json(res, 400, { ok: false, message: 'Merci de vérifier les champs obligatoires.' });
  }

  if (handoff === 'Livraison à domicile' && !address) {
    return json(res, 400, { ok: false, message: 'Merci d’indiquer l’adresse de livraison.' });
  }

  const fee = deliveryFee(handoff, commune);
  const total = selectedPackage.price + fee;

  const lines = [
    'Nouvelle demande de location depuis pacific-rent-clean-v2-preview.vercel.app',
    '',
    `Forfait : ${selectedPackage.label} — ${xpf(selectedPackage.price)}`,
    `Date demandée : ${date}`,
    'Remise : entre 8h et 18h — horaire à fixer après validation',
    `Mode de remise : ${handoff}`,
    `Commune : ${commune}`,
    `Adresse : ${address || 'non applicable'}`,
    `Localisation / repère : ${landmark || 'non communiqué'}`,
    `Frais de remise : ${xpf(fee)}`,
    `Paiement : ${payment}`,
    `TOTAL : ${xpf(total)}`,
    '',
    `Nom : ${lastName}`,
    `Prénom : ${firstName}`,
    `E-mail : ${email}`,
    `Mobile : ${mobile}`,
    '',
    'CGS Location acceptées : oui',
    'Paiement en ligne : non',
    'Caution : non',
    'Disponibilité : à confirmer manuellement',
  ];

  const plain = lines.join('\n');
  const html = `
    <h2>Nouvelle demande de location Pacific Rent&amp;Clean</h2>
    <h3>Récapitulatif</h3>
    <p><strong>Forfait :</strong> ${escapeHtml(selectedPackage.label)} — ${xpf(selectedPackage.price)}</p>
    <p><strong>Date demandée :</strong> ${escapeHtml(date)}</p>
    <p><strong>Remise :</strong> ${escapeHtml(handoff)} · entre 8h et 18h · horaire à fixer après validation</p>
    <p><strong>Commune :</strong> ${escapeHtml(commune)}</p>
    <p><strong>Adresse :</strong> ${escapeHtml(address || 'non applicable')}</p>
    <p><strong>Localisation / repère :</strong> ${escapeHtml(landmark || 'non communiqué')}</p>
    <p><strong>Frais de remise :</strong> ${xpf(fee)}</p>
    <p><strong>Paiement :</strong> ${escapeHtml(payment)}</p>
    <p><strong>Total :</strong> ${xpf(total)}</p>
    <hr>
    <h3>Client</h3>
    <p><strong>Nom :</strong> ${escapeHtml(lastName)}</p>
    <p><strong>Prénom :</strong> ${escapeHtml(firstName)}</p>
    <p><strong>E-mail :</strong> ${escapeHtml(email)}</p>
    <p><strong>Mobile :</strong> ${escapeHtml(mobile)}</p>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `Pacific Rent&Clean · Location ${selectedPackage.label} · ${date} · ${lastName}`,
        text: plain,
        html,
      }),
    });

    if (!response.ok) {
      return json(res, 502, { ok: false, message: 'L’envoi n’a pas abouti. Merci de réessayer.' });
    }

    return json(res, 200, { ok: true });
  } catch {
    return json(res, 502, { ok: false, message: 'L’envoi est momentanément indisponible.' });
  }
};
