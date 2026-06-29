/* ============================================================
   Generador de lectores interactivos de la saga de elementos.
   Lee los manuscritos libro-5..8-*.md (fuente única de texto),
   extrae las 14 escenas por idioma y genera libro-N-LANG.html.
   Uso:  node build-lectores.js
   ============================================================ */
const fs = require("fs");
const path = require("path");

const ASSET_V = "1"; // cache-busting de la saga (súbelo al cambiar assets)

const LANG_ORDER = ["es", "en", "ca", "gl", "eu"];
const LANG_LABEL = { es: "🇪🇸 Español", en: "🇬🇧 English", ca: "🟡 Català", gl: "🔵 Galego", eu: "🟢 Euskara" };
const LANG_NAME = { es: "español", en: "English", ca: "català", gl: "galego", eu: "euskara" };
const HTMLLANG = { es: "es", en: "en", ca: "ca", gl: "gl", eu: "eu" };

// Marcadores de cada sección de idioma en el .md
const SECTION = {
  es: "ESPAÑOL", en: "ENGLISH", ca: "CATALÀ", gl: "GALEGO", eu: "EUSKARA"
};

const UI = {
  es: { prev: "◀ Atrás", next: "Pasar ▶", coverWord: "Portada", endWord: "Final", pageWord: "Página", theEnd: "FIN", hint: "Pasa el dedo o el ratón por el texto y te lo leo 🔊🙂", brand: "✨ Un cuento de Orbi para soñadores ✨", ribbon: "💛 Beneficios para Cáritas" },
  en: { prev: "◀ Back", next: "Next ▶", coverWord: "Cover", endWord: "The End", pageWord: "Page", theEnd: "THE END", hint: "Hover the text to hear it read aloud 🔊🙂", brand: "✨ An Orbi tale for dreamers ✨", ribbon: "💛 Proceeds to charity" },
  ca: { prev: "◀ Enrere", next: "Passa ▶", coverWord: "Portada", endWord: "Final", pageWord: "Pàgina", theEnd: "FI", hint: "Passa el dit o el ratolí pel text i te'l llegeixo 🔊🙂", brand: "✨ Un conte de l'Orbi per a somiadors ✨", ribbon: "💛 Beneficis per a Càritas" },
  gl: { prev: "◀ Atrás", next: "Pasar ▶", coverWord: "Portada", endWord: "Final", pageWord: "Páxina", theEnd: "FIN", hint: "Pasa o dedo ou o rato polo texto e léocho 🔊🙂", brand: "✨ Un conto de Orbi para soñadores ✨", ribbon: "💛 Beneficios para Cáritas" },
  eu: { prev: "◀ Atzera", next: "Aurrera ▶", coverWord: "Azala", endWord: "Amaiera", pageWord: "Orrialdea", theEnd: "AMAIERA", hint: "Pasa hatza edo sagua testutik gora eta irakurriko dizut 🔊🙂", brand: "✨ Orbiren ipuin bat ametslarientzat ✨", ribbon: "💛 Irabaziak Caritasentzat" }
};

const BOOKS = [
  { n: 5, md: "libro-5-el-aire.md", art: "art-5.js", slug: "el-aire",
    sub: { es: "y el Aire enfadado", en: "and the Angry Wind", ca: "i l'Aire enfadat", gl: "e o Aire enfadado", eu: "eta haize haserrea" } },
  { n: 6, md: "libro-6-el-fuego.md", art: "art-6.js", slug: "el-fuego",
    sub: { es: "y la Llamita", en: "and the Little Flame", ca: "i la Flameta", gl: "e a Lapiña", eu: "eta sugar txikia" } },
  { n: 7, md: "libro-7-el-agua.md", art: "art-7.js", slug: "el-agua",
    sub: { es: "y la Nube que no quería llover", en: "and the Cloud Who Wouldn't Rain", ca: "i el Núvol que no volia ploure", gl: "e a Nube que non quería chover", eu: "eta euririk egin nahi ez zuen hodeia" } },
  { n: 8, md: "libro-8-la-tierra.md", art: "art-8.js", slug: "la-tierra",
    sub: { es: "y la Semilla que tenía prisa", en: "and the Seed in a Hurry", ca: "i la Llavor que tenia pressa", gl: "e a Semente que tiña présa", eu: "eta presa zuen hazia" } }
];

const BASE = "https://kepabilbao67-bot.github.io/orbi-the-last-color/";

function mdToHtml(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.+?)\*/g, "<i>$1</i>")
    .trim();
}
function stripTags(s) { return s.replace(/<[^>]+>/g, "").trim(); }
function jsStr(s) { return JSON.stringify(s); }

function extractScenes(md, langMarker) {
  const lines = md.split("\n");
  const start = lines.findIndex(l => l.includes("## ") && l.toUpperCase().includes(langMarker));
  if (start === -1) throw new Error("No section " + langMarker);
  const scenes = {};
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) break;
    const m = lines[i].match(/^\*\*(\d+)\.\*\*\s+(.*)$/);
    if (m) scenes[parseInt(m[1], 10)] = mdToHtml(m[2]);
  }
  return scenes;
}

function langHrefs(book) {
  return LANG_ORDER.map(c => ({ c, label: LANG_LABEL[c], href: `libro-${book.n}-${c}.html` }));
}

function buildHtml(book, lang, scenes) {
  const ui = UI[lang];
  const captions = [""];
  for (let i = 1; i <= 14; i++) captions.push(scenes[i] || "");
  const desc = stripTags(captions[1]).slice(0, 155);
  const sub = book.sub[lang];
  const hrefs = langHrefs(book);
  const alternates = hrefs.map(h => `<link rel="alternate" hreflang="${h.c}" href="${h.href}">`).join("\n");
  const ogAlt = LANG_ORDER.filter(c => c !== lang).map(c => `<meta property="og:locale:alternate" content="${c}_ES">`).join("\n");
  const seoParas = captions.slice(1).filter(Boolean).map(stripTags).map(p => `<p>${p}</p>`).join("");
  const v = `?v=${ASSET_V}`;

  return `<!DOCTYPE html>
<html lang="${HTMLLANG[lang]}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ORBI ${sub} | Cuento infantil (${LANG_NAME[lang]})</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${BASE}libro-${book.n}-${lang}.html">
${alternates}
<link rel="alternate" hreflang="x-default" href="libro-${book.n}-es.html">
<meta property="og:type" content="book">
<meta property="og:title" content="ORBI ${sub}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${BASE}portada.png">
<meta property="og:url" content="${BASE}libro-${book.n}-${lang}.html">
<meta property="og:locale" content="${lang}_ES">
${ogAlt}
<script type="application/ld+json">
${JSON.stringify({ "@context": "https://schema.org", "@type": "Book", name: "ORBI " + sub, inLanguage: HTMLLANG[lang], bookFormat: "https://schema.org/EBook", genre: ["Children's fiction", "Science fiction"], audience: { "@type": "Audience", suggestedMinAge: 4, suggestedMaxAge: 8 }, description: desc, isPartOf: { "@type": "BookSeries", name: "La Colección Orbi" }, publisher: { "@type": "Organization", name: "Cuento solidario (beneficios para Cáritas)" } })}
</script>
</head>
<body>
<script>
window.ORBI_LANGS = ${JSON.stringify(hrefs)};
window.ORBI_TEXT = {
  brand: ${jsStr(ui.brand)},
  prev: ${jsStr(ui.prev)}, next: ${jsStr(ui.next)},
  hint: ${jsStr(ui.hint)},
  coverTitle: "ORBI", coverSub: ${jsStr(sub)}, ribbon: ${jsStr(ui.ribbon)},
  theEnd: ${jsStr(ui.theEnd)},
  coverWord: ${jsStr(ui.coverWord)}, endWord: ${jsStr(ui.endWord)}, pageWord: ${jsStr(ui.pageWord)},
  captions: ${JSON.stringify(captions)}
};
</script>
<script src="orbi-draw.js${v}"></script>
<script src="${book.art}${v}"></script>
<script src="orbi-engine.js${v}"></script>
<script src="narrador.js${v}"></script>
</body>
</html>
`;
}

let count = 0;
for (const book of BOOKS) {
  const md = fs.readFileSync(path.join(__dirname, book.md), "utf8");
  for (const lang of LANG_ORDER) {
    const scenes = extractScenes(md, SECTION[lang]);
    const html = buildHtml(book, lang, scenes);
    const out = `libro-${book.n}-${lang}.html`;
    fs.writeFileSync(path.join(__dirname, out), html, "utf8");
    count++;
    console.log("✓ " + out + "  (" + Object.keys(scenes).length + " escenas)");
  }
}
console.log("\nGeneradas " + count + " páginas. ASSET_V=" + ASSET_V);
