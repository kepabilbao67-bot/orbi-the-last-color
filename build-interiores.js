/* ============================================================
   Genera los PDF de interior de la saga de elementos (KDP).
   4 libros x 5 idiomas = 20 PDF. 24 páginas, todas a color.
   Página cuadrada 8.5"x8.5". Uso:  node build-interiores.js
   Requiere: sharp y pdfkit.
   ============================================================ */
const fs = require("fs");
const vm = require("vm");
const path = require("path");
function req(n) { try { return require(n); } catch (e) { return require("/projects/_tools/node_modules/" + n); } }
const sharp = req("sharp");
const PDFDocument = req("pdfkit");

const ctx = { window: {}, Math: Math, document: { documentElement: { lang: "es" } } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/orbi-draw.js", "utf8"), ctx);
const d = ctx.window.OrbiDraw;

const PT = 612, RES = 1500;
const LANGS = ["es", "en", "ca", "gl", "eu"];
const SECTION = { es: "ESPAÑOL", en: "ENGLISH", ca: "CATALÀ", gl: "GALEGO", eu: "EUSKARA" };

const T = {
  theEnd: { es: "FIN", en: "THE END", ca: "FI", gl: "FIN", eu: "AMAIERA" },
  collectionTitle: { es: "LA COLECCIÓN ORBI", en: "THE ORBI COLLECTION", ca: "LA COL·LECCIÓ ORBI", gl: "A COLECCIÓN ORBI", eu: "ORBI BILDUMA" },
  dedication: { es: "Para quien todavía sueña despierto.", en: "For everyone who still daydreams.", ca: "Per a qui encara somia despert.", gl: "Para quen aínda soña esperto.", eu: "Esna amets egiten duenarentzat." },
  intro: { es: "Te presento a Orbi y a Chispa. Viajan por el espacio ayudando a quien lo necesita.", en: "Meet Orbi and Chispa. They travel through space helping those in need.", ca: "Et presento l'Orbi i en Chispa. Viatgen per l'espai ajudant qui ho necessita.", gl: "Preséntoche a Orbi e a Chispa. Viaxan polo espazo axudando a quen o precisa.", eu: "Hona hemen Orbi eta Chispa. Espazioan zehar bidaiatzen dute behar duena lagunduz." },
  familiesTitle: { es: "Para las familias", en: "For families", ca: "Per a les famílies", gl: "Para as familias", eu: "Familientzat" },
  colorTitle: { es: "¡Colorea!", en: "Color it!", ca: "Pinta-ho!", gl: "Colorea!", eu: "Margotu!" },
  colorSub: { es: "Elige tus colores y pinta el dibujo.", en: "Pick your colors and paint the picture.", ca: "Tria els teus colors i pinta el dibuix.", gl: "Escolle as túas cores e pinta o debuxo.", eu: "Aukeratu zure koloreak eta margotu marrazkia." },
  countTitle: { es: "¿Cuántas estrellas ves?", en: "How many stars can you count?", ca: "Quants estels veus?", gl: "Cantas estrelas ves?", eu: "Zenbat izar ikusten dituzu?" },
  discover: { es: "Descubre los otros cuentos de Orbi", en: "Discover the other Orbi tales", ca: "Descobreix els altres contes de l'Orbi", gl: "Descobre os outros contos de Orbi", eu: "Ezagutu Orbiren beste ipuinak" },
  thanks: { es: "Gracias por leer, por compartir y por ayudar. Parte de los beneficios se destina a Cáritas.", en: "Thank you for reading, sharing and helping. Part of the proceeds goes to charity.", ca: "Gràcies per llegir, compartir i ajudar. Part dels beneficis es destina a Càritas.", gl: "Grazas por ler, compartir e axudar. Parte dos beneficios destínase a Cáritas.", eu: "Eskerrik asko irakurtzeagatik, partekatzeagatik eta laguntzeagatik. Irabazien zati bat Caritasentzat da." },
  elements: { es: "Aire · Fuego · Agua · Tierra", en: "Air · Fire · Water · Earth", ca: "Aire · Foc · Aigua · Terra", gl: "Aire · Lume · Auga · Terra", eu: "Airea · Sua · Ura · Lurra" }
};

const BOOKS = {
  5: { md: "libro-5-el-aire.md", art: "art-5.js", c1: "#2a3a7a", c2: "#0b1238",
       sub: { es: "y el Aire enfadado", en: "and the Angry Wind", ca: "i l'Aire enfadat", gl: "e o Aire enfadado", eu: "eta haize haserrea" },
       refrain: { es: "respira hondo y vuelve la calma", en: "breathe deep and the calm comes back", ca: "respira fons i torna la calma", gl: "respira fondo e volve a calma", eu: "arnasa sakon hartu, eta lasaitasuna itzultzen da" },
       family: { es: "A veces el enfado llega como un torbellino. Enseña a tu peque a respirar hondo y despacio: la calma siempre vuelve.", en: "Sometimes anger arrives like a whirlwind. Teach your child to breathe slowly and deeply: calm always comes back.", ca: "De vegades l'enuig arriba com un remolí. Ensenya al teu infant a respirar a poc a poc i fons: la calma sempre torna.", gl: "Ás veces o enfado chega como un remuíño. Ensínalle ao teu peque a respirar fondo e amodo: a calma sempre volve.", eu: "Batzuetan haserrea zurrunbilo baten gisa iristen da. Irakatsi zure txikiari poliki eta sakon arnasa hartzen: lasaitasuna beti itzultzen da." },
       hero: d.whirl(400, 520, 1.8, 2, "happy") },
  6: { md: "libro-6-el-fuego.md", art: "art-6.js", c1: "#1a2450", c2: "#0a1024",
       sub: { es: "y la Llamita", en: "and the Little Flame", ca: "i la Flameta", gl: "e a Lapiña", eu: "eta sugar txikia" },
       refrain: { es: "un poquito de calor lo cambia todo", en: "a little warmth changes everything", ca: "una mica d'escalfor ho canvia tot", gl: "un pouquiño de calor cámbiao todo", eu: "bero pixka batek dena aldatzen du" },
       family: { es: "Los gestos pequeños dan calor de verdad. Recuérdale a tu peque que acompañar, abrazar o compartir ayuda muchísimo.", en: "Small gestures give real warmth. Remind your child that keeping someone company, hugging or sharing helps a lot.", ca: "Els gestos petits donen escalfor de veritat. Recorda al teu infant que acompanyar, abraçar o compartir ajuda moltíssim.", gl: "Os xestos pequenos dan calor de verdade. Lémbralle ao teu peque que acompañar, abrazar ou compartir axuda moitísimo.", eu: "Keinu txikiek benetako beroa ematen dute. Gogorarazi zure txikiari lagun egitea, besarkatzea edo partekatzea asko laguntzen duela." },
       hero: '<circle cx="400" cy="500" r="200" fill="#ffd84d" opacity=".18"/>' + d.flame(400, 540, 2.0, "happy") },
  7: { md: "libro-7-el-agua.md", art: "art-7.js", c1: "#1a3a6a", c2: "#0a1c38",
       sub: { es: "y la Nube que no quería llover", en: "and the Cloud Who Wouldn't Rain", ca: "i el Núvol que no volia ploure", gl: "e a Nube que non quería chover", eu: "eta euririk egin nahi ez zuen hodeia" },
       refrain: { es: "lo que se comparte nunca se acaba", en: "what you share never runs out", ca: "el que es comparteix mai no s'acaba", gl: "o que se comparte nunca se acaba", eu: "partekatzen dena ez da inoiz agortzen" },
       family: { es: "Compartir no nos deja con menos: hace crecer cosas buenas y a menudo vuelve a nosotros. Pregúntale qué le gustaría compartir hoy.", en: "Sharing doesn't leave us with less: it grows good things and often returns to us. Ask what they'd like to share today.", ca: "Compartir no ens deixa amb menys: fa créixer coses bones i sovint torna a nosaltres. Pregunta-li què li agradaria compartir avui.", gl: "Compartir non nos deixa con menos: fai medrar cousas boas e a miúdo volve a nós. Pregúntalle que lle gustaría compartir hoxe.", eu: "Partekatzeak ez gaitu gutxiagorekin uzten: gauza onak hazten ditu eta askotan guregana itzultzen da. Galdetu zer partekatu nahiko lukeen gaur." },
       hero: d.cloud(400, 420, 1.7, "happy", true) },
  8: { md: "libro-8-la-tierra.md", art: "art-8.js", c1: "#234a23", c2: "#0a1c0c",
       sub: { es: "y la Semilla que tenía prisa", en: "and the Seed in a Hurry", ca: "i la Llavor que tenia pressa", gl: "e a Semente que tiña présa", eu: "eta presa zuen hazia" },
       refrain: { es: "con paciencia, todo crece", en: "with patience, everything grows", ca: "amb paciència, tot creix", gl: "con paciencia, todo medra", eu: "pazientziaz, dena hazten da" },
       family: { es: "Las cosas valiosas necesitan tiempo. Anima a tu peque a avanzar un poquito cada día, sin rendirse.", en: "Valuable things take time. Encourage your child to move forward a little each day, without giving up.", ca: "Les coses valuoses necessiten temps. Anima el teu infant a avançar una mica cada dia, sense rendir-se.", gl: "As cousas valiosas precisan tempo. Anima ao teu peque a avanzar un pouquiño cada día, sen renderse.", eu: "Gauza baliotsuek denbora behar dute. Animatu zure txikia egunero pixka bat aurrera egitera, amore eman gabe." },
       hero: '<rect x="120" y="560" width="560" height="120" fill="#8a5a2a"/>' + d.sprout(400, 560, 2.0, 1, "happy") }
};

function stripTags(s) { return s.replace(/<[^>]+>/g, "").replace(/\*\*/g, "").replace(/\*/g, "").trim(); }
function extractScenes(md, marker) {
  const lines = md.split("\n");
  const start = lines.findIndex(l => l.startsWith("## ") && l.toUpperCase().includes(marker));
  const out = {};
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) break;
    const m = lines[i].match(/^\*\*(\d+)\.\*\*\s+(.*)$/);
    if (m) out[parseInt(m[1], 10)] = stripTags(m[2]);
  }
  return out;
}
function svg800(inner) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">' + inner + '</svg>'; }
function toBuf(inner) { return sharp(Buffer.from(svg800(inner)), { density: 200 }).resize(RES, RES).png().toBuffer(); }
function heartBig(x, y, s, c) { return '<path transform="translate(' + x + ',' + y + ') scale(' + s + ')" d="M0 6 C-8 -6 -22 2 0 18 C22 2 8 -6 0 6 Z" fill="' + c + '"/>'; }

function coloringArt(variant, c1) {
  // marco de color + lienzo blanco + dibujo de línea para colorear
  var frame = '<rect width="800" height="800" fill="' + c1 + '"/>' +
    '<rect x="46" y="120" width="708" height="640" rx="28" fill="#ffffff"/>';
  var art;
  if (variant === 0) {
    art = '<circle cx="250" cy="430" r="92" fill="#fff" stroke="#333" stroke-width="4"/>' +
      '<ellipse cx="250" cy="430" rx="135" ry="28" fill="none" stroke="#333" stroke-width="4"/>' +
      '<g transform="translate(560,420)"><path d="M0 -130 Q54 -54 54 60 L-54 60 Q-54 -54 0 -130 Z" fill="#fff" stroke="#333" stroke-width="4"/><circle cx="0" cy="-44" r="26" fill="#fff" stroke="#333" stroke-width="4"/><path d="M-54 38 L-92 92 L-44 72 Z" fill="#fff" stroke="#333" stroke-width="4"/><path d="M54 38 L92 92 L44 72 Z" fill="#fff" stroke="#333" stroke-width="4"/><path d="M-26 60 Q0 132 26 60 Z" fill="#fff" stroke="#333" stroke-width="4"/></g>' +
      starOutline(400, 250, 46) + starOutline(180, 600, 26) + starOutline(640, 640, 30);
  } else {
    art = '<circle cx="400" cy="300" r="70" fill="#fff" stroke="#333" stroke-width="4"/>' +
      '<g stroke="#333" stroke-width="4"><line x1="400" y1="190" x2="400" y2="160"/><line x1="290" y1="300" x2="258" y2="300"/><line x1="510" y1="300" x2="542" y2="300"/><line x1="322" y1="222" x2="300" y2="200"/><line x1="478" y1="222" x2="500" y2="200"/></g>' +
      '<path d="M250 700 Q400 540 550 700 Z" fill="#fff" stroke="#333" stroke-width="4"/>' +
      '<g fill="#fff" stroke="#333" stroke-width="4"><circle cx="220" cy="520" r="36"/><circle cx="270" cy="500" r="46"/><circle cx="330" cy="520" r="38"/><rect x="184" y="516" width="184" height="44" rx="22"/></g>' +
      starOutline(600, 480, 40) + starOutline(150, 380, 26);
  }
  return frame + art;
}
function starOutline(x, y, R) {
  var pts = "";
  for (var i = 0; i < 10; i++) { var a = Math.PI / 5 * i - Math.PI / 2, r = (i % 2 === 0) ? R : R * 0.44; pts += (x + r * Math.cos(a)).toFixed(1) + "," + (y + r * Math.sin(a)).toFixed(1) + " "; }
  return '<polygon points="' + pts + '" fill="#fff" stroke="#333" stroke-width="4"/>';
}

// ---- texto en pdfkit ----
function textBox(doc, txt, fs, color) {
  var bw = PT - 56, bh = 150, bx = 28, by = PT - bh - 22;
  doc.roundedRect(bx, by, bw, bh, 18).fill("#ffffff");
  doc.fillColor(color || "#222").font("Helvetica").fontSize(fs).text(txt, bx + 20, by + 18, { width: bw - 40, align: "center", lineGap: 2 });
}
function centerText(doc, txt, y, fs, color, font) {
  doc.fillColor(color).font(font || "Helvetica-Bold").fontSize(fs).text(txt, 40, y, { width: PT - 80, align: "center" });
}

async function buildBook(book) {
  const b = BOOKS[book];
  const md = fs.readFileSync(path.join(__dirname, b.md), "utf8");
  // escenas del cuento
  ctx.window.ORBI_ART = undefined;
  vm.runInContext(fs.readFileSync(path.join(__dirname, b.art), "utf8"), ctx);
  const ART = ctx.window.ORBI_ART;
  const sceneBufs = [];
  for (const a of ART) sceneBufs.push(await toBuf(a));

  // fondos extra (compartidos por idioma)
  const bgGrad = (id) => d.bg(id, b.c1, b.c2);
  const titleBuf = await toBuf(bgGrad("bt") + d.stars(120, 800, 800) + d.rocket(560, 470, 0.8) + d.orbi(250, 600, 1.4));
  const dedBuf = await toBuf(bgGrad("bd") + d.stars(130, 800, 800) + heartBig(400, 300, 7, "#ff5a8a"));
  const famBuf = await toBuf(bgGrad("bf") + d.stars(70, 800, 800) + heartBig(400, 230, 4.5, "#ff8ab0") + b.hero);
  const refBuf = await toBuf(bgGrad("br") + d.stars(130, 800, 800) + b.hero);
  const color0 = await toBuf(coloringArt(0, b.c1));
  const color1 = await toBuf(coloringArt(1, b.c2));
  const countBuf = await toBuf(bgGrad("bc") + d.stars(80, 800, 800) + d.orbi(400, 600, 1.5) + d.chispa(220, 250, 1.1) + d.chispa(620, 300, 1.1) + d.chispa(680, 560, 1.0));
  const collBuf = await toBuf(d.bg("bk", "#3a2a6a", "#160d33") + d.stars(120, 800, 800) +
    d.whirl(170, 470, 0.95, 2, "happy") + d.flame(360, 520, 1.0, "happy") + d.cloud(560, 430, 0.85, "happy", true) +
    '<rect x="660" y="540" width="120" height="60" fill="#8a5a2a"/>' + d.sprout(700, 540, 1.1, 1, "happy"));
  const endBuf = await toBuf(bgGrad("be") + d.stars(130, 800, 800) + '<circle cx="620" cy="180" r="56" fill="#fff" opacity=".9"/><circle cx="596" cy="166" r="56" fill="' + b.c2 + '"/>' + d.orbi(400, 600, 1.7) + d.chispa(560, 470, 1.2));

  for (const lang of LANGS) {
    const sc = extractScenes(md, SECTION[lang]);
    const out = path.join(__dirname, "interior-" + book + "-" + lang + ".pdf");
    const doc = new PDFDocument({ size: [PT, PT], margin: 0, info: { Title: "ORBI " + b.sub[lang], Author: "La Colección Orbi" } });
    doc.pipe(fs.createWriteStream(out));
    const full = (buf) => doc.image(buf, 0, 0, { width: PT, height: PT });

    // 1 Portada
    full(sceneBufs[0]);
    centerText(doc, "ORBI", 54, 54, "#ffffff"); centerText(doc, b.sub[lang], 128, 20, "#ffe9a8");
    // 2 Portadilla
    doc.addPage(); full(titleBuf);
    centerText(doc, "ORBI", 150, 64, "#ffffff"); centerText(doc, b.sub[lang], 240, 22, "#ffe9a8");
    centerText(doc, T.collectionTitle[lang], PT - 120, 16, "#cdbcff");
    // 3 Dedicatoria
    doc.addPage(); full(dedBuf); centerText(doc, T.dedication[lang], PT / 2 + 60, 22, "#ffffff", "Helvetica-Oblique");
    // 4..17 Historia (sin introducción: directo al cuento)
    for (let i = 1; i <= 14; i++) { doc.addPage(); full(sceneBufs[i]); textBox(doc, sc[i] || "", 15, "#222"); }
    // 19 Para las familias
    doc.addPage(); full(famBuf);
    centerText(doc, T.familiesTitle[lang], 150, 26, "#ffd84d");
    doc.fillColor("#ffffff").font("Helvetica").fontSize(17).text(b.family[lang], 70, 210, { width: PT - 140, align: "center", lineGap: 3 });
    // 20 Estribillo
    doc.addPage(); full(refBuf); centerText(doc, '"' + b.refrain[lang] + '"', PT / 2 - 60, 26, "#ffd84d");
    // Colorear 1
    doc.addPage(); full(color0); centerText(doc, T.colorTitle[lang], 36, 30, "#ffffff"); textBox(doc, T.colorSub[lang], 14, "#222");
    // Colorear 2
    doc.addPage(); full(color1); centerText(doc, T.colorTitle[lang], 36, 30, "#ffffff"); textBox(doc, T.colorSub[lang], 14, "#222");
    // Actividad: cuenta las estrellas
    doc.addPage(); full(countBuf); centerText(doc, T.countTitle[lang], 60, 24, "#ffd84d");
    // 23 Colección
    doc.addPage(); full(collBuf);
    centerText(doc, T.discover[lang], 90, 24, "#ffffff"); centerText(doc, T.elements[lang], PT - 130, 20, "#ffd84d");
    // 24 Cierre
    doc.addPage(); full(endBuf);
    centerText(doc, T.theEnd[lang], 150, 40, "#ffffff");
    doc.fillColor("#ffd1de").font("Helvetica").fontSize(14).text(T.thanks[lang], 70, PT - 150, { width: PT - 140, align: "center", lineGap: 2 });

    doc.end();
    await new Promise(r => doc.on("end", r));
    console.log("✓ interior-" + book + "-" + lang + ".pdf");
  }
}

(async function () {
  for (const book of [5, 6, 7, 8]) await buildBook(book);
  console.log("\n20 PDF de interior (24 páginas, a color) generados.");
})();
