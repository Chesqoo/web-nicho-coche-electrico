#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera un borrador de artículo en src/content/blog/ a partir de una keyword.

Uso:
  python scripts/generar_articulo.py --keyword "mejores placas solares para balcón"
  python scripts/generar_articulo.py --keyword "..." --palabras 1500 --idioma es

Modos:
  1) Con ANTHROPIC_API_KEY definida: llama a la API de Claude y escribe el .md.
  2) Sin API key: imprime el prompt para que lo pegues en la app de Claude
     (tu suscripción, coste 0) y guardes la respuesta con --desde-fichero.

  python scripts/generar_articulo.py --keyword "..." --desde-fichero respuesta.md
"""
import argparse
import json
import os
import re
import sys
import unicodedata
import urllib.request
from datetime import date
from pathlib import Path

BLOG_DIR = Path(__file__).resolve().parent.parent / "src" / "content" / "blog"
MODEL = "claude-sonnet-4-5"


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text.lower()).strip("-")
    return text[:80]


def build_prompt(keyword: str, palabras: int, idioma: str) -> str:
    return f"""Escribe un artículo de blog optimizado para SEO sobre la keyword: "{keyword}".

Requisitos:
- Idioma: {idioma}. Extensión: ~{palabras} palabras.
- Título H1 atractivo que incluya la keyword de forma natural.
- Estructura con subtítulos H2/H3, párrafos cortos, y una lista o tabla si aporta valor.
- Responde la intención de búsqueda en los primeros 2 párrafos.
- Tono cercano y útil, nada de relleno ni frases genéricas de IA.
- Incluye una sección de preguntas frecuentes (3-4 preguntas) al final.
- Cierra con una sección '## Fuentes' con 2-5 enlaces a fuentes primarias REALES (BOE, organismos oficiales, fabricantes). PROHIBIDO inventar URLs: si no puedes garantizar una URL, escribe [VERIFICAR: url de <fuente>].
- El título debe estar optimizado para el clic (beneficio o dato concreto) pero prometer EXACTAMENTE lo que el artículo entrega.
- NO inventes datos, cifras ni fuentes. Si un dato es necesario y no lo conoces con seguridad, escribe [VERIFICAR: descripción del dato].

Formato de salida (exactamente esto, sin texto adicional antes o después):
TITULO: <título del artículo>
DESCRIPCION: <meta descripción de 140-155 caracteres>
---
<cuerpo del artículo en markdown, empezando por el primer párrafo, SIN repetir el título>"""


def parse_response(text: str):
    m_t = re.search(r"TITULO:\s*(.+)", text)
    m_d = re.search(r"DESCRIPCION:\s*(.+)", text)
    parts = text.split("---", 1)
    body = parts[1].strip() if len(parts) > 1 else text.strip()
    title = m_t.group(1).strip() if m_t else "SIN TITULO — revisar"
    desc = m_d.group(1).strip() if m_d else ""
    return title, desc, body


def call_claude(prompt: str, api_key: str) -> str:
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps({
            "model": MODEL,
            "max_tokens": 8000,
            "messages": [{"role": "user", "content": prompt}],
        }).encode(),
        headers={
            "content-type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        },
    )
    with urllib.request.urlopen(req, timeout=300) as r:
        data = json.loads(r.read())
    return "".join(b.get("text", "") for b in data["content"])


def write_article(keyword: str, title: str, desc: str, body: str) -> Path:
    slug = slugify(title or keyword)
    path = BLOG_DIR / f"{slug}.md"
    desc = desc.replace('"', "'")
    title = title.replace('"', "'")
    frontmatter = (
        f'---\n'
        f'title: "{title}"\n'
        f'description: "{desc}"\n'
        f'pubDate: {date.today().isoformat()}\n'
        f'tags: []\n'
        f'draft: true\n'
        f'---\n\n'
    )
    path.write_text(frontmatter + body + "\n", encoding="utf-8")
    return path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--keyword", required=True)
    ap.add_argument("--palabras", type=int, default=1200)
    ap.add_argument("--idioma", default="es")
    ap.add_argument("--desde-fichero", help="Fichero con la respuesta de Claude pegada a mano")
    args = ap.parse_args()

    prompt = build_prompt(args.keyword, args.palabras, args.idioma)

    if args.desde_fichero:
        text = Path(args.desde_fichero).read_text(encoding="utf-8")
    else:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            print("No hay ANTHROPIC_API_KEY. Pega este prompt en Claude y guarda la")
            print("respuesta en un fichero, luego ejecuta con --desde-fichero:\n")
            print("=" * 60)
            print(prompt)
            print("=" * 60)
            sys.exit(0)
        print(f"Generando con {MODEL}...")
        text = call_claude(prompt, api_key)

    title, desc, body = parse_response(text)
    path = write_article(args.keyword, title, desc, body)
    print(f"Borrador creado: {path}")
    print("Revísalo, edítalo y cambia draft: true → false para publicarlo.")


if __name__ == "__main__":
    main()
