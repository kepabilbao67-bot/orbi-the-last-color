/* ============================================================
   Portadas completas "wraparound" para KDP (contraportada+lomo+frente).
   Tapa blanda, 8.5"x8.5", 24 páginas, color premium. 300 DPI.
   4 libros x 5 idiomas = 20 JPG. Uso:  node build-wraparound.js
   ============================================================ */
const fs = require("fs");
const vm = require("vm");
function req(n) { try { return require(n); } catch (e) { return require("/projects/_tools/node_modules/" + n); } }
const sharp = req("sharp");

const ctx = { window: {}, Math: Math, document: { documentElement: { lang: "es" } } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + "/orbi-draw.js", "utf8"), ctx);
const d = ctx.window.OrbiDraw;

// ---- Medidas KDP (px @ 300 dpi) ----
const DPI = 300;
const BLEED = Math.round(0.125 * DPI);          // 38
const TRIM = Math.round(8.5 * DPI);             // 2550
const PAGES = 24;
const SPINE = Math.max(8, Math.round(PAGES * 0.002347 * DPI)); // ~17 px (color premium)
const W = BLEED + TRIM + SPINE + TRIM + BLEED;  // ancho total
const H = BLEED + TRIM + BLEED;                 // alto total
const frontX0 = BLEED + TRIM + SPINE;           // inicio zona frontal
const frontC = frontX0 + TRIM / 2;              // centro frente
const backC = BLEED + TRIM / 2;                 // centro contra
const FONT = "Noto Sans, sans-serif";
const LANGS = ["es", "en", "ca", "gl", "eu"];

const COLLECTION = { es: "LA COLECCIÓN ORBI", en: "THE ORBI COLLECTION", ca: "LA COL·LECCIÓ ORBI", gl: "A COLECCIÓN ORBI", eu: "ORBI BILDUMA" };
const RIBBON = { es: "Beneficios para Cáritas", en: "Proceeds go to charity", ca: "Beneficis per a Càritas", gl: "Beneficios para Cáritas", eu: "Irabaziak Caritasentzat" };
const AGES = { es: "Cuento ilustrado · 4 a 8 años", en: "Illustrated story · ages 4 to 8", ca: "Conte il·lustrat · 4 a 8 anys", gl: "Conto ilustrado · 4 a 8 anos", eu: "Ipuin ilustratua · 4-8 urte" };

const BOOKS = {
  5: { c1: "#2a3a7a", c2: "#0b1238", subBg: "#7fc0f0", subFg: "#0d2a4a",
       sub: { es: "y el Aire enfadado", en: "and the Angry Wind", ca: "i l'Aire enfadat", gl: "e o Aire enfadado", eu: "eta haize haserrea" },
       blurb: { es: "Remo es un torbellino que, cuando se enfada, gira tan fuerte que lo desordena todo. Junto a Orbi y a Chispa descubrirá un secreto del aire: que la rabia se hace pequeña cuando aprendemos a respirar.", en: "Remo is a whirlwind who, when he gets angry, spins so hard he messes everything up. With Orbi and Spark he'll discover a secret of the air: anger gets smaller when we learn to breathe.", ca: "En Remo és un remolí que, quan s'enfada, gira tan fort que ho desordena tot. Amb l'Orbi i l'Espurna descobrirà un secret de l'aire: la ràbia es fa petita quan aprenem a respirar.", gl: "Remo é un remuíño que, cando se enfada, xira tan forte que o desordena todo. Con Orbi e Faísca descubrirá un segredo do aire: a rabia faise pequena cando aprendemos a respirar.", eu: "Remo zurrunbilo bat da, eta haserretzen denean hain indartsu biratzen du dena nahasten duela. Orbirekin eta Txinpartarekin airearen sekretu bat aurkituko du: haserrea txikitu egiten dela arnasa hartzen ikasten dugunean." },
       hero: () => d.whirl(frontC, 1480, 4.0, 2, "happy") },
  6: { c1: "#1a2450", c2: "#0a1024", subBg: "#ff8a3a", subFg: "#3a1600",
       sub: { es: "y la Llamita", en: "and the Little Flame", ca: "i la Flameta", gl: "e a Lapiña", eu: "eta sugar txikia" },
       blurb: { es: "Ascua es una llamita tan pequeña que cree que no sirve para nada en un mundo helado. Junto a Orbi y a Chispa descubrirá que un poquito de calor —un abrazo, una compañía— lo cambia todo.", en: "Ascua is a flame so small she thinks she's useless in a frozen world. With Orbi and Spark she'll discover that a little warmth —a hug, some company— changes everything.", ca: "L'Ascua és una flameta tan petita que es pensa que no serveix de res en un món glaçat. Amb l'Orbi i l'Espurna descobrirà que una mica d'escalfor —una abraçada, companyia— ho canvia tot.", gl: "Ascua é unha lapiña tan pequena que cre que non serve de nada nun mundo xeado. Con Orbi e Faísca descubrirá que un pouquiño de calor —un abrazo, compañía— cámbiao todo.", eu: "Ascua hain sugar txikia da non izoztutako mundu batean ezertarako balio ez duela uste baitu. Orbirekin eta Txinpartarekin aurkituko du bero pixka batek —besarkada batek, lagun egiteak— dena aldatzen duela." },
       hero: () => '<circle cx="' + frontC + '" cy="1430" r="520" fill="#ffd84d" opacity=".18"/>' + d.flame(frontC, 1560, 5.6, "happy") },
  7: { c1: "#1a3a6a", c2: "#0a1c38", subBg: "#3a8fe0", subFg: "#ffffff",
       sub: { es: "y la Nube que no quería llover", en: "and the Cloud Who Wouldn't Rain", ca: "i el Núvol que no volia ploure", gl: "e a Nube que non quería chover", eu: "eta euririk egin nahi ez zuen hodeia" },
       blurb: { es: "Nimbo es una nube cabezota que guarda toda su lluvia por miedo a quedarse sin nada, mientras un planeta muere de sed. Junto a Orbi y a Chispa aprenderá que lo que se comparte no se pierde: vuelve y multiplica la vida.", en: "Nimbo is a stubborn cloud who hoards all his rain, afraid of running out, while a planet dies of thirst. With Orbi and Spark he'll learn that what you share isn't lost: it returns and multiplies life.", ca: "En Nimbo és un núvol tossut que guarda tota la seva pluja per por de quedar-se sense res, mentre un planeta es mor de set. Amb l'Orbi i l'Espurna aprendrà que el que es comparteix no es perd: torna i multiplica la vida.", gl: "Nimbo é unha nube teimuda que garda toda a súa choiva por medo a quedar sen nada, mentres un planeta morre de sede. Con Orbi e Faísca aprenderá que o que se comparte non se perde: volve e multiplica a vida.", eu: "Nimbo hodei burugogor bat da, bere euri guztia gordetzen duena ezer gabe geratzeko beldurrez, planeta bat egarriz hiltzen den bitartean. Orbirekin eta Txinpartarekin ikasiko du partekatzen dena ez dela galtzen: itzuli eta bizia biderkatzen du." },
       hero: () => d.cloud(frontC, 1240, 5.0, "happy", true) },
  8: { c1: "#234a23", c2: "#0a1c0c", subBg: "#6ec46e", subFg: "#0c2a0c",
       sub: { es: "y la Semilla que tenía prisa", en: "and the Seed in a Hurry", ca: "i la Llavor que tenia pressa", gl: "e a Semente que tiña présa", eu: "eta presa zuen hazia" },
       blurb: { es: "Brote es una semilla con muchísima prisa: quiere ser un árbol enorme ¡ya! Junto a Orbi y a Chispa aprenderá que lo importante crece despacio, regándolo un poquito cada día y sin rendirse.", en: "Brote is a seed in a big hurry: she wants to be a huge tree right now! With Orbi and Spark she'll learn that important things grow slowly, watered a little each day, without giving up.", ca: "La Brote és una llavor amb molta pressa: vol ser un arbre enorme ara! Amb l'Orbi i l'Espurna aprendrà que el que és important creix a poc a poc, regant-ho una mica cada dia i sense rendir-se.", gl: "Brote é unha semente con moita présa: quere ser unha árbore enorme xa! Con Orbi e Faísca aprenderá que o importante medra amodo, regándoo un pouquiño cada día e sen renderse.", eu: "Brote presa handiko hazi bat da: zuhaitz erraldoi bat izan nahi du orain! Orbirekin eta Txinpartarekin ikasiko du garrantzitsua poliki hazten dela, egunero pixka bat ureztatuz eta amore eman gabe." },
       hero: () => '<rect x="' + (frontC - 360) + '" y="1640" width="720" height="220" fill="#8a5a2a"/>' + d.sprout(frontC, 1640, 6.0, 1, "happy") }
};

function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function grad(id, c1, c2) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + c1 + '"/><stop offset="100%" stop-color="' + c2 + '"/></linearGradient>'; }
function stars(n) { var s = ""; for (var i = 0; i < n; i++) s += '<circle cx="' + (Math.random() * W).toFixed(0) + '" cy="' + (Math.random() * H).toFixed(0) + '" r="' + (Math.random() * 4 + 1).toFixed(1) + '" fill="#fff" opacity="' + (Math.random() * 0.6 + 0.3).toFixed(2) + '"/>'; return s; }
function pill(cx, cy, text, bg, fg) {
  var fsz = 90, maxW = TRIM - 280;
  while (text.length * fsz * 0.56 > maxW && fsz > 44) fsz -= 2;
  var w = Math.max(420, text.length * fsz * 0.56), h = fsz * 1.7;
  return '<rect x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + (h / 2) + '" fill="' + bg + '"/>' +
    '<text x="' + cx + '" y="' + (cy + fsz * 0.36) + '" text-anchor="middle" font-family="' + FONT + '" font-weight="700" font-size="' + fsz + '" fill="' + fg + '">' + esc(text) + '</text>';
}
function heart(cx, cy, s, c) { return '<path transform="translate(' + cx + ',' + cy + ') scale(' + s + ')" d="M0 6 C-8 -6 -22 2 0 18 C22 2 8 -6 0 6 Z" fill="' + c + '"/>'; }
function wrap(text, maxChars) {
  var words = text.split(" "), lines = [], cur = "";
  words.forEach(function (w) { if ((cur + " " + w).trim().length > maxChars) { lines.push(cur.trim()); cur = w; } else cur += " " + w; });
  if (cur.trim()) lines.push(cur.trim());
  return lines;
}
function paragraph(cx, y, text, fsz, color, maxChars, lh) {
  var lines = wrap(text, maxChars);
  var tspans = lines.map(function (l, i) { return '<tspan x="' + cx + '" dy="' + (i === 0 ? 0 : lh) + '">' + esc(l) + '</tspan>'; }).join("");
  return '<text x="' + cx + '" y="' + y + '" text-anchor="middle" font-family="' + FONT + '" font-size="' + fsz + '" fill="' + color + '">' + tspans + '</text>';
}

function buildSvg(n, lang) {
  const b = BOOKS[n];
  var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '">';
  s += '<defs>' + grad("g", b.c1, b.c2) + grad("gs", b.c2, b.c1) + '</defs>';
  s += '<rect width="' + W + '" height="' + H + '" fill="url(#g)"/>' + stars(420);
  // lomo
  s += '<rect x="' + (BLEED + TRIM) + '" y="0" width="' + SPINE + '" height="' + H + '" fill="url(#gs)"/>';

  // ===== FRENTE (derecha) =====
  s += b.hero();
  s += d.orbi(frontC - 560, 1980, 3.4) + d.chispa(frontC + 600, 980, 3.2);
  s += '<text x="' + frontC + '" y="270" text-anchor="middle" font-family="' + FONT + '" font-weight="700" font-size="64" letter-spacing="10" fill="#cdbcff">' + esc(COLLECTION[lang]) + '</text>';
  s += '<text x="' + frontC + '" y="540" text-anchor="middle" font-family="' + FONT + '" font-weight="800" font-size="300" fill="#ffffff" stroke="#6a2bd6" stroke-width="10" paint-order="stroke">ORBI</text>';
  s += pill(frontC, 720, b.sub[lang], b.subBg, b.subFg);
  s += '<rect x="' + (frontC - 560) + '" y="' + (H - 320) + '" width="1120" height="110" rx="55" fill="#ff5a8a"/>';
  s += heart(frontC - 430, H - 265, 2.6, "#fff");
  s += '<text x="' + (frontC + 20) + '" y="' + (H - 245) + '" text-anchor="middle" font-family="' + FONT + '" font-weight="700" font-size="52" fill="#fff">' + esc(RIBBON[lang]) + '</text>';

  // ===== CONTRA (izquierda) =====
  s += '<text x="' + backC + '" y="300" text-anchor="middle" font-family="' + FONT + '" font-weight="700" font-size="64" letter-spacing="8" fill="#cdbcff">' + esc(COLLECTION[lang]) + '</text>';
  s += heart(backC, 430, 4.5, "#ff8ab0");
  // caja blanca con la sinopsis
  var bx = BLEED + 150, bw = TRIM - 300, by = 560, bh = 1000;
  s += '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="40" fill="rgba(255,255,255,.94)"/>';
  s += '<text x="' + backC + '" y="' + (by + 110) + '" text-anchor="middle" font-family="' + FONT + '" font-weight="800" font-size="76" fill="#6a2bd6">ORBI ' + esc(b.sub[lang]) + '</text>';
  s += paragraph(backC, by + 230, b.blurb[lang], 50, "#222", 52, 66);
  s += '<text x="' + backC + '" y="' + (by + bh - 70) + '" text-anchor="middle" font-family="' + FONT + '" font-weight="700" font-size="44" fill="#7a4bd0">' + esc(AGES[lang]) + '</text>';
  // mini héroe decorativo abajo-izquierda (deja libre la zona del código de barras, abajo-derecha)
  s += '<g transform="translate(' + (BLEED + 360) + ',' + (H - 360) + ') scale(0.5)">' + (n === 5 ? d.whirl(0, 0, 1.6, 2, "happy") : n === 6 ? d.flame(0, 0, 1.8, "happy") : n === 7 ? d.cloud(0, -40, 1.5, "happy", true) : d.sprout(0, 40, 1.8, 1, "happy")) + '</g>';
  // recuadro guía para el código de barras (lo cubre KDP); en blanco translúcido
  s += '<rect x="' + (BLEED + TRIM - 640) + '" y="' + (H - 520) + '" width="560" height="360" rx="20" fill="rgba(255,255,255,.85)"/>';
  s += '<text x="' + (BLEED + TRIM - 360) + '" y="' + (H - 330) + '" text-anchor="middle" font-family="' + FONT + '" font-size="34" fill="#999">ISBN / código</text>';

  s += '</svg>';
  return s;
}

(async function () {
  console.log("Wraparound " + W + "x" + H + " px · lomo " + SPINE + " px (" + PAGES + " pág)");
  let count = 0;
  const only = process.argv[2] ? process.argv[2].split(",").map(Number) : [5, 6, 7, 8];
  for (const n of only) {
    for (const lang of LANGS) {
      const out = __dirname + "/cover-full-" + n + "-" + lang + ".jpg";
      await sharp(Buffer.from(buildSvg(n, lang))).jpeg({ quality: 88 }).toFile(out);
      count++;
    }
    console.log("✓ Libro " + n + ": 5 wraparound");
  }
  console.log("\n" + count + " portadas completas generadas (JPG 300 dpi).");
})();
