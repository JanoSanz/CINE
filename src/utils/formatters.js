export function formatYear(dateString) {
  if (!dateString) return '';
  return String(dateString).slice(0, 4);
}

export function formatRuntime(minutes) {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function formatRating(vote) {
  if (vote == null) return '';
  return Number(vote).toFixed(1);
}

export function formatPrice(value, currency = 'ARS') {
  if (value == null) return '';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDistance(km) {
  if (km == null) return '';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}