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

### Peliculas (TMDB)

Las peliculas se consumen en tiempo real desde la [API v3 de TMDB](https://developer.themoviedb.org/reference/intro/getting-started):

- `GET /trending/movie/week` — tendencias en la home
- `GET /search/movie` — busqueda por titulo
- `GET /movie/{id}` — detalle completo con videos y creditos

### Cines y funciones (JSON propio)

El dataset esta en `public/data/` con un schema pensado para migrarse facilmente a una API real:

```json
{
  "cines": [
    {
      "id": "cin-001",
      "nombre": "Hoyts Abasto",
      "ciudad": "Buenos Aires",
      "zona": "CABA",
      "direccion": "Av. Corrientes 3247",
      "coordenadas": { "lat": -34.6038, "lng": -58.4106 },
      "telefono": "+54 11 4959-3400",
      "salas": 12
    }
  ]
}
```

```json
{
  "funciones": [
    {
      "id": "fn-001",
      "cineId": "cin-001",
      "peliculaId": 872585,
      "fecha": "2026-04-20",
      "horarios": ["14:30", "17:15", "20:00", "22:45"],
      "formato": "2D",
      "idioma": "Subtitulada",
      "precio": 3500
    }
  ]
}
```

El `peliculaId` matchea el ID interno de TMDB, lo que permite cruzar ambas fuentes sin capas intermedias.

## Rutas

| Ruta | Proposito |
|---|---|
| `/` | Home con buscador y peliculas trending |
| `/buscar?q=titulo` | Resultados de busqueda |
| `/pelicula?id=872585` | Detalle + cines donde se proyecta |
| `/cines` | Listado completo de cines (filtrable por zona) |
| `/favoritos` | Peliculas guardadas en este dispositivo |
| `/404` | Pagina no encontrada |

Se usan **query strings** en vez de rutas dinamicas para mantener un build 100% estatico y desplegable en cualquier host.

## Deploy

### Vercel

1. Importar el repo en [vercel.com/new](https://vercel.com/new)
2. En **Settings > Environment Variables** agregar `PUBLIC_TMDB_API_KEY`
3. Deploy automatico en cada push a `main`

### Netlify

1. Conectar el repo en [app.netlify.com](https://app.netlify.com)
2. Build command: `npm run build` | Publish directory: `dist`
3. En **Site settings > Environment variables** agregar `PUBLIC_TMDB_API_KEY`

## Decisiones tecnicas

- **Astro en modo static**: optimo para una app mayormente de lectura. Cada pagina es HTML estatico con islas de JS solo donde hacen falta, lo que da mejor performance que una SPA full-JS.
- **Query strings en vez de rutas dinamicas**: mantiene el build 100% estatico, sin adapter, deploy-anywhere. Cambio de decision razonable si en v2 se migra a SSR.
- **JSON en `public/` en vez de endpoints**: permite fetch estandar en el cliente y facilita migrar a una API real reemplazando el URL base.
- **Sin frameworks de CSS**: los estilos estan en CSS vanilla con custom properties. Mantiene el bundle chico y demuestra conocimiento base sin apoyarse en utilidades.
- **`PUBLIC_` prefix en la env var**: TMDB v3 permite la key como query param, y dado que este proyecto es estatico sin backend, la key es necesariamente publica. Para un entorno productivo real, la recomendacion es proxyarla desde un serverless function (roadmap v2).

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

Hecho por [Jano Sanz](https://github.com/tu-usuario). Datos de peliculas provistos por [TMDB](https://www.themoviedb.org/). Este proyecto no esta avalado ni certificado por TMDB.
