# Web de nicho — Astro + Cloudflare Pages + AdSense

Esqueleto listo para clonar por cada web que montes. Coste de hosting: 0 €.

## Requisitos (una sola vez en tu PC)

- [Node.js](https://nodejs.org) 18+ (LTS)
- Python 3 (para el script de generación)
- Git y una cuenta de GitHub
- Cuenta de [Cloudflare](https://dash.cloudflare.com) (gratis)

## Arranque local

```bash
cd web-nicho
npm install
npm run dev          # → http://localhost:4321
```

## Personalizar (5 minutos)

1. `src/consts.ts` → nombre del sitio, descripción.
2. `astro.config.mjs` → tu dominio real.
3. `public/robots.txt` → tu dominio real.

Las páginas legales (`aviso-legal`, `privacidad`, `cookies`) ya vienen con texto genérico que no
requiere datos personales ni correo de contacto — no hace falta rellenar nada salvo que quieras
identificarte explícitamente.

## Generar artículos

> **Manuales editoriales**: antes de generar o revisar artículos, lee
> [docs/MANUAL-REDACCION.md](docs/MANUAL-REDACCION.md) (procedimiento, voz, verificación
> de datos y checklist de publicación). Para clonar este esqueleto en otro nicho, usa la
> plantilla [docs/MANUAL-REDACCION-GENERICO.md](docs/MANUAL-REDACCION-GENERICO.md).


```bash
# Con API key de Anthropic (recomendado para automatizar):
export ANTHROPIC_API_KEY=sk-ant-...
python scripts/generar_articulo.py --keyword "mejores freidoras de aire 2026"

# Sin API key (usa tu suscripción de Claude, coste 0):
python scripts/generar_articulo.py --keyword "..."   # imprime el prompt
# pega el prompt en Claude, guarda la respuesta en respuesta.md y:
python scripts/generar_articulo.py --keyword "..." --desde-fichero respuesta.md
```

El borrador aparece en `src/content/blog/` con `draft: true`.
**Revísalo y edítalo** (verifica los `[VERIFICAR: ...]`, añade experiencia propia),
cambia a `draft: false`, y publica con git push.

## Desplegar en Cloudflare Pages (una vez, ~10 min)

1. Sube el proyecto a un repo de GitHub:
   ```bash
   git init && git add . && git commit -m "inicial"
   git remote add origin https://github.com/TUUSUARIO/tu-web.git
   git push -u origin main
   ```
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Elige el repo. Framework preset: **Astro**. Build: `npm run build`, output: `dist`. Deploy.
4. Compra el dominio (en Cloudflare Registrar sale a precio de coste) y asígnalo
   en Pages → Custom domains.

A partir de ahí, **cada `git push` publica automáticamente**.

## Checklist AdSense

1. Ten 15-30 artículos publicados y revisados (2-4 semanas de contenido).
2. Alta en [Google Search Console](https://search.google.com/search-console) y envía el sitemap (`/sitemap-index.xml`).
3. Solicita AdSense en [adsense.google.com](https://adsense.google.com) con tu dominio.
4. Cuando te aprueben:
   - Pon tu `ca-pub-XXXX` en `src/consts.ts` → los anuncios se activan solos.
   - Descomenta tu línea en `public/ads.txt`.
   - Activa el mensaje de consentimiento GDPR: AdSense → Privacidad y mensajería → GDPR (es el CMP de Google, no hay que instalar nada).
5. Crea bloques de anuncio en AdSense si quieres slots manuales y pasa el `slot` a `<AdSlot slot="123..." />` (por defecto usa formato automático).

## Estructura

```
src/consts.ts            ← config del sitio (única por web)
src/content/blog/*.md    ← artículos (draft: true = no publicado)
src/pages/               ← portada, artículo, legales
scripts/generar_articulo.py ← keyword → borrador .md
public/ads.txt           ← verificación AdSense
```

## Replicar para una nueva web

Copia la carpeta, cambia `consts.ts` + dominio, nuevo repo, conecta a Pages. ~30 min por web.
