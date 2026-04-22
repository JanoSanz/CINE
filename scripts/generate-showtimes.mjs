// scripts/generate-showtimes.mjs
// Genera public/data/funciones.json a partir del cines.json existente.
// Asigna a cada cine entre 3 y 5 peliculas (de la lista curada) y, para cada
// una, entre 1 y 2 funciones con formato / idioma / horarios / precio random
// pero coherentes con un cine real.
//
// Uso:
//   npm run generate-showtimes

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CINES_PATH = resolve(__dirname, '..', 'public', 'data', 'cines.json');
const FUNC_PATH = resolve(__dirname, '..', 'public', 'data', 'funciones.json');

// Peliculas curadas (IDs reales de TMDB). Mezcla de estrenos + clasicos que
// siempre tienen poster y backdrop disponibles.
const PELICULAS = [
  872585,  // Oppenheimer
  346698,  // Barbie
  787699,  // Wonka
  27205,   // Inception
  155,     // The Dark Knight
  157336,  // Interstellar
  299536,  // Avengers: Infinity War
  438631,  // Dune
  550,     // Fight Club
  680      // Pulp Fiction
];

const FORMATOS = [
  { value: '2D', weight: 6 },
  { value: '3D', weight: 2 },
  { value: 'IMAX', weight: 1 }
];

const IDIOMAS = [
  { value: 'Subtitulada', weight: 3 },
  { value: 'Doblada', weight: 2 }
];

const HORARIOS_POOL = [
  '13:00', '14:30', '15:45', '17:00', '18:15',
  '19:30', '20:45', '22:00', '22:45', '23:30'
];

const FECHA = new Date().toISOString().slice(0, 10);

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted(items) {
  const total = items.reduce((acc, it) => acc + it.weight, 0);
  let r = Math.random() * total;
  for (const it of items) {
    if ((r -= it.weight) <= 0) return it.value;
  }
  return items[items.length - 1].value;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function priceFor(formato) {
  // Precios coherentes: IMAX > 3D > 2D.
  const base = { '2D': 3500, '3D': 4500, 'IMAX': 5500 }[formato] ?? 3500;
  return base + rand(0, 4) * 100;
}

function makeHorarios() {
  const count = rand(3, 5);
  return shuffle(HORARIOS_POOL).slice(0, count).sort();
}

function makeId(index) {
  return `fn-${String(index + 1).padStart(3, '0')}`;
}

async function main() {
  const cinesRaw = JSON.parse(await readFile(CINES_PATH, 'utf8'));
  const cines = Array.isArray(cinesRaw.cines) ? cinesRaw.cines : [];
  if (!cines.length) {
    throw new Error('cines.json esta vacio. Corre `npm run fetch-cinemas` primero.');
  }

  const funciones = [];
  let idx = 0;

  for (const cine of cines) {
    const cantPelis = rand(3, 5);
    const pelisDelCine = shuffle(PELICULAS).slice(0, cantPelis);

    for (const peliId of pelisDelCine) {
      const cantFunciones = rand(1, 2);
      for (let k = 0; k < cantFunciones; k++) {
        const formato = pickWeighted(FORMATOS);
        const idioma = pickWeighted(IDIOMAS);
        funciones.push({
          id: makeId(idx++),
          cineId: cine.id,
          peliculaId: peliId,
          fecha: FECHA,
          horarios: makeHorarios(),
          formato,
          idioma,
          precio: priceFor(formato)
        });
      }
    }
  }

  await writeFile(FUNC_PATH, JSON.stringify({ funciones }, null, 2) + '\n', 'utf8');
  console.log(`✓ Escritas ${funciones.length} funciones para ${cines.length} cines en public/data/funciones.json`);
}

main().catch((err) => {
  console.error('✗ generate-showtimes fallo:', err.message);
  process.exit(1);
});
