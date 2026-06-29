# Guía rápida: publicar la Saga de los Elementos en Amazon KDP

Los 4 libros nuevos (5-8) ya tienen **lector interactivo en los 5 idiomas** y un
**modo impresión** integrado para sacar el PDF. Aquí tienes el paso a paso.

> Páginas de lectura (una por idioma): `libro-5-es.html` … `libro-8-eu.html`.
> Cambia de idioma con la barra superior dentro del propio cuento.

---

## 1) El PDF del interior

**Ya tienes los PDF de interior generados**, en los 5 idiomas:
`interior-5-es.pdf` … `interior-8-eu.pdf` (formato cuadrado 8,5"×8,5", 16 páginas:
portada + 14 escenas + página final con el estribillo).

> Para regenerarlos: `node build-interiores.js` (usa `sharp` + `pdfkit`).

⚠️ **Importante (mínimo de páginas KDP):** Amazon KDP exige **mínimo 24 páginas** para
tapa blanda. Estos interiores tienen 16. Antes de publicar conviene **ampliarlos a 24+**
(portadilla, dedicatoria, página "Para las familias", actividades, etc.). Si quieres,
te los amplío automáticamente a 24 páginas.

### Alternativa: exportar desde el lector web
También puedes abrir cualquier cuento (`libro-5-es.html`…) y pulsar **🖨️ Guardar PDF /
Imprimir** → "Guardar como PDF", activando **"Gráficos de fondo"**.

### Formato recomendado en KDP
- **Tamaño:** cuadrado 21,59 × 21,59 cm (8,5" × 8,5"), típico de libro álbum infantil.
- **Tinta:** color premium. **Papel:** blanco. **Encuadernación:** tapa blanda.
- **Sangrado:** si KDP lo pide, vuelve a exportar con tamaño un poco mayor (sangrado de 3 mm por lado) o usa la opción "con sangrado" del diálogo.

---

## 2) La portada

**Ya tienes una portada HD lista para cada libro** (1600×2000 px), generada por código:

- Aire → `portada-5.png` · Fuego → `portada-6.png` · Agua → `portada-7.png` · Tierra → `portada-8.png`

Todas mantienen el **mismo estilo de serie** (cambia el color dominante del elemento),
con el título, el subtítulo y la cinta "Beneficios para Cáritas".

> Para regenerarlas o ajustarlas: `node build-portadas.js` (usa la librería `sharp`).
> Si KDP te pide una portada completa (contraportada + lomo), avísame y genero el
> wraparound con el tamaño exacto según el nº de páginas.

La **primera página** del lector también sirve como base si prefieres una captura.

### Portada COMPLETA (wraparound) para tapa blanda — ¡ya generada!
Para tapa blanda, KDP pide una sola imagen con **contraportada + lomo + frente**.
Ya las tienes (JPG a 300 dpi), en los 5 idiomas:

- `cover-full-5-es.jpg` … `cover-full-8-eu.jpg`

Calculadas para: **8,5"×8,5"**, **24 páginas**, color premium, sangrado 3 mm.
- Tamaño total: **5193 × 2626 px** · **lomo ≈ 17 px** (con 24 páginas KDP no permite texto en el lomo, por eso va liso).
- La contraportada deja un **hueco claro abajo** para el código de barras que **añade KDP automáticamente** (no lo tapes con texto).
- Regenerar: `node build-wraparound.js`. Si cambias el nº de páginas, el lomo se recalcula solo (constante `PAGES`).

> Nota: la portada simple `portada-N-LANG.png` (1600×2000) sirve para el **ebook**; el
> wraparound `cover-full-N-LANG.jpg` es para la **tapa blanda impresa**.

---

## 3) Metadatos para la ficha de cada libro

Cópialos del manuscrito correspondiente (sección "FICHA PARA AMAZON"):

| Libro | Archivo con la ficha | Valor | Estribillo |
|------|----------------------|-------|------------|
| 5 · Aire | `libro-5-el-aire.md` | la calma | *respira hondo y vuelve la calma* |
| 6 · Fuego | `libro-6-el-fuego.md` | el consuelo | *un poquito de calor lo cambia todo* |
| 7 · Agua | `libro-7-el-agua.md` | compartir | *lo que se comparte nunca se acaba* |
| 8 · Tierra | `libro-8-la-tierra.md` | la paciencia | *con paciencia, todo crece* |

Cada ficha trae: **descripción de venta**, **7 palabras clave** y **3 categorías**.

---

## 4) Consejos de colección
- Publica un libro, revisa que se ve bien impreso, y luego el resto.
- En la descripción de cada libro menciona que forma parte de **"La Colección Orbi"**
  y enlaza/nombra los demás → más ventas por cliente.
- Recuerda el mensaje solidario (parte de los beneficios a Cáritas): vende bien como regalo.

> ⚠️ **Euskera:** antes de publicar a la venta, que un hablante nativo dé un repaso
> final a los textos en euskera (van marcados con un aviso en cada manuscrito).
