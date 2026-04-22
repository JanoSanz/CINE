// src/scripts/api.js
// Cliente de TMDB. En desarrollo pega directo a la API con la key publica
// (PUBLIC_TMDB_API_KEY) para que `npm run dev` funcione sin infra extra.
// En produccion pega al proxy serverless /api/tmdb, que agrega la key desde
// el servidor (TMDB_API_KEY) y la mantiene fuera del cliente.

const DIRECT_KEY = import.meta.env.PUBLIC_TMDB_API_KEY;
const USE_PROXY = !import.meta.env.DEV;

const BASE_URL = 'https://api.themoviedb.org/3';
const PROXY_URL = '/api/tmdb';
const IMG_BASE = 'https://image.tmdb.org/t/p';
const LANG = 'es-AR';

async function request(path, params = {}) {
  const url = USE_PROXY
    ? buildProxyUrl(path, params)
    : buildDirectUrl(path, params);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error ${res.status} al consultar TMDB`);
  }
  return res.json();
}

function buildProxyUrl(path, params) {
  const url = new URL(PROXY_URL, window.location.origin);
  url.searchParams.set('path', path);
  for (const [key, value] of Object.entries(params)) {
    if (value != null) url.searchParams.set(key, value);
  }
  return url.toString();
}

function buildDirectUrl(path, params) {
  if (!DIRECT_KEY) {
    throw new Error('Falta PUBLIC_TMDB_API_KEY en .env para desarrollo local.');
  }
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', DIRECT_KEY);
  url.searchParams.set('language', LANG);
  for (const [key, value] of Object.entries(params)) {
    if (value != null) url.searchParams.set(key, value);
  }
  return url.toString();
}

export function searchMovies(query, page = 1) {
  return request('/search/movie', { query, page, include_adult: false });
}

export function getMovieDetails(id) {
  return request(`/movie/${id}`, { append_to_response: 'videos,credits' });
}

export function getTrending() {
  return request('/trending/movie/week');
}

export function getPosterUrl(path, size = 'w500') {
  if (!path) return '/img/no-poster.svg';
  return `${IMG_BASE}/${size}${path}`;
}

export function getBackdropUrl(path, size = 'w1280') {
  if (!path) return null;
  return `${IMG_BASE}/${size}${path}`;
}
