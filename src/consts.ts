// ============================================================
// CONFIGURACIÓN DEL SITIO — para montar una web nueva en otro
// nicho, edita SOLO este fichero + los .md de src/content/blog/
// (y el dominio en astro.config.mjs). Nada más.
// ============================================================

export const SITE = {
  nombre: 'Vatios en Casa',
  descripcion: 'Autoconsumo, aerotermia y ahorro energético en el hogar, explicados con números reales.',
  idioma: 'es',

  // <title> de la home: a diferencia del resto de páginas (que usan el título
  // del artículo/sección), la home no tiene uno propio salvo este — que debe
  // llevar las keywords principales del nicho, no solo el nombre del sitio.
  tituloHome: 'Vatios en Casa — Autoconsumo, aerotermia y ahorro energético',

  // Texto del hero de portada
  eyebrow: 'Energía y autoconsumo · España',
  heroTitulo: 'Ahorra en tu factura con <em>números reales</em>, no con humo',

  // Texto del enlace de cada tarjeta de artículo (portada y categorías).
  textoCta: 'Ver los números →',
  // Frase de cierre del footer. SITE.nombre es una publicación/agregador,
  // no una persona — evita voz de autor individual aquí.
  footerFrase: 'Información sobre energía y autoconsumo en el hogar, redactada y revisada antes de publicarse.',

  // ID de cliente AdSense (ca-pub-XXXXXXXXXXXXXXXX).
  // Vacío ('') = no se inserta el código de anuncios.
  adsenseClient: 'ca-pub-4597818086995636',
};

// Categorías del sitio. El PRIMER tag de cada artículo debe ser
// el id de su categoría. Añadir una categoría aquí crea
// automáticamente su página /categoria/<id>/ y su enlace en el menú.
export const CATEGORIAS = [
  {
    id: 'balcon-solar',
    nombre: 'Balcón solar',
    descripcion: 'Kits solares enchufables: legalidad, ahorro real y comparativas para producir tu propia energía sin obras.',
  },
  {
    id: 'aerotermia',
    nombre: 'Aerotermia',
    descripcion: 'Precios reales, ayudas y todo lo que debes saber antes de sustituir tu caldera por una bomba de calor.',
  },
  {
    id: 'ahorro',
    nombre: 'Ahorro y tarifas',
    descripcion: 'Excedentes, batería virtual, consumo de electrodomésticos y trucos con números para pagar menos luz.',
  },
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const categoriaDe = (tags: readonly string[]): Categoria | undefined =>
  CATEGORIAS.find((c) => tags.includes(c.id));
