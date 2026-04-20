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
- Geolocalizacion opcional con ordenamiento por cercania (formula de Haversine)
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

### Vercel

1. Conectar el repo en [vercel.com](https://vercel.com).
2. En Settings > Environment Variables agregar `PUBLIC_TMDB_API_KEY`.
3. Deploy automatico en cada push a `main`.

### Netlify

1. Conectar el repo en [netlify.com](https://netlify.com).
2. Build command: `npm run build` | Publish directory: `dist`.
3. Agregar `PUBLIC_TMDB_API_KEY` en Environment variables.

## Roadmap

- [x] MVP: busqueda, detalle, cines, horarios, favoritos
- [x] Geolocalizacion con ordenamiento por cercania
- [x] Persistencia con localStorage
- [x] Pagina 404 personalizada
- [ ] Filtros avanzados (genero, formato, idioma, precio)
- [ ] Mapa embebido con Leaflet
- [ ] Tema claro / oscuro
- [ ] Proxy de TMDB con Vercel Serverless Functions (ocultar API key)
- [ ] Migracion del JSON de cines a Supabase
- [ ] Tests con Vitest

## Licencia

MIT

## Autor

Tu nombre aca.