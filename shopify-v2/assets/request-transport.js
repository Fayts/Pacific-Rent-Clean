'use strict';

// Reproduit les réponses JSON Vercel pour la recette, sans réseau ni stockage.
const requestTransport = (() => {
  const locationPackages = {
    standard: { label: 'Standard', price: 6390 },
    'auto-home': { label: 'Auto-Home', price: 7990 },
  };
  const handoffs = ['Livraison à domicile', 'Retrait à un point convenu'];
  const payments = ['Virement', 'Deblock', 'Espèces'];
  const subjects = ['Prestation', 'Location', 'Autre', 'Devis hors dimensions'];
  const email = value => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(String(value || '').trim());
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const validAge = payload => !payload.website && Number.isFinite(payload.formAgeMs) && payload.formAgeMs >= 3000;

  function validateContact(payload) {
    if (!text(payload.name) || /[\r\n]/.test(payload.name) || !email(payload.email) ||
        !subjects.includes(payload.subject) || String(payload.message || '').trim().length < 8) {
      throw new Error('Merci de vérifier le nom, l’e-mail, le sujet et le message.');
    }
    if (payload.subject === 'Devis hors dimensions' &&
        (!['Matelas', 'Canapé ou fauteuil', 'Tapis'].includes(payload.textile) || !text(payload.dimensions))) {
      throw new Error('Précisez le textile, ses dimensions et votre demande.');
    }
  }

  function validateLocation(payload) {
    const extraTablets = Number(payload.extraTablets);
    if (!Object.hasOwn(locationPackages, payload.package) || !locationDates.isAllowed(payload.date) ||
        !handoffs.includes(payload.handoff) || !prestationRules.travelFees.has(payload.commune) ||
        !text(payload.lastName) || !text(payload.firstName) || !email(payload.email) ||
        !text(payload.mobile) || !payments.includes(payload.payment) || payload.acceptedCgs !== 'on' ||
        !Number.isInteger(extraTablets) || extraTablets < 0 || extraTablets > 10) {
      throw new Error('Merci de vérifier les champs obligatoires.');
    }
    if (payload.handoff === handoffs[0] && !text(payload.address)) {
      throw new Error('Merci d’indiquer l’adresse de livraison.');
    }
  }

  function validatePrestation(payload) {
    if (!prestationRules.validDate(payload.date, payload.mode)) {
      throw new Error('Vérifiez la date souhaitée à Tahiti.');
    }
    const acceptedAt = new Date(payload.acceptedAt);
    if (payload.acceptedCgs !== 'prestations-2026-11-18' ||
        !Number.isFinite(acceptedAt.getTime()) || acceptedAt.toISOString() !== payload.acceptedAt) {
      throw new Error('Veuillez accepter les CGS Prestations.');
    }
    prestationRules.quote(payload.items, payload.mode, payload.commune);
    const required = ['name', 'email', 'mobile', 'address'];
    if (payload.commune === 'Autre commune') required.push('otherCommune');
    if (required.some(key => !text(payload[key]) || payload[key].length > 500 || /[\r\n]/.test(payload[key]))) {
      throw new Error('Vérifiez les coordonnées et l’adresse d’intervention.');
    }
    if (!email(payload.email)) throw new Error('Vérifiez votre adresse e-mail.');
    if (!/^[a-f0-9-]{36}$/i.test(payload.requestId || '')) throw new Error('Rechargez la page puis réessayez.');
  }

  async function post(path, payload) {
    if (!validAge(payload)) throw new Error('Patientez quelques secondes puis réessayez.');
    switch (path) {
      case '/api/contact':
        validateContact(payload);
        break;
      case '/api/location':
        validateLocation(payload);
        break;
      case '/api/prestation':
        validatePrestation(payload);
        if (payload.prepareConsent === true) {
          return { ok: true, stamp: { utc: new Date().toISOString(), signature: 'simulation' } };
        }
        if (payload.stamp?.signature !== 'simulation') {
          throw new Error('Horodatage invalide. Rechargez le formulaire.');
        }
        break;
      default:
        throw new Error('Formulaire inconnu.');
    }
    return { ok: true, emailId: 'simulation' };
  }

  return { post, locationPackages };
})();
