/* ============================================================
   Orbi — Motor del libro (dibujos + páginas), compartido.
   El texto lo aporta cada idioma en window.ORBI_TEXT.
   ============================================================ */
(function () {
  "use strict";
  var T = window.ORBI_TEXT;
  if (!T) { return; }
  var W = 800, H = 800;

  // ---------- Estrellas de fondo (de colores) ----------
  function stars(n, w, h, color) {
    var palette = ['#ffffff','#ffffff','#ffd84d','#ff5a8a','#3ad1c8','#9b6bff','#7fd4ff','#ff8a3a','#5ad15a'];
    var s = '';
    for (var i = 0; i < n; i++) {
      var x = Math.random() * w, y = Math.random() * h, r = Math.random() * 2.4 + 0.7;
      var c = color || palette[Math.floor(Math.random() * palette.length)];
      s += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + r.toFixed(1) + '" fill="' + c + '" opacity="' + (Math.random() * 0.6 + 0.4).toFixed(2) + '"/>';
    }
    return s;
  }
  // ---------- Orbi ----------
  function orbi(x, y, sc) {
    sc = sc || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">' +
      '<circle cx="0" cy="-46" r="26" fill="#3a2418"/><circle cx="-20" cy="-40" r="12" fill="#3a2418"/>' +
      '<circle cx="20" cy="-40" r="12" fill="#3a2418"/><circle cx="-16" cy="-58" r="11" fill="#3a2418"/>' +
      '<circle cx="16" cy="-58" r="11" fill="#3a2418"/><circle cx="0" cy="-40" r="20" fill="#c98a5e"/>' +
      '<circle cx="-7" cy="-42" r="3" fill="#2a1a10"/><circle cx="7" cy="-42" r="3" fill="#2a1a10"/>' +
      '<path d="M-7 -32 Q0 -26 7 -32" stroke="#7a3b2a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<circle cx="-12" cy="-34" r="4" fill="#ff8aa0" opacity=".6"/><circle cx="12" cy="-34" r="4" fill="#ff8aa0" opacity=".6"/>' +
      '<path d="M-22 -20 Q0 -28 22 -20 L26 30 Q0 40 -26 30 Z" fill="#ffd233"/>' +
      '<rect x="-8" y="-18" width="16" height="20" rx="4" fill="#ffb300"/>' +
      '<path d="M-22 -16 L-34 12" stroke="#ffd233" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M22 -16 L34 12" stroke="#ffd233" stroke-width="12" stroke-linecap="round"/>' +
      '<circle cx="-35" cy="14" r="6" fill="#c98a5e"/><circle cx="35" cy="14" r="6" fill="#c98a5e"/>' +
      '<rect x="-20" y="30" width="16" height="18" rx="5" fill="#7a4bd0"/><rect x="4" y="30" width="16" height="18" rx="5" fill="#7a4bd0"/></g>';
  }
  // ---------- Chispa ----------
  function chispa(x, y, sc) {
    sc = sc || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">' +
      '<circle cx="0" cy="0" r="22" fill="#ffd84d" opacity=".35"/>' +
      '<circle cx="0" cy="0" r="12" fill="#b9c3cc" stroke="#7d8a96" stroke-width="2"/>' +
      '<circle cx="0" cy="0" r="6" fill="#fff4b0"/><circle cx="0" cy="0" r="3" fill="#fff"/>' +
      '<path d="M-10 -8 Q-20 -18 -14 -2" fill="#dfe7ee" opacity=".8"/>' +
      '<path d="M10 -8 Q20 -18 14 -2" fill="#dfe7ee" opacity=".8"/>' +
      '<line x1="-4" y1="-12" x2="-7" y2="-19" stroke="#7d8a96" stroke-width="2"/>' +
      '<line x1="4" y1="-12" x2="7" y2="-19" stroke="#7d8a96" stroke-width="2"/></g>';
  }
  function planet(cx, cy, r, c1, c2) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + c1 + '"/>' +
      '<ellipse cx="' + (cx - r * 0.3) + '" cy="' + (cy - r * 0.3) + '" rx="' + (r * 0.5) + '" ry="' + (r * 0.35) + '" fill="' + c2 + '" opacity=".5"/>';
  }
  // ---------- Estrella con NOMBRE y color ----------
  function nstar(x, y, c, name) {
    var pts = '';
    for (var i = 0; i < 10; i++) {
      var ang = Math.PI / 5 * i - Math.PI / 2;
      var r = (i % 2 === 0) ? 17 : 7.5;
      pts += (x + r * Math.cos(ang)).toFixed(1) + ',' + (y + r * Math.sin(ang)).toFixed(1) + ' ';
    }
    return '<polygon points="' + pts + '" fill="' + c + '" stroke="#fff" stroke-width="1.6"/>' +
      '<rect x="' + (x - 38) + '" y="' + (y + 20) + '" width="76" height="22" rx="11" fill="rgba(0,0,0,.5)"/>' +
      '<text x="' + x + '" y="' + (y + 35) + '" text-anchor="middle" font-size="15" fill="#fff" font-family="sans-serif">' + name + '</text>';
  }
  // estrellas con nombre, una distinta por página (se repiten en bucle)
  var STARLIST = [
    { n: 'Lumi',    c: '#ffd84d', x: 120, y: 120 },
    { n: 'Rubí',    c: '#ff5a5a', x: 680, y: 118 },
    { n: 'Coral',   c: '#ff5a8a', x: 130, y: 250 },
    { n: 'Aqua',    c: '#3ad1c8', x: 690, y: 250 },
    { n: 'Cielo',   c: '#7fd4ff', x: 400, y: 110 },
    { n: 'Violeta', c: '#9b6bff', x: 120, y: 400 },
    { n: 'Hoja',    c: '#5ad15a', x: 690, y: 400 },
    { n: 'Bruno',   c: '#ff8a3a', x: 250, y: 120 },
    { n: 'Perla',   c: '#ffffff', x: 560, y: 120 },
    { n: 'Estela',  c: '#ffd84d', x: 690, y: 540 },
    { n: 'Lila',    c: '#c89bff', x: 120, y: 540 },
    { n: 'Nube',    c: '#eaf6ff', x: 400, y: 130 }
  ];

  // ---------- Dibujos de cada página (sin texto) ----------
  var ART = [
    // 0 Portada
    '<defs><radialGradient id="cv" cx="50%" cy="40%" r="80%"><stop offset="0%" stop-color="#5b3aa6"/><stop offset="100%" stop-color="#160b34"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#cv)"/>' + stars(120, W, H) +
    '<path d="M0 ' + H + ' Q200 ' + (H - 90) + ' 400 ' + (H - 40) + ' T800 ' + H + '" fill="#7a4bd0" opacity=".5"/>' +
    '<path d="M120 250 Q300 160 520 230 T760 200" stroke="#ff5a8a" stroke-width="14" fill="none" opacity=".8" stroke-linecap="round"/>' +
    '<path d="M80 320 Q320 240 560 320 T780 300" stroke="#3ad1c8" stroke-width="12" fill="none" opacity=".8" stroke-linecap="round"/>' +
    '<path d="M100 400 Q300 330 540 400 T770 390" stroke="#ffd84d" stroke-width="12" fill="none" opacity=".85" stroke-linecap="round"/>' +
    planet(150, 520, 70, '#9b6bff', '#c9a8ff') +
    '<ellipse cx="400" cy="700" rx="190" ry="60" fill="#cfc6e6"/><ellipse cx="400" cy="700" rx="190" ry="60" fill="#000" opacity=".06"/>' +
    orbi(400, 610, 2.0) + chispa(560, 520, 1.6),

    // 1 universo gris
    '<rect width="' + W + '" height="' + H + '" fill="#2a2a33"/>' + stars(80, W, H) +
    '<path d="M150 300 Q260 220 380 300" stroke="#ff5a8a" stroke-width="10" fill="none" opacity=".7"/>' +
    '<path d="M300 360 Q420 290 540 360" stroke="#3ad1c8" stroke-width="10" fill="none" opacity=".5"/>' +
    '<path d="M450 250 Q560 180 680 250" stroke="#ffd84d" stroke-width="10" fill="none" opacity=".4"/>' +
    planet(400, 430, 90, '#5a5a66', '#74747f') +
    '<text x="400" y="600" text-anchor="middle" font-size="40" fill="#8a8a96">' + T.greyLabel + '</text>',

    // 2 Orbi + Chispa en la luna
    '<defs><linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3a2a6a"/><stop offset="100%" stop-color="#1a1240"/></linearGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#sky2)"/>' + stars(90, W, H) +
    '<ellipse cx="400" cy="640" rx="320" ry="120" fill="#bdb4d6"/><ellipse cx="280" cy="610" rx="30" ry="12" fill="#9c92bd"/><ellipse cx="520" cy="660" rx="40" ry="14" fill="#9c92bd"/>' +
    '<rect x="250" y="500" width="80" height="70" fill="#c25b3a"/><path d="M240 500 L290 460 L340 500 Z" fill="#8a3a22"/><rect x="278" y="535" width="24" height="35" fill="#ffd84d"/>' +
    orbi(470, 560, 1.7) + chispa(600, 470, 1.4),

    // 3 cohete
    '<rect width="' + W + '" height="' + H + '" fill="#241a52"/>' + stars(80, W, H) +
    '<ellipse cx="400" cy="700" rx="340" ry="110" fill="#b0a6d0"/>' +
    '<g transform="translate(430,430)"><path d="M0 -120 Q40 -60 40 40 L-40 40 Q-40 -60 0 -120 Z" fill="#e6edf3"/><path d="M0 -120 Q40 -60 40 40 L0 40 Z" fill="#cdd6df"/>' +
    '<circle cx="0" cy="-40" r="22" fill="#7fd4ff" stroke="#3a8fc0" stroke-width="5"/><path d="M-40 20 L-70 70 L-30 50 Z" fill="#ff5a8a"/><path d="M40 20 L70 70 L30 50 Z" fill="#ff5a8a"/>' +
    '<path d="M-18 40 Q0 110 18 40 Z" fill="#ffd84d"/><path d="M-10 40 Q0 80 10 40 Z" fill="#ff8a3a"/></g>' +
    orbi(250, 560, 1.4) + chispa(330, 420, 1.1),

    // 4 gigante triste
    '<rect width="' + W + '" height="' + H + '" fill="#3a3a44"/>' + stars(50, W, H) +
    '<path d="M0 620 L160 360 L300 620 Z" fill="#5a5a66"/><path d="M250 620 L450 320 L650 620 Z" fill="#6a6a76"/><path d="M560 620 L720 400 L800 620 Z" fill="#52525c"/>' +
    '<rect width="' + W + '" height="180" y="620" fill="#44444e"/>' +
    '<g transform="translate(430,470)"><circle cx="0" cy="0" r="80" fill="#7a7a88"/><circle cx="-28" cy="-10" r="8" fill="#2a2a33"/><circle cx="28" cy="-10" r="8" fill="#2a2a33"/>' +
    '<path d="M-26 40 Q0 22 26 40" stroke="#2a2a33" stroke-width="5" fill="none"/><path d="M-34 6 q-6 30 -2 50" stroke="#9fb6d6" stroke-width="4" fill="none" opacity=".8"/></g>',

    // 5 montañas naranja
    '<defs><linearGradient id="org" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffb347"/><stop offset="100%" stop-color="#ff7a3a"/></linearGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#org)"/>' + stars(40, W, H, '#fff6d0') +
    '<path d="M0 620 L160 360 L300 620 Z" fill="#ff8a3a"/><path d="M250 620 L450 320 L650 620 Z" fill="#ff6a2a"/><path d="M560 620 L720 400 L800 620 Z" fill="#e85a1a"/>' +
    '<rect width="' + W + '" height="180" y="620" fill="#d9531a"/>' +
    '<g transform="translate(470,470)"><circle cx="0" cy="0" r="80" fill="#c98a5e"/><circle cx="-26" cy="-12" r="7" fill="#2a1a10"/><circle cx="26" cy="-12" r="7" fill="#2a1a10"/>' +
    '<path d="M-28 18 Q0 48 28 18" stroke="#2a1a10" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-50 -10 q-10 40 0 70" stroke="#ff3a6a" stroke-width="14" fill="none" stroke-linecap="round"/></g>' +
    orbi(250, 560, 1.3),

    // 6 idea
    '<defs><radialGradient id="idea" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#ffe680"/><stop offset="100%" stop-color="#7a4bd0"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#idea)"/>' + stars(60, W, H) +
    orbi(400, 470, 2.4) +
    '<g transform="translate(560,250)"><circle r="44" fill="#fff" opacity=".9"/><text x="0" y="16" text-anchor="middle" font-size="54">💡</text></g>' +
    chispa(250, 300, 1.3),

    // 7 mar seco
    '<rect width="' + W + '" height="' + H + '" fill="#caa46a"/><rect width="' + W + '" height="300" fill="#9a7a4a" y="500"/>' +
    '<path d="M0 560 L800 560" stroke="#7a5a2a" stroke-width="3"/><path d="M150 600 L250 700 M400 580 L380 720 M600 610 L680 720" stroke="#7a5a2a" stroke-width="4" fill="none"/>' +
    stars(30, W, 400, '#fff7e0') +
    '<g transform="translate(420,360)"><path d="M-60 0 Q0 -80 60 0 Z" fill="#d98ad6"/><path d="M-50 0 q5 50 -2 70 M-20 4 q3 60 -2 80 M10 4 q3 60 -2 80 M40 0 q5 50 -2 70" stroke="#c06ac0" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<circle cx="-18" cy="-22" r="6" fill="#fff"/><circle cx="18" cy="-22" r="6" fill="#fff"/><circle cx="-18" cy="-22" r="3" fill="#000"/><circle cx="18" cy="-22" r="3" fill="#000"/></g>',

    // 8 mar azul
    '<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#56c8ff"/><stop offset="100%" stop-color="#1a6fd0"/></linearGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#sea)"/>' + stars(40, W, 300) +
    '<path d="M0 500 Q200 460 400 500 T800 500 V800 H0 Z" fill="#2a8fe0" opacity=".7"/><path d="M0 580 Q200 540 400 580 T800 580 V800 H0 Z" fill="#1a6fd0" opacity=".8"/>' +
    '<circle cx="200" cy="640" r="14" fill="#d98ad6"/><circle cx="560" cy="680" r="14" fill="#9b6bff"/><circle cx="380" cy="700" r="12" fill="#ffd84d"/>' +
    '<g transform="translate(420,300)"><path d="M-50 0 Q0 -66 50 0 Z" fill="#d98ad6"/><path d="M-40 0 q4 40 -2 56 M-12 3 q3 46 -2 60 M14 3 q3 46 -2 60 M40 0 q4 40 -2 56" stroke="#c06ac0" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M-14 -18 Q0 -8 14 -18" stroke="#000" stroke-width="3" fill="none"/></g>' + chispa(250, 250, 1.2),

    // 9 asteroide niños
    '<rect width="' + W + '" height="' + H + '" fill="#2a2438"/>' + stars(90, W, H) +
    '<ellipse cx="400" cy="660" rx="330" ry="120" fill="#5a5266"/><ellipse cx="300" cy="640" rx="26" ry="10" fill="#4a4256"/><ellipse cx="520" cy="680" rx="34" ry="12" fill="#4a4256"/>' +
    '<g transform="translate(320,560)"><circle cx="0" cy="-30" r="16" fill="#8a7a9a"/><rect x="-14" y="-16" width="28" height="34" rx="8" fill="#7a6a8a"/></g>' +
    '<g transform="translate(410,570)"><circle cx="0" cy="-30" r="16" fill="#9a8aaa"/><rect x="-14" y="-16" width="28" height="34" rx="8" fill="#8a7a9a"/></g>' +
    '<g transform="translate(500,560)"><circle cx="0" cy="-30" r="16" fill="#8a7a9a"/><rect x="-14" y="-16" width="28" height="34" rx="8" fill="#7a6a8a"/></g>',

    // 10 amarillo / risas
    '<defs><radialGradient id="sunp" cx="50%" cy="40%" r="75%"><stop offset="0%" stop-color="#fff4b0"/><stop offset="100%" stop-color="#ffce2e"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#sunp)"/><circle cx="400" cy="300" r="120" fill="#fff" opacity=".4"/><ellipse cx="400" cy="680" rx="340" ry="120" fill="#f2b300"/>' +
    '<g transform="translate(300,580)"><circle cx="0" cy="-30" r="18" fill="#c98a5e"/><rect x="-15" y="-14" width="30" height="34" rx="8" fill="#ff5a8a"/><path d="M-7 -32 Q0 -26 7 -32" stroke="#5a2a1a" stroke-width="3" fill="none"/></g>' +
    '<g transform="translate(500,580)"><circle cx="0" cy="-30" r="18" fill="#8a5a3a"/><rect x="-15" y="-14" width="30" height="34" rx="8" fill="#3ad1c8"/><path d="M-7 -32 Q0 -26 7 -32" stroke="#5a2a1a" stroke-width="3" fill="none"/></g>' +
    orbi(400, 560, 1.3) + chispa(580, 360, 1.6),

    // 11 secreto colores
    '<defs><radialGradient id="mg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#3a2a7a"/><stop offset="100%" stop-color="#120a30"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#mg)"/>' + stars(70, W, H) +
    '<circle cx="200" cy="220" r="34" fill="#ff5a8a"/><circle cx="620" cy="200" r="30" fill="#3ad1c8"/><circle cx="180" cy="560" r="28" fill="#ffd84d"/><circle cx="640" cy="560" r="32" fill="#9b6bff"/><circle cx="400" cy="160" r="24" fill="#ff8a3a"/><circle cx="400" cy="640" r="26" fill="#5ad15a"/>' +
    orbi(400, 430, 2.1),

    // 12 estela de colores
    '<rect width="' + W + '" height="' + H + '" fill="#1a1248"/>' + stars(70, W, H) +
    '<path d="M120 600 Q300 480 500 420 T780 240" stroke="#ff5a8a" stroke-width="16" fill="none" opacity=".8" stroke-linecap="round"/>' +
    '<path d="M120 630 Q300 510 500 450 T780 270" stroke="#3ad1c8" stroke-width="14" fill="none" opacity=".8" stroke-linecap="round"/>' +
    '<path d="M120 660 Q300 540 500 480 T780 300" stroke="#ffd84d" stroke-width="14" fill="none" opacity=".8" stroke-linecap="round"/>' +
    '<g transform="translate(700,230) rotate(35)"><path d="M0 -34 Q14 -16 14 14 L-14 14 Q-14 -16 0 -34 Z" fill="#e6edf3"/><circle cx="0" cy="-10" r="8" fill="#7fd4ff"/><path d="M-6 14 Q0 36 6 14 Z" fill="#ff8a3a"/></g>' +
    '<g transform="translate(180,560)"><circle r="14" fill="#ffd84d"/></g><g transform="translate(330,500)"><circle r="12" fill="#ff5a8a"/></g>',

    // 13 arcoíris vuelve
    '<defs><radialGradient id="rb" cx="50%" cy="50%" r="75%"><stop offset="0%" stop-color="#fff"/><stop offset="35%" stop-color="#ffd84d"/><stop offset="60%" stop-color="#ff5a8a"/><stop offset="100%" stop-color="#7a3bd0"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#rb)"/>' + stars(50, W, H) +
    planet(180, 220, 46, '#5ad15a', '#9af09a') + planet(640, 260, 54, '#ff5a8a', '#ff9ab8') + planet(220, 600, 50, '#7fd4ff', '#bfe9ff') + planet(620, 600, 42, '#b06bff', '#d9b8ff') +
    '<text x="400" y="430" text-anchor="middle" font-size="120">🌈</text>',

    // 14 ventana
    '<defs><linearGradient id="end" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a1248"/><stop offset="100%" stop-color="#3a2a7a"/></linearGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#end)"/>' + stars(110, W, H) +
    '<rect x="240" y="180" width="320" height="360" rx="16" fill="#0d0826" stroke="#5a4a9a" stroke-width="10"/><line x1="400" y1="180" x2="400" y2="540" stroke="#5a4a9a" stroke-width="6"/><line x1="240" y1="360" x2="560" y2="360" stroke="#5a4a9a" stroke-width="6"/>' +
    '<circle cx="330" cy="300" r="4" fill="#ffd84d"/><circle cx="470" cy="260" r="5" fill="#ff5a8a"/><circle cx="500" cy="440" r="4" fill="#3ad1c8"/><circle cx="300" cy="460" r="4" fill="#fff"/>' +
    '<g transform="translate(400,650)"><circle cx="0" cy="-40" r="30" fill="#3a2418"/><rect x="-34" y="-16" width="68" height="80" rx="20" fill="#7a4bd0"/><circle cx="0" cy="18" r="14" fill="#ffd84d" opacity=".9"/></g>',

    // 15 EL SOL (jefe de las estrellas, un poco mandón)
    '<defs><radialGradient id="solbg" cx="50%" cy="42%" r="80%"><stop offset="0%" stop-color="#fff3b0"/><stop offset="100%" stop-color="#ff8a2a"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#solbg)"/>' + stars(40, W, H) +
    '<g stroke="#ffd23a" stroke-width="14" stroke-linecap="round"><line x1="400" y1="190" x2="400" y2="120"/><line x1="400" y1="530" x2="400" y2="600"/><line x1="230" y1="360" x2="160" y2="360"/><line x1="570" y1="360" x2="640" y2="360"/><line x1="285" y1="245" x2="235" y2="195"/><line x1="515" y1="245" x2="565" y2="195"/><line x1="285" y1="475" x2="235" y2="525"/><line x1="515" y1="475" x2="565" y2="525"/></g>' +
    '<circle cx="400" cy="360" r="140" fill="#ffd23a" stroke="#ff9a2a" stroke-width="8"/>' +
    '<path d="M320 300 L382 322" stroke="#8a4a00" stroke-width="9" stroke-linecap="round"/><path d="M480 300 L418 322" stroke="#8a4a00" stroke-width="9" stroke-linecap="round"/>' +
    '<circle cx="356" cy="346" r="13" fill="#7a3b00"/><circle cx="444" cy="346" r="13" fill="#7a3b00"/>' +
    '<path d="M360 422 Q400 398 440 422" stroke="#8a4a00" stroke-width="9" fill="none" stroke-linecap="round"/>',

    // 16 EL ARCOÍRIS (jefe de los colores, bueno)
    '<defs><linearGradient id="rbsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#bfe9ff"/><stop offset="100%" stop-color="#eaf8ff"/></linearGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#rbsky)"/>' + stars(26, W, 280) +
    '<g fill="none" stroke-width="26"><path d="M120 640 A290 290 0 0 1 680 640" stroke="#ff5a5a"/><path d="M152 640 A258 258 0 0 1 648 640" stroke="#ff8a3a"/><path d="M184 640 A226 226 0 0 1 616 640" stroke="#ffd84d"/><path d="M216 640 A194 194 0 0 1 584 640" stroke="#5ad15a"/><path d="M248 640 A162 162 0 0 1 552 640" stroke="#3ad1c8"/><path d="M280 640 A130 130 0 0 1 520 640" stroke="#7a4bd0"/></g>' +
    '<circle cx="360" cy="470" r="13" fill="#333"/><circle cx="440" cy="470" r="13" fill="#333"/>' +
    '<path d="M352 500 Q400 545 448 500" stroke="#333" stroke-width="8" fill="none" stroke-linecap="round"/>' +
    '<circle cx="338" cy="492" r="9" fill="#ff8aa0" opacity=".6"/><circle cx="462" cy="492" r="9" fill="#ff8aa0" opacity=".6"/>' +
    '<ellipse cx="180" cy="690" rx="70" ry="26" fill="#fff" opacity=".9"/><ellipse cx="620" cy="700" rx="80" ry="28" fill="#fff" opacity=".9"/>',

    // 17 LA PELEA (Sol vs Arcoíris)
    '<rect width="' + W + '" height="' + H + '" fill="#2a2150"/>' + stars(60, W, H) +
    '<g><circle cx="170" cy="260" r="95" fill="#ffd23a" stroke="#ff9a2a" stroke-width="6"/><circle cx="145" cy="248" r="9" fill="#7a3b00"/><circle cx="195" cy="248" r="9" fill="#7a3b00"/><path d="M120 235 L165 250" stroke="#8a4a00" stroke-width="6" stroke-linecap="round"/><path d="M220 235 L175 250" stroke="#8a4a00" stroke-width="6" stroke-linecap="round"/><path d="M140 300 Q170 285 200 300" stroke="#8a4a00" stroke-width="7" fill="none"/></g>' +
    '<g stroke="#ff7a2a" stroke-width="11" stroke-linecap="round"><line x1="255" y1="290" x2="370" y2="380"/><line x1="262" y1="330" x2="372" y2="420"/></g>' +
    '<g fill="none" stroke-width="16"><path d="M560 580 A150 150 0 0 1 760 380" stroke="#ff5a5a"/><path d="M582 580 A128 128 0 0 1 740 402" stroke="#ffd84d"/><path d="M604 580 A106 106 0 0 1 720 424" stroke="#3ad1c8"/></g>' +
    '<g stroke-width="10" fill="none" stroke-linecap="round"><path d="M560 430 Q480 410 432 408" stroke="#ff5a8a"/><path d="M560 470 Q480 452 432 452" stroke="#7a4bd0"/></g>' +
    '<text x="402" y="430" text-anchor="middle" font-size="78">💥</text>',

    // 18 LAS PACES (Orbi en medio)
    '<defs><radialGradient id="peacebg" cx="50%" cy="45%" r="78%"><stop offset="0%" stop-color="#fff3c0"/><stop offset="100%" stop-color="#ffd0e0"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#peacebg)"/>' + stars(30, W, H) +
    '<g><circle cx="180" cy="300" r="90" fill="#ffd23a" stroke="#ff9a2a" stroke-width="6"/><circle cx="155" cy="290" r="9" fill="#7a3b00"/><circle cx="205" cy="290" r="9" fill="#7a3b00"/><path d="M150 320 Q180 350 210 320" stroke="#8a4a00" stroke-width="7" fill="none" stroke-linecap="round"/></g>' +
    '<g fill="none" stroke-width="16"><path d="M520 430 A130 130 0 0 1 760 430" stroke="#ff5a5a"/><path d="M545 430 A105 105 0 0 1 735 430" stroke="#ffd84d"/><path d="M570 430 A80 80 0 0 1 710 430" stroke="#3ad1c8"/></g>' +
    '<circle cx="610" cy="392" r="9" fill="#333"/><circle cx="670" cy="392" r="9" fill="#333"/><path d="M608 415 Q640 442 672 415" stroke="#333" stroke-width="7" fill="none" stroke-linecap="round"/>' +
    orbi(400, 600, 1.6) + '<text x="400" y="300" text-anchor="middle" font-size="48">🤝</text>',

    // 19 MUNDO MEJOR (sol + arcoíris juntos)
    '<defs><linearGradient id="finbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8ed0ff"/><stop offset="100%" stop-color="#eaf8d0"/></linearGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#finbg)"/>' +
    '<g stroke="#ffd23a" stroke-width="10" stroke-linecap="round"><line x1="170" y1="60" x2="170" y2="20"/><line x1="90" y1="140" x2="55" y2="140"/><line x1="250" y1="140" x2="285" y2="140"/><line x1="115" y1="85" x2="88" y2="58"/><line x1="225" y1="85" x2="252" y2="58"/></g>' +
    '<circle cx="170" cy="140" r="60" fill="#ffd23a" stroke="#ff9a2a" stroke-width="6"/><circle cx="155" cy="138" r="6" fill="#7a3b00"/><circle cx="185" cy="138" r="6" fill="#7a3b00"/><path d="M150 158 Q170 175 190 158" stroke="#7a3b00" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<g fill="none" stroke-width="20"><path d="M120 560 A300 300 0 0 1 720 560" stroke="#ff5a5a"/><path d="M150 560 A270 270 0 0 1 690 560" stroke="#ff8a3a"/><path d="M180 560 A240 240 0 0 1 660 560" stroke="#ffd84d"/><path d="M210 560 A210 210 0 0 1 630 560" stroke="#5ad15a"/><path d="M240 560 A180 180 0 0 1 600 560" stroke="#3ad1c8"/><path d="M270 560 A150 150 0 0 1 570 560" stroke="#7a4bd0"/></g>' +
    '<ellipse cx="250" cy="710" rx="330" ry="120" fill="#7ad17a"/><ellipse cx="600" cy="740" rx="330" ry="120" fill="#5ab85a"/>' + stars(18, W, 180),

    // 20 final familias
    '<defs><radialGradient id="fin" cx="50%" cy="40%" r="70%"><stop offset="0%" stop-color="#ffe9a8"/><stop offset="100%" stop-color="#ff9ab8"/></radialGradient></defs>' +
    '<rect width="' + W + '" height="' + H + '" fill="url(#fin)"/>' + stars(40, W, H) +
    '<text x="400" y="300" text-anchor="middle" font-size="120">🤲</text><circle cx="400" cy="250" r="26" fill="#fff" opacity=".8"/>' +
    '<text x="400" y="470" text-anchor="middle" font-size="58" fill="#a83a6a">' + T.theEnd + '</text>'
  ];

  // ---------- Estilos ----------
  var css = document.createElement("style");
  css.textContent = [
    "*{box-sizing:border-box;margin:0;padding:0}",
    "body{font-family:'Comic Sans MS','Trebuchet MS','Segoe UI',sans-serif;background:radial-gradient(circle at 50% 0%,#3a2a7a 0%,#1a1040 60%,#0d0826 100%);min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:20px 12px 70px;color:#fff}",
    "h1.brand{font-size:clamp(18px,4vw,28px);margin:6px 0 14px;color:#ffd84d;text-shadow:0 2px 0 #d98a00,0 0 18px rgba(255,200,60,.5);text-align:center}",
    ".langbar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;justify-content:center}",
    ".langbar a{text-decoration:none;font-size:13px;font-weight:bold;padding:6px 12px;border-radius:30px;background:rgba(255,255,255,.12);color:#cdbcff;border:1px solid rgba(255,255,255,.18)}",
    ".langbar a.on{background:#ffd84d;color:#5a3000;border-color:#ffd84d}",
    ".book{position:relative;width:min(92vw,760px);aspect-ratio:1/1;border-radius:26px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 0 8px rgba(255,255,255,.06);background:#000}",
    ".page{position:absolute;inset:0;display:none;flex-direction:column;justify-content:flex-end}",
    ".page.active{display:flex;animation:fade .5s ease}",
    "@keyframes fade{from{opacity:0;transform:scale(1.02)}to{opacity:1;transform:none}}",
    ".page svg{position:absolute;inset:0;width:100%;height:100%}",
    ".caption{position:relative;margin:14px;padding:16px 18px;background:rgba(255,255,255,.92);color:#222;border-radius:18px;font-size:clamp(15px,2.4vw,20px);line-height:1.45;text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.3);z-index:2}",
    ".caption b{color:#e0476b}",
    ".cover .title{position:absolute;top:6%;left:0;right:0;text-align:center;z-index:3;padding:0 10px}",
    ".cover .title .big{display:block;font-size:clamp(28px,8vw,60px);color:#fff;text-shadow:0 3px 0 #6a2bd6,0 0 22px rgba(120,80,255,.8);line-height:1}",
    ".cover .title .sub{display:inline-block;margin-top:10px;font-size:clamp(13px,2.6vw,20px);background:#ffd84d;color:#5a3000;padding:6px 14px;border-radius:30px;box-shadow:0 4px 0 #d98a00}",
    ".cover .ribbon{position:absolute;bottom:5%;left:0;right:0;text-align:center;z-index:3}",
    ".cover .ribbon span{background:#ff5a8a;color:#fff;padding:8px 18px;border-radius:30px;font-size:clamp(12px,2.4vw,17px);box-shadow:0 5px 0 #c72a5c}",
    ".controls{margin-top:18px;display:flex;align-items:center;gap:14px}",
    ".controls button{font-family:inherit;font-size:18px;font-weight:bold;border:none;cursor:pointer;background:#ffd84d;color:#5a3000;padding:12px 22px;border-radius:40px;box-shadow:0 5px 0 #d98a00}",
    ".controls button:active{transform:translateY(3px);box-shadow:0 2px 0 #d98a00}",
    ".controls button:disabled{opacity:.35;cursor:default}",
    ".counter{font-size:15px;color:#cdbcff;min-width:120px;text-align:center}",
    ".hint{margin-top:14px;color:#9a86d6;font-size:13px;text-align:center;max-width:600px}"
  ].join("");
  document.head.appendChild(css);

  // ---------- Construir la página ----------
  var LANGS = [
    { c: "es", label: "🇪🇸 Español", href: "libro.html" },
    { c: "en", label: "🇬🇧 English", href: "libro-en.html" },
    { c: "ca", label: "🟡 Català",  href: "libro-ca.html" },
    { c: "gl", label: "🔵 Galego",  href: "libro-gl.html" },
    { c: "eu", label: "🟢 Euskara", href: "libro-eu.html" }
  ];
  var here = (document.documentElement.lang || "es").slice(0, 2);

  var brand = document.createElement("h1");
  brand.className = "brand"; brand.textContent = T.brand;
  document.body.appendChild(brand);

  var langbar = document.createElement("div");
  langbar.className = "langbar";
  langbar.innerHTML = LANGS.map(function (l) {
    return '<a href="' + l.href + '"' + (l.c === here ? ' class="on"' : '') + '>' + l.label + '</a>';
  }).join("");
  document.body.appendChild(langbar);

  var book = document.createElement("div");
  book.className = "book"; book.id = "book";
  document.body.appendChild(book);

  var controls = document.createElement("div");
  controls.className = "controls";
  controls.innerHTML = '<button id="prev">' + T.prev + '</button><span class="counter" id="counter"></span><button id="next">' + T.next + '</button>';
  document.body.appendChild(controls);

  var hint = document.createElement("p");
  hint.className = "hint"; hint.textContent = T.hint;
  document.body.appendChild(hint);

  ART.forEach(function (art, i) {
    var div = document.createElement("div");
    var isCover = (i === 0);
    div.className = "page" + (i === 0 ? " active" : "") + (isCover ? " cover" : "");
    var st = STARLIST[i % STARLIST.length];
    var inner = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice">' + art + nstar(st.x, st.y, st.c, st.n) + '</svg>';
    if (isCover) {
      inner += '<div class="title"><span class="big">' + T.coverTitle + '</span><span class="sub">' + T.coverSub + '</span></div>' +
               '<div class="ribbon"><span>' + T.ribbon + '</span></div>';
    } else {
      inner += '<div class="caption">' + (T.captions[i] || "") + '</div>';
    }
    div.innerHTML = inner;
    book.appendChild(div);
  });

  // ---------- Navegación ----------
  var cur = 0;
  var pagesEls = book.querySelectorAll(".page");
  var total = pagesEls.length;
  var counter = document.getElementById("counter");
  var prevBtn = document.getElementById("prev");
  var nextBtn = document.getElementById("next");
  function show(n) {
    pagesEls[cur].classList.remove("active");
    cur = Math.max(0, Math.min(total - 1, n));
    pagesEls[cur].classList.add("active");
    counter.textContent = cur === 0 ? T.coverWord : (cur === total - 1 ? T.endWord : (T.pageWord + " " + cur + " / " + (total - 2)));
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur === total - 1;
  }
  prevBtn.onclick = function () { show(cur - 1); };
  nextBtn.onclick = function () { show(cur + 1); };
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") show(cur + 1);
    if (e.key === "ArrowLeft") show(cur - 1);
  });
  show(0);
})();
