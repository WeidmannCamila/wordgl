# WordGL

Juego web con 2 modos:

- Juego 1: tablero por letras (tipo Wordle adaptado).
- Juego 2: aproximacion por afinidad semantica dentro del universo GL.
- Juego 3: ranking personal de series con busqueda e imagenes desde TMDB.

Ahora incluye backend liviano con API y base SQLite para guardar ranking entre usuarios sin cuenta.

## Ejecutar en local

1. Instala dependencias:

```bash
npm install
```

2. Inicia servidor:

```bash
npm start
```

3. Abre:

```text
http://localhost:3000/
```

## Configuracion TMDB (para Juego 3)

El Juego 3 usa la API de TMDB desde el backend (proxy) para no exponer la API key en el navegador.
Las imagenes y series se toman de la lista fija `list/8661015-gl` y se filtran por el texto que escriba la persona usuaria.

La forma recomendada es crear un archivo `.env` en la raiz del proyecto con este contenido:

```env
TMDB_API_KEY=tu_api_key_de_tmdb
TMDB_API_READ_ACCESS_TOKEN=tu_read_access_token_v4_opcional
```

Nota: para consultar listas (`/3/list/...`) TMDB puede exigir el token Bearer v4. Si ves `401 Authentication failed`, agrega `TMDB_API_READ_ACCESS_TOKEN`.

Luego ejecuta el servidor normalmente con:

```bash
npm start
```

Si prefieres, tambien puedes definir la variable solo para una sesion de terminal.

## API disponible

- `GET /api/health`
- `GET /api/dictionary`
- `GET /api/tmdb/tv/search?query=...`
- `GET /api/ranking/:gameId?limit=10`
- `POST /api/ranking/:gameId`

Body para guardar ranking:

```json
{
  "name": "TuNombre",
  "score": 420,
  "detail": "GAP en 2 intentos",
  "won": true
}
```

## Deploy recomendado (simple y barato)

Para este proyecto, recomiendo `Railway` o `Render` con 1 servicio Node.

- Ventaja: despliegue rapido de Express.
- Config minima: comando `npm start`.

Notas:

- El ranking se guarda en SQLite (`server/data/wordgl.db`).
- En hosts con filesystem efimero, usa volumen persistente o migra luego a Postgres/Supabase.

## Deploy en Vercel (gratis)

Si quieres publicar rapido en Vercel Hobby:

1. Sube este repo a GitHub.
2. En Vercel: `Add New Project` -> importa el repo.
3. Framework Preset: `Other`.
4. Build Command: vacio.
5. Output Directory: vacio.
6. Deploy.

Con esta configuracion, Vercel sirve el frontend estatico (`index.html`, `juego_1`, `juego_2`).

Importante sobre datos persistentes:

- Vercel gratis no es buena opcion para SQLite local persistente en serverless.
- El ranking funcionara en modo local del navegador (fallback), pero no compartido entre usuarios si no agregas DB externa.

Si quieres ranking compartido en Vercel, usa DB externa gratuita:

- Supabase (Postgres free)
- Neon (Postgres free)
- Turso (SQLite distribuida)

Luego apuntas los endpoints `/api/ranking` a esa DB.
