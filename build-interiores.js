/* ============================================================
   Genera los PDF de interior de la saga de elementos (KDP).
   4 libros x 5 idiomas = 20 PDF. Página cuadrada 8.5"x8.5".
   Uso:  node build-interiores.js
   Requiere: sharp y pdfkit (en /projects/_tools si no son locales).
   ============================================================ */
const fs = require("fs");
const vm = require("vm");
const path = require("path");
function req(name) { try { return require(name); } catch (e) { return require("/projects/_tools/node_modules/" + name); } }
const sharp = req("sharp");
const PDFDocument = req("pdfkit");

const ctx = { window: {}, Math: Math, document: { documentElement: { lang: "es" } } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/orbi-draw.js", "utf8"), ctx);
const d = ctx.window.OrbiDraw;

const PT = 612;          // 8.5 in * 72
const RES = 1600;        // px de render de cada escena
const LANGS = ["es", "en", "ca", "gl", "eu"];
const SECTION = { es: "ESPAÑOL", en: "ENGLISH", ca: "CATALÀ", gl: "GALEGO", eu: "EUSKARA" };
const THEEND = { es: "FIN", en: "THE END", ca: "FI", gl: "FIN", eu: "AMAIERA" };

const BOOKS = {
  5: { md: "libro-5-el-aire.md", art: "art-5.js", bg: "#16204a",
       sub: { es: "y el Aire enfadado", en: "and the Angry Wind", ca: "i l'Aire enfadat", gl: "e o Aire enfadado", eu: "eta haize haserrea" },
       refrain: { es: "respira hondo y vuelve la calma", en: "breathe deep and the calm comes back", ca: "respira fons i torna la calma", gl: "respira fondo e volve a calma", eu: "arnasa sakon hartu, eta lasaitasuna itzultzen da" } },
  6: { md: "libro-6-el-fuego.md", art: "art-6.js", bg: "#14193a",
       sub: { es: "y la Llamita", en: "and the Little Flame", ca: "i la Flameta", gl: "e a Lapiña", eu: "eta sugar txikia" },
       refrain: { es: "un poquito de calor lo cambia todo", en: "a little warmth changes everything", ca: "una mica d'escalfor ho canvia tot", gl: "un pouquiño de calor cámbiao todo", eu: "bero pixka batek dena aldatzen du" } },
  7: { md: "libro-7-el-agua.md", art: "art-7.js", bg: "#142c52",
       sub: { es: "y la Nube que no quería llover", en: "and the Cloud Who Wouldn't Rain", ca: "i el Núvol que no volia ploure", gl: "e a Nube que non quería chover", eu: "eta euririk egin nahi ez zuen hodeia" },
       refrain: { es: "lo que se comparte nunca se acaba", en: "what you share never runs out", ca: "el que es comparteix mai no s'acaba", gl: "o que se comparte nunca se acaba", eu: "partekatzen dena ez da inoiz agortzen" } },
  8: { md: "libro-8-la-tierra.md", art: "art-8.js", bg: "#173417",
       sub: { es: "y la Semilla que tenía prisa", en: "and the Seed in a Hurry", ca: "i la Llavor que tenia pressa", gl: "e a Semente que tiña présa", eu: "eta presa zuen hazia" },
       refrain: { es: "con paciencia, todo crece", en: "with patience, everything grows", ca: "amb paciència, tot creix", gl: "con paciencia, todo medra", eu: "pazientziaz, dena hazten da" } }
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
function wrap(art) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">' + art + '</svg>'; }

async function renderScenes(artFile) {
  ctx.window.ORBI_ART = undefined;
  vm.runInContext(fs.readFileSync(__dirname + "/" + artFile, "utf8"), ctx);
  const ART = ctx.window.ORBI_ART;
  const bufs = [];
  for (const a of ART) {
    bufs.push(await sharp(Buffer.from(wrap(a)), { density: 200 }).resize(RES, RES).png().toBuffer());
  }
  return bufs;
}

function buildPdf(book, lang, scenes, sceneBufs) {
  return new Promise((resolve) => {
    const b = BOOKS[book];
    const out = path.join(__dirname, "interior-" + book + "-" + lang + ".pdf");
    const doc = new PDFDocument({ size: [PT, PT], margin: 0, info: { Title: "ORBI " + b.sub[lang], Author: "La Colección Orbi" } });
    const stream = fs.createWriteStream(out);
    doc.pipe(stream);

    // Portada
    doc.image(sceneBufs[0], 0, 0, { width: PT, height: PT });
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(54).text("ORBI", 0, 54, { width: PT, align: "center" });
    doc.fontSize(20).fillColor("#ffe9a8").text(b.sub[lang], 50, 128, { width: PT - 100, align: "center" });

    // Escenas 1..14
    for (let i = 1; i <= 14; i++) {
      doc.addPage();
      doc.image(sceneBufs[i], 0, 0, { width: PT, height: PT });
      const cap = scenes[i] || "";
      const boxW = PT - 56, boxH = 150, boxX = 28, boxY = PT - boxH - 22;
      doc.roundedRect(boxX, boxY, boxW, boxH, 18).fill("#ffffff");
      doc.fillColor("#222222").font("Helvetica").fontSize(15)
        .text(cap, boxX + 20, boxY + 18, { width: boxW - 40, align: "center", lineGap: 2 });
    }

    // Página final: estribillo + FIN
    doc.addPage();
    doc.rect(0, 0, PT, PT).fill(b.bg);
    doc.fillColor("#ffd84d").font("Helvetica-Bold").fontSize(26)
      .text('"' + b.refrain[lang] + '"', 60, PT / 2 - 70, { width: PT - 120, align: "center" });
    doc.fillColor("#ffffff").fontSize(40).text(THEEND[lang], 0, PT / 2 + 30, { width: PT, align: "center" });
    doc.fillColor("#ff8ab0").fontSize(13).font("Helvetica")
      .text("La Colección Orbi · beneficios para Cáritas", 0, PT - 70, { width: PT, align: "center" });

    doc.end();
    stream.on("finish", resolve);
  });
}

(async function () {
  let count = 0;
  for (const book of [5, 6, 7, 8]) {
    const md = fs.readFileSync(path.join(__dirname, BOOKS[book].md), "utf8");
    const sceneBufs = await renderScenes(BOOKS[book].art); // se reutilizan en los 5 idiomas
    for (const lang of LANGS) {
      const scenes = extractScenes(md, SECTION[lang]);
      await buildPdf(book, lang, scenes, sceneBufs);
      count++;
      console.log("✓ interior-" + book + "-" + lang + ".pdf");
    }
  }
  console.log("\n" + count + " PDF de interior generados (8.5x8.5 in, 16 páginas).");
})();
