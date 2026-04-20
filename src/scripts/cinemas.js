let cachedCinemas = null;
let cachedShowtimes = null;

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`No se pudo cargar ${path}`);
  return res.json();
}

export async function getAllCinemas() {
  if (!cachedCinemas) {
    const data = await loadJson('/data/cines.json');
    cachedCinemas = data.cines;
  }
  return cachedCinemas;
}

export async function getAllShowtimes() {
  if (!cachedShowtimes) {
    const data = await loadJson('/data/funciones.json');
    cachedShowtimes = data.funciones;
  }
  return cachedShowtimes;
}

export async function getZones() {
  const cinemas = await getAllCinemas();
  const zones = new Set(cinemas.map((c) => c.zona));
  return Array.from(zones).sort();
}

export async function getCinemasByZone(zone) {
  const cinemas = await getAllCinemas();
  if (!zone) return cinemas;
  return cinemas.filter((c) => c.zona === zone);
}

export async function getShowtimesForMovie(movieId, zone) {
  const [cinemas, showtimes] = await Promise.all([
    getAllCinemas(),
    getAllShowtimes()
  ]);

  const cinemasByZone = zone
    ? cinemas.filter((c) => c.zona === zone)
    : cinemas;
  const cinemaIds = new Set(cinemasByZone.map((c) => c.id));

  const relevant = showtimes.filter(
    (f) => Number(f.peliculaId) === Number(movieId) && cinemaIds.has(f.cineId)
  );

  const byCinema = new Map();
  for (const fn of relevant) {
    if (!byCinema.has(fn.cineId)) byCinema.set(fn.cineId, []);
    byCinema.get(fn.cineId).push(fn);
  }

  return Array.from(byCinema.entries()).map(([cinemaId, funciones]) => ({
    cinema: cinemasByZone.find((c) => c.id === cinemaId),
    funciones
  }));
}