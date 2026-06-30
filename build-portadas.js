/* ============================================================
   Genera portadas HD (PNG) de la saga de elementos con sharp,
   en los 5 idiomas. Uso:  node build-portadas.js
   Salida: portada-N-LANG.png  (+ portada-N.png = versión ES)
   ============================================================ */
const fs = require("fs");
const vm = require("vm");
let sharp;
try { sharp = require("sharp"); } catch (e) { sharp = require("/projects/_tools/node_modules/sharp"); }

const ctx = { window: {}, Math: Math, document: { documentElement: { lang: "es" } } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/orbi-draw.js", "utf8"), ctx);
const d = ctx.window.OrbiDraw;

const CW = 1200, CH = 1500;
const FONT = "Noto Sans, sans-serif";
const LANGS = ["es", "en", "ca", "gl", "eu"];

const COLLECTION = { es: "LA COLECCIÓN ORBI", en: "THE ORBI COLLECTION", ca: "LA COL·LECCIÓ ORBI", gl: "A COLECCIÓN ORBI", eu: "ORBI BILDUMA" };
const RIBBON = { es: "Beneficios para Cáritas", en: "Proceeds go to charity", ca: "Beneficis per a Càritas", gl: "Beneficios para Cáritas", eu: "Irabaziak Caritasentzat" };

const BOOKS = {
  5: { c1: "#2a3a7a", c2: "#0b1238", subBg: "#7fc0f0", subFg: "#0d2a4a",
       sub: { es: "y el Aire enfadado", en: "and the Angry Wind", ca: "i l'Aire enfadat", gl: "e o Aire enfadado", eu: "eta haize haserrea" },
       hero: d.whirl(600, 940, 1.9, 2, "happy"), extra: "" },
  6: { c1: "#1a2450", c2: "#0a1024", subBg: "#ff8a3a", subFg: "#3a1600",
       sub: { es: "y la Llamita", en: "and the Little Flame", ca: "i la Flameta", gl: "e a Lapiña", eu: "eta sugar txikia" },
       hero: d.flame(600, 980, 2.5, "happy"), extra: "" },
  7: { c1: "#1a3a6a", c2: "#0a1c38", subBg: "#3a8fe0", subFg: "#ffffff",
       sub: { es: "y la Nube que no quería llover", en: "and the Cloud Who Wouldn't Rain", ca: "i el Núvol que no volia ploure", gl: "e a Nube que non quería chover", eu: "eta euririk egin nahi ez zuen hodeia" },
       hero: d.cloud(600, 820, 2.5, "happy", true), extra: "" },
  8: { c1: "#234a23", c2: "#0a1c0c", subBg: "#6ec46e", subFg: "#0c2a0c",
       sub: { es: "y la Semilla que tenía prisa", en: "and the Seed in a Hurry", ca: "i la Llavor que tenia pressa", gl: "e a Semente que tiña présa", eu: "eta presa zuen hazia" },
       hero: '<g opacity=".35" transform="translate(900,1120) scale(2.2)">' + d.sprout(0, 0, 1, 3) + '</g>' +
             '<rect x="120" y="1180" width="960" height="160" fill="#8a5a2a"/><path d="M120 1180 Q600 1150 1080 1180" fill="#9a6a34"/>' +
             d.sprout(600, 1180, 2.4, 1, "happy") }
};

function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function grad(id, c1, c2) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + c1 + '"/><stop offset="100%" stop-color="' + c2 + '"/></linearGradient>'; }
function starsFull(n) { var s = ""; for (var i = 0; i < n; i++) { s += '<circle cx="' + (Math.random() * CW).toFixed(0) + '" cy="' + (Math.random() * CH).toFixed(0) + '" r="' + (Math.random() * 2.6 + 0.8).toFixed(1) + '" fill="#fff" opacity="' + (Math.random() * 0.6 + 0.35).toFixed(2) + '"/>'; } return s; }
function pill(cx, cy, text, bg, fg) {
  var fsz = 46, maxW = 1080;
  while (text.length * fsz * 0.56 > maxW && fsz > 24) fsz -= 2;
  var w = Math.max(220, text.length * fsz * 0.56), h = fsz * 1.7;
  return '<rect x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + (h / 2) + '" fill="' + bg + '"/>' +
    '<text x="' + cx + '" y="' + (cy + fsz * 0.36) + '" text-anchor="middle" font-family="' + FONT + '" font-weight="700" font-size="' + fsz + '" fill="' + fg + '">' + esc(text) + '</text>';
}
function heart(cx, cy, s, c) { return '<path transform="translate(' + cx + ',' + cy + ') scale(' + s + ')" d="M0 6 C-8 -6 -22 2 0 18 C22 2 8 -6 0 6 Z" fill="' + c + '"/>'; }

function coverSvg(n, lang) {
  const b = BOOKS[n];
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CW + ' ' + CH + '" width="' + CW + '" height="' + CH + '">' +
    '<defs>' + grad("g" + n, b.c1, b.c2) + '</defs>' +
    '<rect width="' + CW + '" height="' + CH + '" fill="url(#g' + n + ')"/>' +
    starsFull(150) + (b.extra || "") + b.hero +
    d.orbi(330, 1230, 1.9) + d.chispa(900, 770, 1.8) +
    '<text x="600" y="120" text-anchor="middle" font-family="' + FONT + '" font-weight="700" font-size="34" letter-spacing="6" fill="#cdbcff">' + esc(COLLECTION[lang]) + '</text>' +
    '<text x="600" y="290" text-anchor="middle" font-family="' + FONT + '" font-weight="800" font-size="180" fill="#ffffff" stroke="#6a2bd6" stroke-width="6" paint-order="stroke">ORBI</text>' +
    pill(600, 400, b.sub[lang], b.subBg, b.subFg) +
    '<rect x="270" y="1395" width="660" height="64" rx="32" fill="#ff5a8a"/>' +
    heart(330, 1427, 1.4, "#fff") +
    '<text x="615" y="1437" text-anchor="middle" font-family="' + FONT + '" font-weight="700" font-size="30" fill="#fff">' + esc(RIBBON[lang]) + '</text>' +
    '</svg>';
}

(async function () {
  let count = 0;
  for (const n of [5, 6, 7, 8]) {
    for (const lang of LANGS) {
      const svg = coverSvg(n, lang);
      const out = __dirname + "/portada-" + n + "-" + lang + ".png";
      await sharp(Buffer.from(svg), { density: 200 }).resize(1600, 2000).png().toFile(out);
      if (lang === "es") await sharp(out).toFile(__dirname + "/portada-" + n + ".png");
      count++;
    }
    console.log("✓ Libro " + n + ": 5 portadas");
  }
  console.log("\nGeneradas " + count + " portadas (+4 alias ES). 1600x2000.");
})();
