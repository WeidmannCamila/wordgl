# WordGL

Juego web con 2 modos:

- Juego 1: tablero por letras (tipo Wordle adaptado).
- Juego 2: aproximacion por afinidad semantica dentro del universo GL.

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

## API disponible

- `GET /api/health`
- `GET /api/dictionary`
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
