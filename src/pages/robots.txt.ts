// Generado a partir de Astro.site (astro.config.mjs) para no tener que
// mantener el dominio duplicado a mano en public/robots.txt.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
