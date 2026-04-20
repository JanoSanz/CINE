const API_KEY = import.meta.env.PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';
const LANG = 'es-AR';

async function request(path, params = {}) {
  if (!API_KEY) {
    throw new Error('Falta PUBLIC_TMDB_API_KEY. Copia .env.example a .env y agrega tu API key de TMDB.');
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', LANG);
  for (const [key, value] of Object.entries(params)) {
    if (value != null) url.searchParams.set(key, value);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Error ${res.status} al consultar TMDB`);
  }
  return res.json();
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