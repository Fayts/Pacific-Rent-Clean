'use strict';

const locationDates = (() => {
  const tahitiCalendar = new Intl.DateTimeFormat('en', {
    timeZone: 'Pacific/Tahiti', year: 'numeric', month: '2-digit', day: '2-digit',
  });

  function minimumDate(now = new Date()) {
    const parts = Object.fromEntries(tahitiCalendar.formatToParts(now).map(part => [part.type, part.value]));
    const minimum = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day) + 2));
    return minimum.toISOString().slice(0, 10);
  }

  function isAllowed(value, now = new Date()) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T00:00:00Z');
    return Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value && value >= minimumDate(now);
  }

  return { minimumDate, isAllowed };
})();

if (typeof module !== 'undefined') module.exports = locationDates;
