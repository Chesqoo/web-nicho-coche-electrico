# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A reusable Astro template for spinning up single-topic ("nicho") content/SEO sites monetized with
AdSense, deployed for free on Cloudflare Pages. This specific instance is "Vatios en Casa" (Spanish,
energy/self-consumption/aerotermia niche). The intended workflow is to clone this whole folder for
each new niche site, edit `src/consts.ts` + the domain, and go.

The project and all content/UI copy are in **Spanish** — keep new UI strings, comments-facing content,
and article content in Spanish to match the existing site.

## Commands

```bash
npm run dev       # astro dev server → http://localhost:4321
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

`iniciar-web.bat` is a Windows double-click launcher: installs deps if `node_modules` is missing,
opens the browser, then runs `npm run dev`.

There is no lint/test/typecheck script configured in `package.json` — don't invent one; just run
`npm run build` to catch Astro/content-schema errors.

### Generating articles

```bash
# With an Anthropic API key (writes the .md file directly):
export ANTHROPIC_API_KEY=sk-ant-...
python scripts/generar_articulo.py --keyword "mejores freidoras de aire 2026"

# Without an API key (prints a prompt to paste into Claude manually):
python scripts/generar_articulo.py --keyword "..."
python scripts/generar_articulo.py --keyword "..." --desde-fichero respuesta.md
```

This creates a draft `.md` file in `src/content/blog/` with `draft: true` and empty `tags: []`.
Articles are never auto-published: a human must review `[VERIFICAR: ...]` markers the model leaves
for unverified facts/figures, assign the right category tag, and flip `draft` to `false`.

### Editorial manuals (REQUIRED reading before writing or editing articles)

- [docs/MANUAL-REDACCION.md](docs/MANUAL-REDACCION.md) — the editorial manual for THIS site
  (voice, structure, data-verification rules, SEO, frontmatter, pre-publish checklist).
  Any article written or edited by an AI must follow it; if a prompt conflicts with the
  manual, the manual wins.
- [docs/MANUAL-REDACCION-GENERICO.md](docs/MANUAL-REDACCION-GENERICO.md) — parameterizable
  template of the same manual, used when cloning this repo for a new niche (fill the CONFIG
  block and adapt MANUAL-REDACCION.md from it).

## Architecture

**Content model**: Blog posts are Markdown files in `src/content/blog/`, validated by the Zod schema
in [src/content.config.ts](src/content.config.ts) (`title`, `description`, `pubDate`, `updatedDate?`,
`tags`, `draft`, `destacado`). There is no separate "category" collection — categories are defined once in
`CATEGORIAS` in [src/consts.ts](src/consts.ts), and a post belongs to a category by having that
category's `id` as one of its `tags`. `categoriaDe(tags)` in consts.ts resolves a post's tags back to
its `Categoria` (first match wins — by convention the category tag should be listed first).
`destacado: true` makes a post the big featured item on the homepage (see Layout hierarchy below);
if no post has it, the most recent post is used instead.

**Site-wide config lives in one file**: [src/consts.ts](src/consts.ts) holds `SITE` (name,
description, hero copy, CTA/footer microcopy, AdSense/Analytics/Search Console IDs) and
`CATEGORIAS`. This is the file to edit when cloning the template for a new niche — along with the
domain in `astro.config.mjs`. New fields are additive and commented; keep it that way so consts.ts
stays the single file to touch per clone. Full per-clone checklist (including the non-code steps —
Cloudflare, GA4, Search Console, AdSense) lives in [README.md](README.md).

**No individual author identity, by design**: this site is framed as a publication/aggregator, not a
personal blog — there's intentionally no author name, bio, or photo anywhere (not in `consts.ts`, not
in JSON-LD, not on `/sobre/`). JSON-LD `author` in `[...slug].astro` is `Organization` (site name),
matching `publisher`. Don't reintroduce a named-person byline unless explicitly asked.

**Design tokens / anti-slop rules**: documented directly in the `:root` token comment at the top of
[src/layouts/Base.astro](src/layouts/Base.astro)'s `<style>` block — max one accent color, no
decorative gradients, `--radius` capped at 8px, at most one subtle shadow. Typography is self-hosted
via `@fontsource` (no Google Fonts CDN call): Fraunces (serif, `var(--serif)`) for all headings,
Public Sans (`var(--sans)`) for body text. When adding new components, reuse these variables instead
of hardcoding colors/radius/fonts.

**Layout hierarchy**: the homepage ([src/pages/index.astro](src/pages/index.astro)) is intentionally
not a uniform grid — it renders one featured post via
[src/components/FeaturedPost.astro](src/components/FeaturedPost.astro) above the regular
`PostCard` grid, plus a category quick-links block under the hero. Category pages
([src/pages/categoria/[cat].astro](src/pages/categoria/[cat].astro)) use a denser, list-style
[src/components/PostListItem.astro](src/components/PostListItem.astro) instead of the card grid.

**Draft visibility differs by environment**: every collection query
(`index.astro`, `categoria/[cat].astro`, `[...slug].astro`) filters posts with
`import.meta.env.PROD ? !data.draft : true` — drafts are visible in `npm run dev` but excluded from
production builds. Any new page listing posts must repeat this same filter.

**Routing**:
- `/` → [src/pages/index.astro](src/pages/index.astro) — hero + all posts grid.
- `/categoria/[cat]/` → [src/pages/categoria/[cat].astro](src/pages/categoria/[cat].astro) — one
  static page per entry in `CATEGORIAS`, filtered by tag.
- `/[slug]/` → [src/pages/[...slug].astro](src/pages/[...slug].astro) — individual article, includes
  Article JSON-LD structured data, breadcrumb, and `<AdSlot>` before/after content. Also parses the
  raw markdown body for a `## Preguntas frecuentes` section (pairs of `**question**` / answer) and
  emits FAQPage JSON-LD when found — this reads `post.body`, it doesn't touch the `.md` files. Each
  article gets its own OG image at `/og/<slug>.png` (see below), not the site-wide default.
- `/og/[...route].ts` → [src/pages/og/[...route].ts](src/pages/og/[...route].ts) — build-time route
  (via `astro-og-canvas`) that renders one PNG per published article using its real title/description,
  self-hosted Fraunces/Public Sans. Static output only, never loaded by visitors — just referenced in
  `og:image` for link previews. Static pages keep the shared `public/og-default.svg`.
- `/robots.txt` → [src/pages/robots.txt.ts](src/pages/robots.txt.ts) and `/ads.txt` →
  [src/pages/ads.txt.ts](src/pages/ads.txt.ts) — generated at build time from `Astro.site` and
  `SITE.adsenseClient` respectively, instead of static files in `public/`, so the domain/AdSense ID
  only need to be set once (in `astro.config.mjs` / `consts.ts`) and can't drift out of sync. Don't
  add `public/robots.txt` or `public/ads.txt` back — they'd conflict with these routes.
- `/sobre/` → [src/pages/sobre.astro](src/pages/sobre.astro) — about the publication (not a person).
- `/404` → [src/pages/404.astro](src/pages/404.astro).
- Legal pages (`aviso-legal`, `privacidad`, `cookies`) are static `.astro` files. By design they use
  generic text with no personal data, NIF, or contact email — the site owner explicitly wants passive
  management (no correspondence to handle), so don't reintroduce `[RELLENAR]`-style personal
  identification/contact-email requirements unless asked.

**Layout/styling**: [src/layouts/Base.astro](src/layouts/Base.astro) is the single shared layout —
head/meta/canonical/OG tags, a large global `<style>` block (all site CSS lives here, no separate
CSS files/framework), header with mobile hamburger nav built from `CATEGORIAS`, and footer.
Every page wraps its content in `<Base>`.

**AdSense/Analytics/Search Console are all config-gated the same way**: empty string in `consts.ts`
= nothing rendered, non-empty = the tag/script appears. `SITE.adsenseClient` gates both
[src/components/AdSlot.astro](src/components/AdSlot.astro) and the AdSense `<script>` in
`Base.astro` (and `ads.txt`, see above); `SITE.analyticsId` gates the GA4 gtag.js snippet;
`SITE.searchConsoleId` gates the `google-site-verification` meta tag. Follow this same
empty-string-gated pattern for any new third-party embed — never hardcode an ID directly in a
component.

**Sitemap**: generated automatically by `@astrojs/sitemap` (configured in `astro.config.mjs`), keyed
off `site: 'https://...'` in that same file — update that URL when cloning for a new domain.
