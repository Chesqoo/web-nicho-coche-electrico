import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';

// Envuelve cada <table> del markdown en <div class="tabla-scroll"> para que
// el scroll horizontal en tablas anchas (ver Base.astro) funcione de forma
// robusta en todos los navegadores, sin desbordar el resto de la página.
function envolverTablas() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'table' && parent && index !== null) {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['tabla-scroll'] },
          children: [node],
        };
      }
    });
  };
}

// Dominio del sitio (necesario para sitemap y URLs canónicas)
export default defineConfig({
  site: 'https://vatiosencasa.com',
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [envolverTablas],
  },
});
