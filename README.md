# TBS B2B Platform

Aplicación React + Vite + Express para publicar como servicio Node.js.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre: http://localhost:3000

## Variables de entorno

Crea un archivo `.env` local con:

```env
GEMINI_API_KEY=tu_clave_de_gemini
```

No subas `.env` a GitHub.

## Despliegue en Render

1. Sube este proyecto a GitHub.
2. En Render, crea un Web Service conectado al repositorio.
3. Usa:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Agrega la variable de entorno `GEMINI_API_KEY`.

El archivo `render.yaml` también permite crear el servicio desde Blueprint.
