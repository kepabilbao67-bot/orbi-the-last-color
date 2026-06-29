/* ============================================================
   Genera portadas HD (PNG) de la saga de elementos con sharp.
   Uso:  node build-portadas.js
   (sharp se carga desde /projects/_tools si no está local)
   ============================================================ */
const fs = require("fs");
const vm = require("vm");
let sharp;
try { sharp = require("sharp"); } catch (e) { sharp = require("/projects/_tools/node_modules/sharp"); }

// Cargar OrbiDraw en un contexto con window/Math
const ctx = { window: {}, Math: Math, document: { documentElement: { lang: "es" } } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/orbi-draw.js", "utf8"), ctx);
const d = ctx.window.OrbiDraw;

const CW = 1200, CH = 1500;
const FONT = "Noto Sans, sans-serif";

function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function grad(id, c1, c2) {
  return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + c1 + '"/><stop offset="100%" stop-color="' + c2 + '"/></linearGradient>';
}
function starsFull(n) {
  var s = "";
  for (var i = 0; i < n; i++) {
    s += '<circle cx="' + (Math.random() * CW).toFixed(0) + '" cy="' + (Math.random() * CH).toFixed(0) + '" r="' + (Math.random() * 2.6 + 0.8).toFixed(1) + '" fill="#fff" opacity="' + (Math.random() * 0.6 + 0.35).toFixed(2) + '"/>';
  }
  return s;
}
function pill(cx, cy, text, fs, bg, fg) {
  var w = Math.max(220, text.length * fs * 0.56), h = fs * 1.7;
  return '<rect x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + (h / 2) + '" fill="' + bg + '"/>' +
    '<text x="' + cx + '" y="' + (cy + fs * 0.36) + '" text-anchor="middle" font-family="' + FONT + '" font-weight="700" font-size="' + fs + '" fill="' + fg + '">' + esc(text) + '</text>';
}
function heart(cx, cy, s, c) {
  return '<path transform="translate(' + cx + ',' + cy + ') scale(' + s + ')" d="M0 6 C-8 -6 -22 2 0 18 C22 2 8 -6 0 6 Z" fill="' + c + '"/>';
}

const BOOKS = {
  5: { c1: "#2a3a7a", c2: "#0b1238", sub: "y el Aire enfadado", subBg: "#7fc0f0", subFg: "#0d2a4a",
       hero: d.whirl(600, 980, 2.6, 2, "happy"), extra: '<path d="M180 560 Q600 470 1020 560" stroke="#bfe3ff" stroke-width="14" fill="none" opacity=".4"/>' },
  6: { c1: "#1a2450", c2: "#0a1024", sub: "y la Llamita", subBg: "#ff8a3a", subFg: "#3a1600",
       hero: '<circle cx="600" cy="940" r="300" fill="#ffd84d" opacity=".18"/>' + d.flame(600, 1010, 3.0, "happy"), extra: "" },
  7: { c1: "#1a3a6a", c2: "#0a1c38", sub: "y la Nube que no quería llover", subBg: "#3a8fe0", subFg: "#fff",
       hero: d.cloud(600, 820, 2.5, "happy", true), extra: "" },
  8: { c1: "#234a23", c2: "#0a1c0c", sub: "y la Semilla que tenía prisa", subBg: "#6ec46e", subFg: "#0c2a0c",
       hero: '<g opacity=".35" transform="translate(900,1120) scale(2.2)">' + d.sprout(0, 0, 1, 3) + '</g>' +
             '<rect x="120" y="1180" width="960" height="160" fill="#8a5a2a"/><path d="M120 1180 Q600 1150 1080 1180" fill="#9a6a34"/>' +
             d.sprout(600, 1180, 3.0, 1, "happy") }
};

function coverSvg(n) {
  const b = BOOKS[n];
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CW + ' ' + CH + '" width="' + CW + '" height="' + CH + '">' +
    '<defs>' + grad("g" + n, b.c1, b.c2) + '</defs>' +
    '<rect width="' + CW + '" height="' + CH + '" fill="url(#g' + n + ')"/>' +
    starsFull(150) + (b.extra || "") + b.hero +
    d.orbi(330, 1230, 1.9) + d.chispa(900, 770, 1.8) +
    // marca arriba
    '<text x="600" y="120" text-anchor="middle" font-family="' + FONT + '" font-weight="700" font-size="34" letter-spacing="6" fill="#cdbcff">LA COLECCIÓN ORBI</text>' +
    // título
    '<text x="600" y="290" text-anchor="middle" font-family="' + FONT + '" font-weight="800" font-size="180" fill="#ffffff" stroke="#6a2bd6" stroke-width="6" paint-order="stroke">ORBI</text>' +
    // subtítulo en píldora
    pill(600, 400, b.sub, 44, b.subBg, b.subFg) +
    // cinta solidaria
    '<rect x="300" y="1395" width="600" height="64" rx="32" fill="#ff5a8a"/>' +
    heart(360, 1427, 1.4, "#fff") +
    '<text x="615" y="1437" text-anchor="middle" font-family="' + FONT + '" font-weight="700" font-size="30" fill="#fff">Beneficios para Cáritas</text>' +
    '</svg>';
}

(async function () {
  for (const n of [5, 6, 7, 8]) {
    const svg = coverSvg(n);
    const out = __dirname + "/portada-" + n + ".png";
    await sharp(Buffer.from(svg), { density: 200 }).resize(1600, 2000).png().toFile(out);
    const kb = (fs.statSync(out).size / 1024).toFixed(0);
    console.log("✓ portada-" + n + ".png  (" + kb + " KB)");
  }
  console.log("Portadas generadas (1600x2000).");
})();
