# CineCerca

SPA (Single Page Application) para buscar peliculas y ver en que cines cercanos de tu zona estan disponibles, con sus horarios y ubicacion.

## Demo

> Agrega aca el link de tu deploy cuando lo subas a Vercel o Netlify.

## Stack

- **Astro** - Framework base y routing
- **JavaScript (ES6+)** - Logica de cliente
- **HTML5 / CSS3** - Markup y estilos (mobile-first, sin frameworks)
- **Fetch API** - Llamadas a TMDB
- **localStorage** - Persistencia de favoritos y preferencias
- **Geolocation API** - Ubicacion opcional del usuario
- **TMDB API** - Datos reales de peliculas
- **Vercel / Netlify** - Deploy

## Features

- Buscador de peliculas con debounce
- Listado de resultados y detalle de cada pelicula
- Seleccion manual de zona o geolocalizacion automatica
- Listado de cines cercanos con horarios por pelicula
- Favoritos persistidos en localStorage
- Manejo completo de estados (loading, error, empty)
- Diseno responsive mobile-first
- Accesibilidad basica (labels, alt, contraste)

## Como correrlo localmente

### 1. Clonar el repo

```bash
git clone https://github.com/tu-usuario/cinecerca.git
cd cinecerca
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Despues editas `.env` y pegas tu API key de TMDB.
Para obtenerla: [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (gratis con cuenta).

### 4. Correr en dev

```bash
npm run dev
```

Abri [http://localhost:4321](http://localhost:4321).

### 5. Build de produccion

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```
cinecerca/
├── public/
│   └── data/              # JSON mockeado de cines y funciones
├── src/
│   ├── components/        # Componentes Astro reutilizables
│   ├── layouts/           # Layout base
│   ├── pages/             # Rutas de la app
│   ├── scripts/           # Logica de cliente (api, storage, etc.)
│   ├── styles/            # CSS global y variables
│   └── utils/             # Helpers (debounce, formatters)
├── astro.config.mjs
└── package.json
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

- [x] MVP: busqueda, detalle, cines, horarios
- [ ] Favoritos con localStorage
- [ ] Filtros (genero, formato, idioma)
- [ ] Geolocalizacion con calculo de distancia
- [ ] Mapa embebido con Leaflet
- [ ] Tema claro / oscuro

## Licencia

MIT.

## Autor

Tu nombre aca.