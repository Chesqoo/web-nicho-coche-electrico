# Manual de redacción para IA — plantilla genérica para webs de nicho

Versión parametrizable del manual editorial. Para instanciarlo en una web
nueva: rellena el bloque CONFIG y entrega el manual completo a la IA
redactora. Todo lo demás es invariante entre nichos.

## CONFIG (rellenar por nicho)

```
NICHO:            [p. ej. "perros: cuidado, ley y seguros en España"]
LECTOR:           [quién busca y qué le duele; p. ej. "dueño de perro
                   preocupado por el seguro obligatorio y los costes"]
CATEGORIAS:       [ids exactos de consts.ts; el 1er tag debe ser uno]
INTENCION_DOMINANTE: [informacional / comercial / trámites — mezcla típica]
FUENTES_PRIMARIAS: [BOE, organismos, fabricantes, colegios profesionales...]
ANCLA_GEOGRAFICA: [España / CCAA / global]
TEMAS_YMYL:       [qué temas exigen extremo cuidado (salud, legal, dinero)
                   y qué disclaimers usar]
VOZ:              [tuteo/usted, humor sí/no, primera persona...]
MONETIZACION:     [AdSense / afiliación / leads — condiciona los CTA]
```

## 1. Antes de escribir (invariante)

1. Clasifica la **intención** de la keyword y estructura para ella.
2. Sitúa el artículo en su **cluster**: pilar + 2-4 hermanos a enlazar.
   Nunca artículos isla.
3. Define el **ángulo diferencial** frente al top de Google: dato propio,
   tabla, caso local, la respuesta que el sector no da.

## 2. Estructura (invariante)

- Respuesta directa en los 2 primeros párrafos; el desarrollo después.
- H2 informativos (prohibidos "Introducción"/"Conclusión").
- Tabla cuando haya magnitudes comparables.
- FAQ final con 3-4 preguntas reales de Google.
- 900-1.400 palabras orientativas; prohibido rellenar.

## 3. Datos y verificación (invariante y prioritario)

- Prohibido inventar cifras, normas, precios, nombres de programas o fuentes.
- Dato no verificado → `[VERIFICAR: qué y dónde]` para el editor humano.
- Horquillas + ancla temporal en todo dato que caduque.
- Cálculos reproducibles: mostrar la cuenta.
- En TEMAS_YMYL: solo fuentes primarias, disclaimers del CONFIG, y derivar
  a profesional cuando toque ("consulta a tu veterinario/abogado/asesor").

## 4. Voz anti-IA (invariante, matizada por CONFIG.VOZ)

- Directo, concreto, con opinión donde haya opinión.
- Frases prohibidas: "en el mundo actual", "cabe destacar", "es importante
  mencionar", "sin duda", "en resumen", "juega un papel crucial",
  "descubre", "sumérgete", y cualquier cierre-arenga.
- Ejemplos con números y lugares concretos, no "un usuario medio".
- Nada de párrafos que repiten el H2 ni listas que repiten el párrafo.

## 5. Fuentes (invariante y obligatorio)

- Todo artículo termina con sección `## Fuentes`: 2-5 enlaces reales usados,
  priorizando FUENTES_PRIMARIAS del CONFIG.
- Prohibido inventar URLs; fuente sin URL garantizada → `[VERIFICAR: url]`.
- Sin sección de fuentes no hay publicación.

## 6. SEO y CTR (invariante; veracidad como límite duro)

- Optimiza para clic y tráfico, pero el title promete exactamente lo que el
  artículo da: el clickbait falso quema la marca y el CTR futuro.
- Keyword en title (natural), primer párrafo y un H2. Sin stuffing.
- Title ≤60 chars con beneficio/dato/número; `description` 140-155 como
  "anuncio" del artículo, con motivo de clic concreto.
- Respuesta directa extraíble (fragmento destacado): definición o cifra en
  2-3 frases al inicio; tablas y FAQ para posiciones especiales.
- 2-4 enlaces internos con anchor descriptivo; externos los de Fuentes
  (nofollow si comercial).

## 7. Frontmatter (invariante)

```yaml
---
title: "..."
description: "..."
pubDate: AAAA-MM-DD
tags: ["<categoria-id>", "opcional"]
draft: true   # siempre true al generar
---
```

## 8. Checklist del editor antes de publicar (invariante)

- [ ] `[VERIFICAR]` resueltos o reescritos.
- [ ] Respuesta en los 2 primeros párrafos.
- [ ] Enlaces internos válidos.
- [ ] Cero frases prohibidas.
- [ ] Horquillas y anclas temporales en datos caducos.
- [ ] Disclaimers YMYL si aplican.
- [ ] Sección `## Fuentes` con URLs reales.
- [ ] Title sin clickbait falso.
- [ ] Primer tag = categoría válida.

## 9. Mantenimiento (invariante)

- Artículos de ayudas/precios/convocatorias: revisión cada 3-4 meses,
  añadir `updatedDate` al frontmatter en cada revisión.
- Si un dato del artículo deja de ser cierto y no puedes actualizarlo,
  es mejor despublicar (draft: true) que mantenerlo mal.
