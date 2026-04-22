// api/tmdb.js
// Proxy serverless de TMDB para Vercel. Oculta la API key del lado del cliente.
//
// El cliente pega a:  /api/tmdb?path=/search/movie&query=batman&page=1
// y esta funcion agrega api_key + language antes de reenviar a TMDB.
//
// Whitelisteamos los paths permitidos para que nadie use nuestro proxy como
// gateway generico de TMDB.

const TMDB_BASE = 'https://api.themoviedb.org/3';
const DEFAULT_LANG = 'es-AR';

const ALLOWED_PATHS = [
  /^\/search\/movie$/,
  /^\/movie\/\d+$/,
  /^\/trending\/movie\/(day|week)$/,
  /^\/genre\/movie\/list$/
];

function isAllowed(path) {
  return ALLOWED_PATHS.some((re) => re.test(path));
}

export default async function handler(req, res) {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'TMDB_API_KEY no configurada en el servidor.' });
    }

    const { path, ...rest } = req.query || {};
    if (!path || typeof path !== 'string' || !path.startsWith('/')) {
      return res.status(400).json({ error: 'Parametro "path" requerido (ej: /search/movie).' });
    }
    if (!isAllowed(path)) {
      return res.status(403).json({ error: `Path no permitido: ${path}` });
    }

    const url = new URL(`${TMDB_BASE}${path}`);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('language', DEFAULT_LANG);
    for (const [k, v] of Object.entries(rest)) {
      if (v == null) continue;
      url.searchParams.set(k, Array.isArray(v) ? v[0] : String(v));
    }

    const upstream = await fetch(url.toString());
    const body = await upstream.text();

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    // Cache corto en el edge para reducir costos y latencia.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(upstream.status).send(body);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error en el proxy TMDB.' });
  }
}
