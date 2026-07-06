# HANDOFF — Eliminar el "efecto IA" de Vatios en Casa

**Para:** Claude Code
**Fecha:** 5 de julio de 2026
**Repo:** este mismo (web Astro estática, se despliega en Cloudflare Pages)

---

## 1. Contexto

Web de nicho en español sobre energía del hogar/autoconsumo ("Vatios en Casa"),
monetización por AdSense, contenido markdown en `src/content/blog/`.

Arquitectura intencional que NO debes romper:
- **Plug-and-play por nicho**: todo lo específico del tema vive en `src/consts.ts`
  (SITE, CATEGORIAS) + los `.md`. Los layouts/páginas son genéricos. Cualquier
  decisión de diseño nueva debe seguir siendo configurable o neutra respecto al nicho.
- Astro estático puro, sin frameworks de UI. Lighthouse ~95+. Debe seguir así.
- `draft: true` visible en dev, excluido en build. AdSense condicionado a
  `SITE.adsenseClient`. Sitemap, canonicals y JSON-LD ya existen.
- **El usuario ha hecho cambios recientes con Claude Code: AUDITA el estado real
  del repo antes de tocar nada; no asumas que coincide con esta descripción.**

## 2. Problema

La web "funciona" pero parece hecha con IA: genérica, intercambiable, sin
identidad. Eso mata la confianza del lector (peor CTR, peor E-E-A-T, peor
percepción para AdSense/Google). Objetivo: que parezca un medio editorial
pequeño y cuidado, hecho por una persona que sabe de energía.

## 3. Diagnóstico — "tells" de IA detectados (verifica cada uno en el repo)

Los catálogos de AI-slop de 2026 (referencias abajo) señalan exactamente lo que
esta web hace hoy:

1. **Tipografía Inter para todo** — "el tell nº 1"; Inter + sans de sistema sin
   más decisión tipográfica = diseño nunca estilizado intencionalmente.
2. **Grid de tarjetas uniformes** con radius grande, sombra al hover y chip
   píldora arriba — el patrón calcado de miles de sitios generados.
3. **Borde de color grueso a un lado** (los `h2` del artículo llevan
   `border-left` verde) — descrito literalmente como "el tell más reconocible
   de UI generada por IA".
4. **Fondo crema/beige-verdoso "tasteful"** como superficie por defecto.
5. **Gradiente decorativo** en el logo-mark.
6. **Microcopy genérico**: "Leer la guía →", hero-eslogan tipo plantilla,
   footer legal impersonal. Cero voz propia.
7. **Cero identidad humana**: sin página "Sobre", sin autor visible con cara y
   trayectoria, sin fotos propias, sin favicon ni imagen OG propia.
8. **Uniformidad total**: todas las tarjetas idénticas, ninguna jerarquía
   editorial (no hay "artículo destacado", no hay ritmo visual).

## 4. Cambios requeridos (por prioridad, con justificación)

### P1 — Tipografía con carácter
La palanca más rápida según todas las fuentes. Sustituir Inter por una pareja
editorial, p. ej. **titulares en serif con personalidad** (Fraunces, Newsreader
o Source Serif 4) + **cuerpo en sans humanista** (Public Sans, Figtree o
similar). Cárgalas con `font-display: swap` y preload; considera self-hosting
(@fontsource) para rendimiento. Ajusta pesos/tracking: los titulares serif
permiten tamaños menores con más presencia.

### P1 — Sistema de tokens anti-slop documentado
Crear `src/styles/tokens.css` (o sección clara en el CSS global) con reglas
duras y comentadas, para que futuros prompts a IA no regeneren slop:
- Paleta CAP: máx. 1 acento (verde actual ok) + neutros. Prohibidos gradientes
  decorativos y neon-on-dark.
- `border-radius` máximo 8px (hoy hay 16px, muy "AI 2025").
- Sombras: una sola, sutil, o ninguna — nada de glow.
- Quitar el `border-left` de los `h2` → usar jerarquía tipográfica real
  (tamaño/peso/espaciado) o un subrayado corto bajo el heading.
- Chips píldora → etiquetas de texto en small-caps con color de acento, sin
  fondo (más editorial, menos SaaS).

### P1 — Identidad humana (E-E-A-T + anti-IA a la vez)
- Página `/sobre/` con autor real (nombre, foto, por qué sabe de energía,
  metodología: "pruebo los cálculos con mi propia factura"). Datos desde
  `consts.ts` (`SITE.autor`, añade `SITE.autorBio`, `SITE.autorFoto`).
- Caja de autor al final de cada artículo (componente `AutorBox.astro`).
- Añadir el autor a la navegación del footer y al JSON-LD (ya existe `author`,
  enlázalo a `/sobre/` con `url`).
- Favicon propio + imagen OG por defecto (genera un SVG/PNG simple con el
  logotipo tipográfico, nada de emoji ⚡).

### P2 — Romper la uniformidad del layout
- Portada: el artículo más reciente (o uno marcado `destacado: true` en
  frontmatter — añádelo opcional al schema) se muestra grande arriba
  (layout horizontal, más ancho), el resto en grid. Ritmo editorial, no catálogo.
- Tarjetas: variar densidad (las de categoría pueden ser más compactas, tipo
  lista editorial con fecha a la izquierda).
- Hero de portada: menos eslogan, más utilidad — p. ej. enlazar las 3 categorías
  con una línea de descripción cada una (navegación real, no decoración).

### P2 — Voz en el microcopy
Reescribir todos los textos de interfaz con voz propia y concreta. Ejemplos de
dirección (adáptalos, no los copies literales):
- "Leer la guía →" → "Ver los números →" / "Cómo se calcula →"
- Footer: "Hecho en España por una persona a la que también le duele la factura."
- 404 y estados vacíos con personalidad.
El eslogan del hero está en `SITE.heroTitulo`: proponle al usuario 2-3
alternativas menos "plantilla de landing".

### P3 — Detalles que compran confianza
- Microinteracciones intencionales y discretas (transición de color en enlaces,
  underline animado en nav) — nada de hover "fantasma" genérico.
- "Actualizado el..." visible arriba en artículos con `updatedDate` (señal de
  mantenimiento humano).
- Prepara componente `<Figure>` con pie de foto para cuando el usuario aporte
  fotos reales (kit instalado, facturas anonimizadas). Las fotos propias son
  el anti-IA definitivo; pídeselas al usuario como TODO.

## 5. Restricciones

- No añadir frameworks (React, Tailwind, etc.). CSS plano en Astro.
- No degradar Lighthouse (fuentes self-hosted o preload; sin JS nuevo salvo el
  menú móvil existente).
- No romper URLs existentes ni el contrato `consts.ts` (solo AÑADIR campos).
- No tocar el contenido de los artículos `.md` (los borradores los revisa el
  usuario) — sí puedes tocar layouts, componentes, estilos y páginas.
- Mantener accesibilidad: contraste AA, focus visible, aria del menú móvil.

## 6. Criterios de aceptación

- [ ] `npm run build` sin errores y sin regresión Lighthouse (>90 en las 4 métricas).
- [ ] Cero Inter en el CSS final; pareja tipográfica nueva aplicada en toda la web.
- [ ] Sin gradientes decorativos, sin border-left en headings, radius ≤8px, chips rediseñados.
- [ ] Portada con jerarquía (destacado + grid), no catálogo uniforme.
- [ ] `/sobre/` + AutorBox + favicon + OG image funcionando.
- [ ] Microcopy reescrito (nav, CTAs, footer, 404).
- [ ] `consts.ts` sigue siendo el único fichero a editar para cambiar de nicho
      (los campos nuevos documentados con comentarios).
- [ ] Tokens anti-slop documentados en el propio CSS para futuros prompts.

## 7. Referencias (julio 2026)

- Catálogo de tells de AI-slop y fixes: https://www.925studios.co/blog/ai-slop-web-design-guide
- Los tells concretos (border-left, Inter, cream bg, gradientes): https://solodesign.cc/blog/ai-design-slop-the-tells/
- Por qué la UI generada es genérica y el enfoque "design system/tokens": https://vibecodekit.dev/ai-slop-design
- Enfoque de sistema de diseño para Claude: https://www.mindstudio.ai/blog/claude-design-avoid-ai-slop-design-system
- Tips de diseño para webs hechas con IA: https://unpromptable.substack.com/p/5-ai-website-design-tips-for-websites
- Cómo evitar contenido IA genérico (voz, especificidad): https://www.wix.com/blog/avoid-generic-ai-website-content
- Romper defaults y usar referencias/moodboard: https://www.visily.ai/blog/how-to-make-ai-designs-less-generic/

## 8. Orden de trabajo sugerido

1. Auditoría del estado actual (lee layouts, estilos y consts.ts reales).
2. P1 tipografía + tokens (mayor impacto visual inmediato).
3. P1 identidad (sobre, autor, favicon, OG).
4. P2 layout portada + tarjetas.
5. P2 microcopy.
6. P3 detalles.
7. Build + revisión de criterios de aceptación, uno a uno.

Haz commits pequeños por bloque (P1-tipografía, P1-identidad...) para que el
usuario pueda revertir piezas sueltas si algo no le convence.
