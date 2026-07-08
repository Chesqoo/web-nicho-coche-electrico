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

## Clonar para un nicho nuevo — checklist completo

Copia esta carpeta entera a otra ubicación (o crea un repo nuevo a partir de ella) y sigue
estos pasos en orden. ~30-45 min por web, la mayor parte esperando a que Google apruebe cosas.

### 1. Config del sitio — `src/consts.ts`

Es el único fichero de código que hace falta tocar para casi todo lo demás. Campos de `SITE`:

| Campo | Qué es |
|---|---|
| `nombre` | Nombre de la marca/sitio |
| `descripcion` | Frase que resume el sitio (meta description por defecto, hero, `/sobre/`) |
| `idioma` | Código de idioma (`es`) |
| `tituloHome` | `<title>` de la portada — debe llevar las keywords principales del nicho, no solo el nombre |
| `eyebrow` | Etiqueta pequeña sobre el titular del hero |
| `heroTitulo` | Titular del hero (admite `<em>` para resaltar una parte) |
| `textoCta` | Texto del enlace de cada tarjeta de artículo |
| `footerFrase` | Frase de cierre del footer — dale voz propia, no texto legal genérico |
| `adsenseClient` | `ca-pub-XXXXXXXXXXXXXXXX` de AdSense. Vacío (`''`) = sin anuncios |
| `analyticsId` | `G-XXXXXXXXXX` de Google Analytics 4. Vacío = sin script de medición |
| `searchConsoleId` | Token de verificación de Search Console. Vacío = sin meta de verificación |

Y el array `CATEGORIAS`: cambia `id` / `nombre` / `descripcion` de cada categoría del nicho
nuevo (el primer tag de cada artículo debe coincidir con el `id` de su categoría — crea
automáticamente su página `/categoria/<id>/` y su enlace en el menú).

### 2. Dominio — `astro.config.mjs`

Cambia `site: 'https://tu-dominio.com'`. De aquí se derivan automáticamente el sitemap,
`robots.txt` y las URLs canónicas/OG — no hay que tocar nada más para eso.

### 3. Identidad visual — `public/favicon.svg` y `public/og-default.svg`

Estos dos SVG llevan el monograma y el nombre grabados a mano (no se generan desde
`consts.ts`). Pide a Claude que los regenere con la inicial y el nombre del nuevo sitio, o
edítalos tú a mano: son SVG simples, sin gradientes ni radios de más de 8px (ver las reglas
anti-slop documentadas en el `:root` de `src/layouts/Base.astro`).

### 4. Manual editorial — `docs/`

Copia `docs/MANUAL-REDACCION-GENERICO.md` → `docs/MANUAL-REDACCION.md` y rellena el bloque
`CONFIG` del principio con los datos del nicho nuevo (tono, público, límites). Es el fichero
que debe seguir cualquier IA (incluido tú) al escribir o revisar artículos de esta web.

### 5. Contenido — `src/content/blog/`

Borra los artículos del nicho anterior (son de ejemplo, específicos de esa web) y genera los
nuevos — ver [Generar artículos](#generar-artículos) más abajo. Cada uno se crea con
`draft: true`: revísalo, asígnale el tag de categoría correcto y cambia a `draft: false` para
publicarlo.

### 6. Repo y despliegue en Cloudflare Pages

```bash
git init && git add . && git commit -m "inicial"
git remote add origin https://github.com/TUUSUARIO/tu-web-nueva.git
git push -u origin main
```

Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git** → elige el repo.
Framework preset: **Astro**, build: `npm run build`, output: `dist` → Deploy.

Compra el dominio (en Cloudflare Registrar sale a precio de coste) y asígnalo en
Pages → Custom domains.

A partir de aquí, **cada `git push` publica automáticamente**.

### 7. Analítica: Google Analytics 4

1. [analytics.google.com](https://analytics.google.com) → Admin (icono de engranaje) → elige
   o crea la cuenta → **Crear propiedad**. Nombre del sitio, zona horaria, moneda.
2. Sigue el asistente y crea un **flujo de datos → Web** con la URL del dominio nuevo.
3. Copia el **ID de medición** (`G-XXXXXXXXXX`) que te da y pégalo en `SITE.analyticsId`.
4. Verifica en Analytics → Informes → **Tiempo real** que te ves a ti mismo al visitar la web.

### 8. Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console) → Añadir
   propiedad → tipo **"Prefijo de URL"** con tu dominio.
2. Método de verificación **"Etiqueta HTML"** → copia el valor de `content="..."` que te da.
3. Pégalo en `SITE.searchConsoleId`, haz build/deploy, y vuelve a Search Console a pulsar
   **Verificar**.
4. Una vez verificado: **Sitemaps** → envía `sitemap-index.xml`.

### 9. AdSense

1. Ten 15-30 artículos publicados y revisados (2-4 semanas de contenido).
2. Solicita AdSense en [adsense.google.com](https://adsense.google.com) con tu dominio nuevo.
3. Cuando te aprueben, pon tu `ca-pub-XXXX` en `SITE.adsenseClient` — los anuncios **y**
   `ads.txt` se activan solos (`ads.txt` se genera desde ese mismo campo; no hay fichero que
   editar a mano).
4. Activa el mensaje de consentimiento GDPR: AdSense → Privacidad y mensajería → GDPR (es el
   CMP de Google, no hay que instalar nada).
5. Crea bloques de anuncio en AdSense si quieres slots manuales y pasa el `slot` a
   `<AdSlot slot="123..." />` (por defecto usa formato automático).

## Generar artículos

> **Manuales editoriales**: antes de generar o revisar artículos, lee
> [docs/MANUAL-REDACCION.md](docs/MANUAL-REDACCION.md) (procedimiento, voz, verificación
> de datos y checklist de publicación) — es el fichero del paso 4 de arriba, específico de
> esta web.

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
cambia a `draft: false`, y publica con `git push`.

## Estructura

```
src/consts.ts                ← config del sitio (única por web)
src/content/blog/*.md        ← artículos (draft: true = no publicado)
src/pages/                   ← portada, artículo, categorías, legales
src/pages/robots.txt.ts      ← generado desde astro.config.mjs (no editar a mano)
src/pages/ads.txt.ts         ← generado desde SITE.adsenseClient (no editar a mano)
src/pages/og/[...route].ts   ← una imagen OG por artículo, generada en build
public/favicon.svg           ← monograma — regenerar por nicho (paso 3)
public/og-default.svg        ← imagen OG de páginas no-artículo — regenerar por nicho (paso 3)
docs/MANUAL-REDACCION.md     ← manual editorial de ESTA web (paso 4, por nicho)
scripts/generar_articulo.py  ← keyword → borrador .md
```
