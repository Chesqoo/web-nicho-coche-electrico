// Generado a partir de SITE.adsenseClient para no tener que descomentar/editar
// public/ads.txt a mano cada vez que activas o cambias AdSense.
import type { APIRoute } from 'astro';
import { SITE } from '../consts';

export const GET: APIRoute = () => {
  // ads.txt usa el ID sin el prefijo "ca-" (ca-pub-XXXX → pub-XXXX).
  const body = SITE.adsenseClient
    ? `google.com, ${SITE.adsenseClient.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`
    : '';
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
