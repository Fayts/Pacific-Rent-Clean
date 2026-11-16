const { createHash, createHmac } = require('node:crypto');
const { quote, validDate, money } = require('../assets/js/prestation-rules');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  let data, details, prices;
  try {
    data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!data || data.website || !Number.isFinite(data.formAgeMs) || data.formAgeMs < 3000)
      throw new Error('Patientez quelques secondes puis réessayez.');
    if (!validDate(data.date, data.mode)) throw new Error('Vérifiez la date souhaitée à Tahiti.');
    const instant = new Date(data.acceptedAt);
    if (data.acceptedCgs !== 'prestations-2026-11-16' || !Number.isFinite(instant.getTime()) ||
        instant.toISOString() !== data.acceptedAt) throw new Error('Veuillez accepter les CGS Prestations.');
    prices = quote(data.items, data.mode, data.commune);
    const required = ['name', 'email', 'mobile', 'address'];
    if (data.commune === 'Autre commune') required.push('otherCommune');
    details = {};
    for (const key of required) {
      const value = data[key];
      if (typeof value !== 'string' || !value.trim() || value.length > 500 || /[\r\n]/.test(value))
        throw new Error('Vérifiez les coordonnées et l’adresse d’intervention.');
      details[key] = value.trim();
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) throw new Error('Vérifiez votre adresse e-mail.');
    if (!/^[a-f0-9-]{36}$/i.test(data.requestId || '')) throw new Error('Rechargez la page puis réessayez.');
  } catch (error) {
    return res.status(400).json({ ok: false, message: error instanceof SyntaxError ? 'Demande illisible.' : error.message });
  }
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ ok: false, message: 'Le service e-mail est indisponible.' });
  // La preuve signée conserve l'heure de première réception lors d'un renvoi du formulaire.
  const signTime = utc => createHmac('sha256', process.env.RESEND_API_KEY)
    .update(JSON.stringify(['prestations-cgs', data.requestId, data.acceptedCgs, data.acceptedAt, utc]))
    .digest('base64url');
  let receivedAt = new Date().toISOString();
  if (data.prepareConsent === true) {
    return res.status(200).json({ ok: true, stamp: { utc: receivedAt, signature: signTime(receivedAt) } });
  }
  if (data.stamp !== undefined) {
    if (typeof data.stamp?.utc !== 'string' || data.stamp.signature !== signTime(data.stamp.utc))
      return res.status(400).json({ ok: false, message: 'Horodatage invalide. Rechargez le formulaire.' });
    receivedAt = data.stamp.utc;
  }
  const text = [
    'Demande de prestation à valider manuellement',
    'Date souhaitée : ' + data.date + (data.mode === 'urgent' ? ' — Urgent, sous réserve d’acceptation' : ' — Standard'),
    ...prices.lines.map(line => line.quantity + ' × ' + line.label + ' à ' + money(line.price) + ' = ' + money(line.amount)),
    'Articles : ' + money(prices.subtotal), 'Urgence : ' + money(prices.urgent),
    'Déplacement : ' + money(prices.travel), 'Total : ' + money(prices.total),
    'CGS Prestations acceptées — version du 16/11/2026.',
    'Case cochée le ' + data.acceptedAt + ' (UTC, heure du navigateur).',
    details.name, details.email, details.mobile, details.address, details.otherCommune || data.commune,
  ].join('\n');
  const message = {
    from: process.env.CONTACT_FROM_EMAIL || 'Pacific Rent&Clean <onboarding@resend.dev>',
    to: [process.env.CONTACT_TO_EMAIL || 'pacificrentclean@gmail.com'],
    reply_to: details.email, subject: 'Pacific Rent&Clean · Prestation · ' + data.date + ' · ' + details.name,
    text,
  };
  // Une nouvelle tentative du même panier ne doit pas envoyer un second courriel.
  const key = createHash('sha256').update(data.requestId + JSON.stringify(message)).digest('hex');
  message.text += '\nAcceptation reçue par le serveur (UTC) : ' + receivedAt;
  const body = JSON.stringify(message);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', body, headers: { 'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Idempotency-Key': key },
    });
    const receipt = await response.json();
    if (!response.ok || typeof receipt?.id !== 'string' || !receipt.id.trim()) throw new Error();
    return res.status(200).json({ ok: true, emailId: receipt.id });
  } catch {
    return res.status(502).json({ ok: false, message: 'L’envoi n’a pas été confirmé. Réessayez dans un instant.' });
  }
};
