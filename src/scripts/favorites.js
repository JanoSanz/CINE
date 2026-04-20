import { get, set } from './storage.js';

const KEY = 'favoritos';

export function getFavorites() {
  return get(KEY, []);
}

export function isFavorite(movieId) {
  return getFavorites().some((m) => Number(m.id) === Number(movieId));
}

export function addFavorite(movie) {
  const current = getFavorites();
  if (current.some((m) => Number(m.id) === Number(movie.id))) return current;
  const next = [...current, {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average
  }];
  set(KEY, next);
  return next;
}

export function removeFavorite(movieId) {
  const next = getFavorites().filter((m) => Number(m.id) !== Number(movieId));
  set(KEY, next);
  return next;
}

export function toggleFavorite(movie) {
  return isFavorite(movie.id) ? removeFavorite(movie.id) : addFavorite(movie);
}