// ============================================================
// CONFIGURACIÓN DEL SITIO — para montar una web nueva en otro
// nicho, edita SOLO este fichero + los .md de src/content/blog/
// (y el dominio en astro.config.mjs). Nada más.
// ============================================================

export const SITE = {
  nombre: 'Vatios en Ruta',
  descripcion: 'Coche eléctrico y recarga en España, explicados con números reales: cuánto cuesta, cuánto ahorras y qué comprar.',
  idioma: 'es',

  // <title> de la home: a diferencia del resto de páginas (que usan el título
  // del artículo/sección), la home no tiene uno propio salvo este — que debe
  // llevar las keywords principales del nicho, no solo el nombre del sitio.
  tituloHome: 'Vatios en Ruta — Coche eléctrico y recarga en España',

  // Texto del hero de portada
  eyebrow: 'Coche eléctrico y recarga · España',
  heroTitulo: 'El coche eléctrico con <em>números reales</em>, no con humo',

  // Texto del enlace de cada tarjeta de artículo (portada y categorías).
  textoCta: 'Ver los números →',
  // Frase de cierre del footer. SITE.nombre es una publicación/agregador,
  // no una persona — evita voz de autor individual aquí.
  footerFrase: 'Información sobre coche eléctrico y recarga en el hogar, redactada y revisada antes de publicarse.',

  // ID de cliente AdSense (ca-pub-XXXXXXXXXXXXXXXX).
  // Vacío ('') = no se inserta el código de anuncios.
  adsenseClient: 'ca-pub-4597818086995636',

  // Measurement ID de Google Analytics 4 (G-XXXXXXXXXX).
  // Vacío ('') = no se inserta el script de medición.
  analyticsId: '',
  // Token de verificación de Google Search Console (el valor del content=
  // de la etiqueta <meta name="google-site-verification"> que te da Search
  // Console al dar de alta el dominio). Vacío ('') = no se inserta la etiqueta.
  searchConsoleId: '',
};

// Categorías del sitio. El PRIMER tag de cada artículo debe ser
// el id de su categoría. Añadir una categoría aquí crea
// automáticamente su página /categoria/<id>/ y su enlace en el menú.
export const CATEGORIAS = [
  {
    id: 'coches-electricos',
    nombre: 'Coches eléctricos',
    descripcion: 'Modelos, autonomía real, comparativas y qué comprar según tu uso.',
  },
  {
    id: 'recarga',
    nombre: 'Recarga',
    descripcion: 'Wallbox en casa, red pública, cargar con placas solares, tiempos y costes.',
  },
  {
    id: 'coste-y-ayudas',
    nombre: 'Coste y ayudas',
    descripcion: 'Coste real frente a gasolina, Plan MOVES, fiscalidad, seguro y mantenimiento.',
  },
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const categoriaDe = (tags: readonly string[]): Categoria | undefined =>
  CATEGORIAS.find((c) => tags.includes(c.id));
