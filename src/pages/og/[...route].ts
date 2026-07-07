// Genera una imagen OG (og:image) distinta por artículo en tiempo de build:
// /og/<slug>.png — con el título real del artículo en vez del SVG genérico
// compartido por todo el sitio. No añade JS ni peso a las páginas para los
// visitantes: solo lo ven los crawlers de redes sociales al compartir un enlace.
import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const posts = await getCollection('blog', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
const pages = Object.fromEntries(posts.map((post) => [post.id, post.data]));

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[24, 36, 32]],
    border: { color: [4, 120, 87], width: 10, side: 'block-start' },
    padding: 70,
    font: {
      title: { color: [255, 255, 255], size: 58, lineHeight: 1.3, families: ['Fraunces'] },
      description: { color: [207, 216, 211], size: 32, lineHeight: 1.5, families: ['Public Sans'] },
    },
    fonts: [
      './node_modules/@fontsource/fraunces/files/fraunces-latin-600-normal.woff2',
      './node_modules/@fontsource/public-sans/files/public-sans-latin-400-normal.woff2',
    ],
  }),
});
