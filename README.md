# CineCerca

Single Page Application para buscar peliculas y descubrir en que cines cercanos estan disponibles, con horarios, formato e idioma. Proyecto de portfolio construido con Astro y JavaScript vanilla.

![Astro](https://img.shields.io/badge/Astro-4.x-ff5d01?logo=astro&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572b6?logo=css3&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-Vercel%20%2F%20Netlify-000000)

## Demo

> No existe el link

## Descripcion

CineCerca resuelve una pregunta concreta: **"¿donde puedo ver esta pelicula hoy?"**. El usuario busca un titulo, ve el detalle de la pelicula (sinopsis, rating, duracion) y obtiene el listado de cines de su zona donde se proyecta, con sus horarios, formato (2D / 3D / IMAX) e idioma (subtitulada o doblada).

La app combina una fuente de datos real (TMDB) para la informacion de peliculas con un dataset propio en JSON para cines y funciones, pensado para que pueda migrarse a un endpoint real sin tocar la UI.

## Features

- Buscador de peliculas con envio a pagina de resultados
- Tendencias de la semana en la home
- Detalle de pelicula con backdrop, sinopsis y metadata
- Seleccion de zona persistente (CABA, Zona Norte, Sur, Oeste, Cordoba, Rosario)
- Listado de cines por pelicula con horarios, formato e idioma
- **Filtros dinamicos** por formato (2D / 3D / IMAX) e idioma (Subtitulada / Doblada)
- **Mapa interactivo** con Leaflet y markers por cine (tiles CartoDB que siguen el tema)
- Geolocalizacion opcional con ordenamiento por cercania (formula de Haversine)
- **Tema claro / oscuro** con persistencia y sin flash al cargar
- Favoritos persistidos en localStorage
- Pagina dedicada de cines y pagina de favoritos
- Manejo completo de estados: loading, error, empty y success
- Diseno responsive mobile-first
- Accesibilidad basica (labels, alt, contraste, focus visible)
- Pagina 404 personalizada

## Stack

| Tecnologia | Rol |
|---|---|
| **Astro** | Framework base, routing por archivos, componentes `.astro` |
| **JavaScript (ES6+)** | Logica de cliente, fetch, manipulacion del DOM |
| **HTML5 / CSS3** | Markup semantico y estilos sin frameworks |
| **Fetch API** | Llamadas a TMDB y a los JSON locales |
| **localStorage** | Persistencia de favoritos y zona seleccionada |
| **Geolocation API** | Ubicacion del usuario (opcional) |
| **Leaflet** | Mapa interactivo con markers (via CDN) |
| **TMDB API v3** | Datos reales de peliculas |
| **Vercel / Netlify** | Deploy con CI/CD desde GitHub |

## Instalacion

### Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Cuenta gratis en [TMDB](https://www.themoviedb.org/signup) para obtener una API key

### Pasos

```bash
# 1. Clonar el repo
git clone https://github.com/tu-usuario/cinecerca.git
cd cinecerca

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
```

Abri `.env` y pega tu API key de TMDB (la version v3, no el token v4):

```
PUBLIC_TMDB_API_KEY=tu_api_key_aqui
```

```bash
# 4. Correr en desarrollo
npm run dev
```

Abri [http://localhost:4321](http://localhost:4321).

### Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de produccion en `dist/` |
| `npm run preview` | Previsualizar el build localmente |
| `npm run fetch-cinemas` | Baja cines reales de OpenStreetMap (Overpass API) |
| `npm run generate-showtimes` | Genera funciones para los cines existentes |
| `npm run generate-data` | Corre los dos anteriores en orden |

### Regenerar el dataset de cines

El JSON de cines esta versionado para que la app funcione sin configuracion extra, pero se puede regenerar automaticamente desde OpenStreetMap:

```bash
npm run generate-data
```

Eso consulta la API de **Overpass** con `amenity=cinema` en Argentina, clasifica cada cine por zona (CABA / Zona Norte / Sur / Oeste / Cordoba / Rosario) y escribe `public/data/cines.json`. Despues, `generate-showtimes` asigna a cada cine entre 3 y 5 peliculas con horarios, formato, idioma y precio randomizados pero coherentes.

> No requiere API key ni dependencias: usa `fetch` nativo de Node 18+.

## Estructura del proyecto

```
cinecerca/
├── public/
│   ├── data/
│   │   ├── cines.json           # Dataset propio de cines
│   │   └── funciones.json       # Funciones por pelicula y cine
│   ├── img/
│   │   └── no-poster.svg        # Fallback cuando TMDB no tiene poster
│   └── favicon.svg
├── src/
│   ├── components/              # Componentes Astro reutilizables
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SearchBar.astro
│   │   ├── MovieCard.astro
│   │   ├── MovieGrid.astro
│   │   ├── CinemaCard.astro
│   │   ├── ShowtimeList.astro
│   │   ├── ZoneSelector.astro
│   │   ├── Loader.astro
│   │   ├── ErrorMessage.astro
│   │   └── EmptyState.astro
│   ├── layouts/
│   │   └── BaseLayout.astro     # Layout comun a todas las paginas
│   ├── pages/
│   │   ├── index.astro          # Home con buscador y tendencias
│   │   ├── buscar.astro         # Resultados de busqueda
│   │   ├── pelicula.astro       # Detalle + cines (via ?id=)
│   │   ├── cines.astro          # Listado de cines
│   │   ├── favoritos.astro      # Peliculas guardadas
│   │   └── 404.astro
│   ├── scripts/
│   │   ├── api.js               # Cliente de TMDB
│   │   ├── cinemas.js           # Carga y cruce de datos locales
│   │   ├── favorites.js         # CRUD de favoritos
│   │   ├── geolocation.js       # Geolocation + Haversine
│   │   └── storage.js           # Wrapper seguro de localStorage
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css        # Paleta, radius, shadows, spacing
│   └── utils/
│       ├── debounce.js
│       └── formatters.js        # Fechas, runtime, rating, distancia
├── astro.config.mjs
├── package.json
├── vercel.json
├── netlify.toml
└── README.md
```

## Datos

- **Peliculas:** se consumen desde la API de TMDB.
- **Cines y funciones:** estan mockeados en `public/data/cines.json` y `public/data/funciones.json` con un formato pensado para que manana se puedan reemplazar por un endpoint real sin cambiar la UI.

## Deploy

### Vercel (recomendado)

1. Conectar el repo en [vercel.com](https://vercel.com).
2. En **Settings > Environment Variables** agregar `TMDB_API_KEY` (sin prefijo `PUBLIC_`).
3. Deploy automatico en cada push a `main`.

En produccion el cliente no llama a TMDB directamente: pega a `/api/tmdb`, una **serverless function** definida en [api/tmdb.js](api/tmdb.js) que agrega la API key desde el servidor. Asi la key nunca viaja al browser. En desarrollo local (`npm run dev`) se usa `PUBLIC_TMDB_API_KEY` para evitar levantar el runtime de Vercel.

### Netlify

1. Conectar el repo en [netlify.com](https://netlify.com).
2. Build command: `npm run build` | Publish directory: `dist`.
3. Agregar `PUBLIC_TMDB_API_KEY` en Environment variables (Netlify Functions soporta el proxy, pero esta config usa la key publica para simplicidad).

## Roadmap

- [x] MVP: busqueda, detalle, cines, horarios, favoritos
- [x] Geolocalizacion con ordenamiento por cercania
- [x] Persistencia con localStorage
- [x] Pagina 404 personalizada
- [x] Filtros dinamicos (formato, idioma) en detalle de pelicula
- [x] Mapa embebido con Leaflet y tiles adaptativos al tema
- [x] Tema claro / oscuro con persistencia
- [x] Filtros extra en detalle (precio y franja horaria)
- [x] Proxy de TMDB con Vercel Serverless Functions (ocultar API key)
- [ ] Filtro de genero en resultados de busqueda
- [ ] Migracion del JSON de cines a Supabase
- [ ] Tests con Vitest

## Licencia

MIT

## Autor

Jano Lorenzo Sanz