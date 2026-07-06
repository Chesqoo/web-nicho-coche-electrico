import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // draft: true → no se publica. El script de generación crea
    // los artículos en borrador; ponlo a false tras revisarlos.
    draft: z.boolean().default(true),
    // destacado: true → se muestra en grande en la portada, arriba del grid.
    // Si ningún artículo lo tiene, se usa el más reciente por defecto.
    destacado: z.boolean().default(false),
  }),
});

export const collections = { blog };
