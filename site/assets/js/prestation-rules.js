'use strict';

// Les mêmes références et règles alimentent le panier et la fonction serveur.
const prestationRules = (() => {
  const calendar = typeof module === 'undefined' ? locationDates : require('./location-dates');
  const catalog = [
    ['matelas-1', 'matelas', 'Matelas 1 place (90x190)', 5000],
    ['matelas-double', 'matelas', 'Matelas double (140x190)', 10000],
    ['matelas-queen', 'matelas', 'Matelas queen (160x200)', 11000],
    ['matelas-king', 'matelas', 'Matelas king (180x200)', 12000],
    ['fauteuil', 'canapes', 'Fauteuil', 5000],
    ['canape-2', 'canapes', 'Canapé 2 places', 10000],
    ['canape-3', 'canapes', 'Canapé 3 places', 12000],
    ['canape-angle', 'canapes', 'Canapé d’angle', 15000],
    ['canape-clic-clac', 'canapes', 'Canapé clic clac', 20000],
    ['tapis-petit', 'tapis', 'Tapis petit (80x150)', 2000],
    ['tapis-moyen', 'tapis', 'Tapis moyen (160x230)', 4000],
    ['tapis-grand', 'tapis', 'Tapis grand (240x330)', 6000],
  ].map(([id, category, label, price]) => ({ id, category, label, price }));
  const travelFees = new Map([
    ['Papeete', 0], ['Pirae', 0], ['Arue', 0], ['Mahina', 0],
    ['Faa’a', 1500], ['Papenoo', 1500], ['Autre commune', 2500],
  ]);
  function dateRange(mode, now = new Date()) {
    const standard = calendar.minimumDate(now);
    if (mode === 'standard') return { min: standard, max: '' };
    if (mode !== 'urgent') throw new Error('Choisissez le délai souhaité.');
    const tomorrow = new Date(standard + 'T00:00:00Z');
    tomorrow.setUTCDate(tomorrow.getUTCDate() - 1);
    const date = tomorrow.toISOString().slice(0, 10);
    return { min: date, max: date };
  }
  function validDate(value, mode, now = new Date()) {
    if (mode === 'standard') return calendar.isAllowed(value, now);
    return mode === 'urgent' && value === dateRange(mode, now).min;
  }
  function quote(items, mode, commune) {
    if (!Array.isArray(items) || !items.length) throw new Error('Ajoutez au moins un article.');
    if (!travelFees.has(commune)) throw new Error('Sélectionnez la commune.');
    if (mode !== 'urgent' && mode !== 'standard') throw new Error('Choisissez le délai souhaité.');
    const lines = items.map(item => {
      const product = catalog.find(p => p.id === item?.id);
      if (!product || !Number.isSafeInteger(item.quantity) || item.quantity < 1)
        throw new Error('Vérifiez les articles et leurs quantités.');
      return { ...product, quantity: item.quantity, amount: product.price * item.quantity };
    });
    const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
    const urgent = mode === 'urgent' ? 1500 : 0;
    const travel = travelFees.get(commune);
    const total = subtotal + urgent + travel;
    if (!Number.isSafeInteger(total)) throw new Error('Quantité trop élevée.');
    return { lines, subtotal, urgent, travel, total };
  }
  const money = amount => amount.toLocaleString('fr-FR') + ' XPF';
  return { catalog, travelFees, dateRange, validDate, quote, money };
})();
if (typeof module !== 'undefined') module.exports = prestationRules;
