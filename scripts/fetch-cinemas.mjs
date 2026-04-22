// scripts/fetch-cinemas.mjs
// Baja los cines de Argentina desde OpenStreetMap (Overpass API) y los
// escribe en public/data/cines.json usando el schema que consume la app.
//
// Uso:
//   npm run fetch-cinemas
//
// Sin dependencias externas (usa fetch nativo de Node 18+).

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '..', 'public', 'data', 'cines.json');

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter'
];

// Consulta: todos los amenity=cinema dentro de Argentina (ISO3166-1 AR).
// Pedimos nodes, ways y relations, y usamos "out center" para obtener coords
// de las geometrias no puntuales.
const QUERY = `
[out:json][timeout:90];
area["ISO3166-1"="AR"][admin_level=2]->.ar;
(
  node["amenity"="cinema"](area.ar);
  way["amenity"="cinema"](area.ar);
  relation["amenity"="cinema"](area.ar);
);
out center tags;
`.trim();

// Bounding box aproximado del AMBA / CABA para clasificar.
const CABA_BBOX = {
  minLat: -34.705, maxLat: -34.526,
  minLng: -58.531, maxLng: -58.335
};

const ZONA_NORTE = [
  'vicente lopez', 'san isidro', 'tigre', 'san fernando', 'pilar',
  'escobar', 'martinez', 'olivos', 'beccar', 'acassuso', 'san miguel',
  'general san martin', 'jose c. paz', 'malvinas argentinas', 'nordelta'
];
const ZONA_OESTE = [
  'moron', 'moreno', 'merlo', 'ituzaingo', 'hurlingham', 'la matanza',
  'tres de febrero', 'ramos mejia', 'castelar', 'san justo', 'ciudadela',
  'haedo', 'villa luzuriaga', 'caseros', 'el palomar'
];
const ZONA_SUR = [
  'avellaneda', 'lanus', 'lomas de zamora', 'quilmes', 'berazategui',
  'florencio varela', 'almirante brown', 'esteban echeverria', 'ezeiza',
  'adrogue', 'banfield', 'temperley', 'monte grande', 'wilde', 'sarandi'
];

function normalize(str = '') {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quitar tildes
    .trim();
}

function inBbox(lat, lng, bbox) {
  return lat >= bbox.minLat && lat <= bbox.maxLat
      && lng >= bbox.minLng && lng <= bbox.maxLng;
}

function matchAny(text, list) {
  const n = normalize(text);
  return list.some((term) => n.includes(term));
}

function classifyZone({ lat, lng, city, state }) {
  const c = normalize(city);
  const s = normalize(state);

  if (inBbox(lat, lng, CABA_BBOX) || c === 'buenos aires' || c === 'ciudad autonoma de buenos aires' || c === 'caba') {
    return 'CABA';
  }
  if (s.includes('cordoba')) return 'Cordoba';
  if (c === 'rosario' || s.includes('santa fe') && c === 'rosario') return 'Rosario';
  if (matchAny(city, ZONA_NORTE)) return 'Zona Norte';
  if (matchAny(city, ZONA_OESTE)) return 'Zona Oeste';
  if (matchAny(city, ZONA_SUR)) return 'Zona Sur';
  if (s.includes('buenos aires') && inBbox(lat, lng, CABA_BBOX)) return 'CABA';

  return null; // lo descartamos si no matchea ninguna zona soportada
}

function buildAddress(tags) {
  const street = tags['addr:street'];
  const number = tags['addr:housenumber'];
  if (street && number) return `${street} ${number}`;
  if (street) return street;
  return tags['addr:full'] || '';
}

function cityFromTags(tags) {
  return tags['addr:city']
      || tags['addr:suburb']
      || tags['addr:town']
      || tags['is_in:city']
      || '';
}

function stateFromTags(tags) {
  return tags['addr:state'] || tags['is_in:state'] || '';
}

function pickCoords(el) {
  if (typeof el.lat === 'number' && typeof el.lon === 'number') {
    return { lat: el.lat, lng: el.lon };
  }
  if (el.center && typeof el.center.lat === 'number') {
    return { lat: el.center.lat, lng: el.center.lon };
  }
  return null;
}

function makeId(index) {
  return `cin-${String(index + 1).padStart(3, '0')}`;
}

async function runQuery() {
  let lastErr = null;
  for (const url of OVERPASS_ENDPOINTS) {
    try {
      console.log(`→ Consultando ${url} ...`);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'User-Agent': 'CineCerca/0.1 (portfolio project; contact: janosanz04@gmail.com)'
        },
        body: `data=${encodeURIComponent(QUERY)}`
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const json = await res.json();
      return json;
    } catch (err) {
      console.warn(`  ✗ ${err.message}`);
      lastErr = err;
    }
  }
  throw lastErr || new Error('No pudimos conectarnos a ningun endpoint de Overpass.');
}

function dedupe(list) {
  const seen = new Set();
  const out = [];
  for (const c of list) {
    const key = `${normalize(c.nombre)}|${normalize(c.zona)}|${c.coordenadas.lat.toFixed(3)},${c.coordenadas.lng.toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

async function main() {
  const t0 = Date.now();
  const raw = await runQuery();
  const elements = Array.isArray(raw.elements) ? raw.elements : [];
  console.log(`✓ Overpass devolvio ${elements.length} elementos crudos.`);

  const parsed = [];
  for (const el of elements) {
    const tags = el.tags || {};
    const nombre = tags.name || tags['name:es'] || tags.brand;
    if (!nombre) continue;

    const coords = pickCoords(el);
    if (!coords) continue;

    const city = cityFromTags(tags);
    const state = stateFromTags(tags);
    const zona = classifyZone({ lat: coords.lat, lng: coords.lng, city, state });
    if (!zona) continue;

    parsed.push({
      nombre: nombre.trim(),
      ciudad: city.trim() || (zona === 'CABA' ? 'Buenos Aires' : zona),
      zona,
      direccion: buildAddress(tags),
      coordenadas: { lat: +coords.lat.toFixed(6), lng: +coords.lng.toFixed(6) },
      telefono: tags.phone || tags['contact:phone'] || '',
      salas: tags.screen ? Number(tags.screen) : null
    });
  }

  console.log(`✓ Cines clasificados en zonas soportadas: ${parsed.length}`);

  const unique = dedupe(parsed);
  console.log(`✓ Cines unicos tras dedupe: ${unique.length}`);

  // Reasignamos id e inferimos salas cuando falte (promedio razonable).
  const final = unique
    .sort((a, b) => a.zona.localeCompare(b.zona) || a.nombre.localeCompare(b.nombre))
    .map((c, i) => ({
      id: makeId(i),
      nombre: c.nombre,
      ciudad: c.ciudad,
      zona: c.zona,
      direccion: c.direccion,
      coordenadas: c.coordenadas,
      telefono: c.telefono,
      salas: c.salas ?? 6
    }));

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify({ cines: final }, null, 2) + '\n', 'utf8');

  const porZona = final.reduce((acc, c) => {
    acc[c.zona] = (acc[c.zona] || 0) + 1;
    return acc;
  }, {});

  console.log('\n📊 Cines por zona:');
  for (const [zona, count] of Object.entries(porZona)) {
    console.log(`  ${zona.padEnd(12)} ${count}`);
  }
  console.log(`\n✓ Escrito ${final.length} cines en public/data/cines.json`);
  console.log(`  (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

main().catch((err) => {
  console.error('✗ fetch-cinemas fallo:', err.message);
  process.exit(1);
});
