/* ============================================================
   Generador de lectores interactivos de la saga de elementos.
   Lee los manuscritos libro-5..8-*.md (fuente única de texto),
   extrae las 14 escenas por idioma y genera libro-N-LANG.html.
   Uso:  node build-lectores.js
   ============================================================ */
const fs = require("fs");
const path = require("path");

const ASSET_V = "2"; // cache-busting de la saga (súbelo al cambiar assets)

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

// ---- IA "pregúntale al libro": conocimiento por libro/idioma ----
const HERO = { 5: "Remo", 6: "Ascua", 7: "Nimbo", 8: "Brote" };
const KW = {
  about: { es: ["trata", "de que", "de qué", "sobre", "historia", "resumen", "argumento"], en: ["about", "story", "plot", "summary", "what is"], ca: ["tracta", "de què", "història", "resum", "argument"], gl: ["trata", "de que", "historia", "resumo", "argumento"], eu: ["zeri", "buruz", "istorio", "laburpen", "kontatzen"] },
  value: { es: ["ensena", "enseña", "valor", "aprende", "moraleja", "mensaje"], en: ["teach", "value", "lesson", "moral", "message"], ca: ["ensenya", "valor", "missatge", "moralitat"], gl: ["ensina", "valor", "mensaxe", "moralexa"], eu: ["irakas", "balio", "mezua"] },
  end: { es: ["final", "termina", "acaba"], en: ["end", "ending", "finish"], ca: ["final", "acaba"], gl: ["final", "remata", "acaba"], eu: ["amaiera", "bukaera"] }
};
const WELCOME = {
  es: "¡Hola! Soy el ayudante del libro. Pregúntame de qué va este cuento de Orbi. 🌈",
  en: "Hi! I'm the book helper. Ask me what this Orbi tale is about. 🌈",
  ca: "Hola! Soc l'ajudant del llibre. Pregunta'm de què va aquest conte de l'Orbi. 🌈",
  gl: "Ola! Son o axudante do libro. Pregúntame de que vai este conto de Orbi. 🌈",
  eu: "Kaixo! Liburuaren laguntzailea naiz. Galdetu zeri buruzkoa den Orbiren ipuin hau. 🌈"
};
const SUGT = {
  es: h => ["¿De qué trata el libro?", "¿Quién es Orbi?", "¿Quién es " + h + "?", "¿Qué enseña?", "¿Cómo termina?", "¿A dónde va el dinero?"],
  en: h => ["What is the book about?", "Who is Orbi?", "Who is " + h + "?", "What does it teach?", "How does it end?", "Where does the money go?"],
  ca: h => ["De què tracta el llibre?", "Qui és l'Orbi?", "Qui és " + h + "?", "Què ensenya?", "Com acaba?", "On va el diner?"],
  gl: h => ["De que trata o libro?", "Quen é Orbi?", "Quen é " + h + "?", "Que ensina?", "Como remata?", "A onde vai o diñeiro?"],
  eu: h => ["Zeri buruzkoa da liburua?", "Nor da Orbi?", "Nor da " + h + "?", "Zer irakasten du?", "Nola amaitzen da?", "Nora doa dirua?"]
};
const QADATA = {
  5: {
    about: { es: "Remo es un torbellino que, cuando se enfada, gira tan fuerte que lo desordena todo. Orbi le enseña un secreto del aire: respirar hondo para que vuelva la calma.", en: "Remo is a whirlwind who spins out of control when he's angry. Orbi teaches him a secret of the air: breathe deeply so calm comes back.", ca: "En Remo és un remolí que, quan s'enfada, gira tan fort que ho desordena tot. L'Orbi li ensenya un secret de l'aire: respirar fons perquè torni la calma.", gl: "Remo é un remuíño que, cando se enfada, xira tan forte que o desordena todo. Orbi ensínalle un segredo do aire: respirar fondo para que volva a calma.", eu: "Remo zurrunbilo bat da, eta haserretzen denean hain indartsu biratzen du dena nahasten duela. Orbik airearen sekretu bat irakasten dio: arnasa sakon hartzea lasaitasuna itzul dadin." },
    character: { es: "Remo es un pequeño torbellino que aprende a calmarse respirando.", en: "Remo is a little whirlwind who learns to calm down by breathing.", ca: "En Remo és un petit remolí que aprèn a calmar-se respirant.", gl: "Remo é un pequeno remuíño que aprende a calmarse respirando.", eu: "Remo zurrunbilo txiki bat da, arnasa hartuz lasaitzen ikasten duena." },
    value: { es: "Enseña la calma: la rabia se hace pequeña cuando aprendemos a respirar.", en: "It teaches calm: anger gets smaller when we learn to breathe.", ca: "Ensenya la calma: la ràbia es fa petita quan aprenem a respirar.", gl: "Ensina a calma: a rabia faise pequena cando aprendemos a respirar.", eu: "Lasaitasuna irakasten du: haserrea txikitu egiten da arnasa hartzen ikasten dugunean." },
    ending: { es: "Al final, Remo se convierte en una brisa suave. Recuerda: respira hondo y vuelve la calma. 🌬️", en: "In the end, Remo becomes a gentle breeze. Remember: breathe deep and the calm comes back. 🌬️", ca: "Al final, en Remo es torna una brisa suau. Recorda: respira fons i torna la calma. 🌬️", gl: "Ao final, Remo convértese nunha brisa suave. Lembra: respira fondo e volve a calma. 🌬️", eu: "Azkenean, Remo brisa leun bihurtzen da. Gogoratu: arnasa sakon hartu, eta lasaitasuna itzultzen da. 🌬️" }
  },
  6: {
    about: { es: "Ascua es una llamita tan pequeña que cree que no sirve de nada en un mundo helado. Orbi le muestra que un poquito de calor —un abrazo, una compañía— lo cambia todo.", en: "Ascua is a tiny flame who thinks she's useless in a frozen world. Orbi shows her that a little warmth —a hug, some company— changes everything.", ca: "L'Ascua és una flameta tan petita que es pensa que no serveix de res en un món glaçat. L'Orbi li mostra que una mica d'escalfor —una abraçada, companyia— ho canvia tot.", gl: "Ascua é unha lapiña tan pequena que cre que non serve de nada nun mundo xeado. Orbi amósalle que un pouquiño de calor —un abrazo, compañía— cámbiao todo.", eu: "Ascua hain sugar txikia da, non izoztutako mundu batean ezertarako balio ez duela uste baitu. Orbik erakusten dio bero pixka batek —besarkada batek, lagun egiteak— dena aldatzen duela." },
    character: { es: "Ascua es una llamita pequeña que descubre que dar calor a los demás es muy valioso.", en: "Ascua is a little flame who discovers that giving warmth to others is precious.", ca: "L'Ascua és una flameta petita que descobreix que donar escalfor als altres és molt valuós.", gl: "Ascua é unha lapiña pequena que descobre que dar calor aos demais é moi valioso.", eu: "Ascua sugar txiki bat da, besteei beroa ematea oso baliotsua dela aurkitzen duena." },
    value: { es: "Enseña la ternura y el consuelo: hasta el gesto más pequeño ayuda a quien lo necesita.", en: "It teaches tenderness and comfort: even the smallest gesture helps someone in need.", ca: "Ensenya la tendresa i el consol: fins i tot el gest més petit ajuda qui ho necessita.", gl: "Ensina a tenrura e o consolo: ata o xesto máis pequeno axuda a quen o precisa.", eu: "Samurtasuna eta kontsolamendua irakasten ditu: keinurik txikienak ere laguntzen dio behar duenari." },
    ending: { es: "Al final, Ascua brilla cálida y acogedora. Recuerda: un poquito de calor lo cambia todo. 🔥", en: "In the end, Ascua glows warm and cozy. Remember: a little warmth changes everything. 🔥", ca: "Al final, l'Ascua brilla càlida i acollidora. Recorda: una mica d'escalfor ho canvia tot. 🔥", gl: "Ao final, Ascua brilla cálida e acolledora. Lembra: un pouquiño de calor cámbiao todo. 🔥", eu: "Azkenean, Ascua epel eta atsegin distiratzen du. Gogoratu: bero pixka batek dena aldatzen du. 🔥" }
  },
  7: {
    about: { es: "Nimbo es una nube cabezota que guarda toda su lluvia por miedo a quedarse sin nada, mientras un planeta muere de sed. Orbi le enseña que el agua que compartes vuelve en lluvia.", en: "Nimbo is a stubborn cloud who hoards all his rain, afraid of running out, while a planet dies of thirst. Orbi teaches him that shared water returns as rain.", ca: "En Nimbo és un núvol tossut que guarda tota la seva pluja per por de quedar-se sense res, mentre un planeta es mor de set. L'Orbi li ensenya que l'aigua que comparteixes torna en pluja.", gl: "Nimbo é unha nube teimuda que garda toda a súa choiva por medo a quedar sen nada, mentres un planeta morre de sede. Orbi ensínalle que a auga que compartes volve en choiva.", eu: "Nimbo hodei burugogor bat da, bere euri guztia gordetzen duena ezer gabe geratzeko beldurrez, planeta bat egarriz hiltzen den bitartean. Orbik irakasten dio partekatzen duzun ura euri gisa itzultzen dela." },
    character: { es: "Nimbo es una nube que aprende a compartir su lluvia y a ser generosa.", en: "Nimbo is a cloud who learns to share his rain and be generous.", ca: "En Nimbo és un núvol que aprèn a compartir la seva pluja i a ser generós.", gl: "Nimbo é unha nube que aprende a compartir a súa choiva e a ser xenerosa.", eu: "Nimbo hodei bat da, bere euria partekatzen eta eskuzabala izaten ikasten duena." },
    value: { es: "Enseña a compartir: lo que damos no se pierde, hace crecer la vida y vuelve a nosotros.", en: "It teaches sharing: what we give isn't lost, it grows life and returns to us.", ca: "Ensenya a compartir: el que donem no es perd, fa créixer la vida i torna a nosaltres.", gl: "Ensina a compartir: o que damos non se perde, fai medrar a vida e volve a nós.", eu: "Partekatzen irakasten du: ematen duguna ez da galtzen, bizia hazten du eta guregana itzultzen da." },
    ending: { es: "Al final, Nimbo reparte lluvia y el planeta florece. Recuerda: lo que se comparte nunca se acaba. 💧", en: "In the end, Nimbo spreads rain and the planet blooms. Remember: what you share never runs out. 💧", ca: "Al final, en Nimbo reparteix pluja i el planeta floreix. Recorda: el que es comparteix mai no s'acaba. 💧", gl: "Ao final, Nimbo reparte choiva e o planeta florece. Lembra: o que se comparte nunca se acaba. 💧", eu: "Azkenean, Nimbok euria banatzen du eta planeta loratzen da. Gogoratu: partekatzen dena ez da inoiz agortzen. 💧" }
  },
  8: {
    about: { es: "Brote es una semilla con muchísima prisa: quiere ser un árbol enorme ¡ya! Orbi le enseña que lo importante crece despacio, regándolo un poquito cada día.", en: "Brote is a seed in a big hurry: she wants to be a huge tree now! Orbi teaches her that important things grow slowly, watered a little each day.", ca: "La Brote és una llavor amb molta pressa: vol ser un arbre enorme ara! L'Orbi li ensenya que el que és important creix a poc a poc, regant-ho una mica cada dia.", gl: "Brote é unha semente con moita présa: quere ser unha árbore enorme xa! Orbi ensínalle que o importante medra amodo, regándoo un pouquiño cada día.", eu: "Brote presa handiko hazi bat da: zuhaitz erraldoi bat izan nahi du orain! Orbik irakasten dio garrantzitsua poliki hazten dela, egunero pixka bat ureztatuz." },
    character: { es: "Brote es una semilla impaciente que aprende el valor de la paciencia.", en: "Brote is an impatient seed who learns the value of patience.", ca: "La Brote és una llavor impacient que aprèn el valor de la paciència.", gl: "Brote é unha semente impaciente que aprende o valor da paciencia.", eu: "Brote hazi ezinegon bat da, pazientziaren balioa ikasten duena." },
    value: { es: "Enseña la paciencia: lo valioso no llega de golpe, llega un poquito cada día sin rendirse.", en: "It teaches patience: valuable things don't arrive at once, they come little by little without giving up.", ca: "Ensenya la paciència: el que és valuós no arriba de cop, arriba a poc a poc sense rendir-se.", gl: "Ensina a paciencia: o valioso non chega de golpe, chega pouquiño a pouco sen renderse.", eu: "Pazientzia irakasten du: baliotsua ez da bat-batean iristen, pixkanaka iristen da amore eman gabe." },
    ending: { es: "Al final, Brote se convierte en un gran árbol con nidos. Recuerda: con paciencia, todo crece. 🌱", en: "In the end, Brote becomes a big tree full of nests. Remember: with patience, everything grows. 🌱", ca: "Al final, la Brote es converteix en un gran arbre amb nius. Recorda: amb paciència, tot creix. 🌱", gl: "Ao final, Brote convértese nunha gran árbore con niños. Lembra: con paciencia, todo medra. 🌱", eu: "Azkenean, Brote habiez betetako zuhaitz handi bihurtzen da. Gogoratu: pazientziaz, dena hazten da. 🌱" }
  }
};
const FX = {
  5: ["sparkle", "sadwind", "clash", "rocket", "twinkle", "sparkle", "warm", "sparkle", "twinkle", "happy", "sadwind", "ding", "magic", "happy", "twinkle", "sparkle"],
  6: ["sparkle", "fade", "fade", "rocket", "twinkle", "sparkle", "warm", "warm", "sadwind", "happy", "warm", "ding", "magic", "happy", "twinkle", "sparkle"],
  7: ["sparkle", "dry", "dry", "rocket", "twinkle", "sparkle", "water", "water", "water", "magic", "water", "ding", "water", "happy", "twinkle", "sparkle"],
  8: ["sparkle", "dry", "dry", "rocket", "twinkle", "water", "warm", "ding", "happy", "happy", "twinkle", "ding", "magic", "happy", "twinkle", "sparkle"]
};
function qaFor(book, lang) {
  const q = QADATA[book], hero = HERO[book];
  const kb = [
    { k: KW.about[lang], a: q.about[lang] },
    { k: [hero.toLowerCase()], a: q.character[lang] },
    { k: KW.value[lang], a: q.value[lang] },
    { k: KW.end[lang], a: q.ending[lang] }
  ];
  const o = {}; o[lang] = { kb: kb, suggestions: SUGT[lang](hero), welcome: WELCOME[lang] };
  return o;
}

function buildHtml(book, lang, scenes) {
  const ui = UI[lang];
  const qa = qaFor(book.n, lang);
  const fx = FX[book.n];
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
window.ORBI_QA = ${JSON.stringify(qa)};
window.ORBI_FX = ${JSON.stringify(fx)};
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
