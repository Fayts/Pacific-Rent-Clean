const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'pacificrentclean@gmail.com';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Pacific Rent&Clean <onboarding@resend.dev>';
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const SUBJECTS = new Set(['Prestation', 'Location', 'Autre', 'Devis hors dimensions']);

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function clean(value, max = 1200) {
  return String(value || '').replace(/[<>]/g, '').replace(/\s+$/g, '').slice(0, max);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
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
    return json(res, 400, { ok: false, message: 'Message illisible.' });
  }

  const honeypot = clean(data.website, 200);
  const loadedAt = Number(data.loadedAt || 0);
  const ageMs = Date.now() - loadedAt;
  const isQuote = data.subject === 'Devis hors dimensions';
  if (isQuote && (honeypot || !Number.isFinite(data.formAgeMs) || data.formAgeMs < 3000))
    return json(res, 400, { ok: false, message: 'Patientez quelques secondes puis réessayez.' });
  if (!isQuote && (honeypot || !loadedAt || ageMs < 3000)) {
    return json(res, 200, { ok: true });
  }

  const name = clean(data.name, 120);
  const email = clean(data.email, 160).trim();
  const phone = clean(data.phone, 80);
  const subject = clean(data.subject, 40);
  let message = clean(data.message, 2400);
  if (isQuote) {
    const dimensions = clean(data.dimensions, 100).trim();
    if (!['Matelas', 'Canapé ou fauteuil', 'Tapis'].includes(data.textile) || !dimensions || message.trim().length < 8)
      return json(res, 400, { ok: false, message: 'Précisez le textile, ses dimensions et votre demande.' });
    message = [`Textile : ${data.textile}`, `Dimensions (cm) : ${dimensions}`, `Description : ${message}`].join('\n');
  }

  if (!name || !isEmail(email) || !SUBJECTS.has(subject) || !message || message.length < 8) {
    return json(res, 400, { ok: false, message: 'Merci de vérifier le nom, l’e-mail, le sujet et le message.' });
  }

  const plain = [
    'Nouvelle demande depuis pacific-rent-clean-v2-preview.vercel.app',
    '',
    `Nom : ${name}`,
    `E-mail : ${email}`,
    `Téléphone : ${phone || 'non communiqué'}`,
    `Sujet : ${subject}`,
    '',
    'Message :',
    message,
  ].join('\n');

  const html = `
    <h2>Nouvelle demande Pacific Rent&amp;Clean</h2>
    <p><strong>Nom :</strong> ${name}</p>
    <p><strong>E-mail :</strong> ${email}</p>
    <p><strong>Téléphone :</strong> ${phone || 'non communiqué'}</p>
    <p><strong>Sujet :</strong> ${subject}</p>
    <hr>
    <p>${message.replace(/\n/g, '<br>')}</p>
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
        subject: `Pacific Rent&Clean · ${subject} · ${name}`,
        text: plain,
        html,
      }),
    });

    if (!response.ok) {
      return json(res, 502, { ok: false, message: 'L’envoi n’a pas abouti. Merci de réessayer.' });
    }

    if (isQuote) {
      const receipt = await response.json();
      if (typeof receipt?.id !== 'string' || !receipt.id.trim())
        return json(res, 502, { ok: false, message: 'L’envoi du devis n’a pas été confirmé.' });
      return json(res, 200, { ok: true, emailId: receipt.id });
    }
    return json(res, 200, { ok: true });
  } catch {
    return json(res, 502, { ok: false, message: 'L’envoi est momentanément indisponible.' });
  }
}
