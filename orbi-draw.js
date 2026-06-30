/* ============================================================
   Orbi — Funciones de dibujo compartidas (window.OrbiDraw)
   Las usan los ficheros art-N.js para construir cada escena en SVG.
   Reutiliza los personajes del Libro 1 (Orbi, Chispa, planetas) y
   añade figuras nuevas: torbellino, llama, nube y brote/árbol.
   ============================================================ */
(function () {
  "use strict";
  var W = 800, H = 800;

  function stars(n, w, h, color) {
    var palette = ['#ffffff', '#ffffff', '#ffd84d', '#ff5a8a', '#3ad1c8', '#9b6bff', '#7fd4ff', '#ff8a3a', '#5ad15a'];
    var s = '';
    for (var i = 0; i < n; i++) {
      var x = Math.random() * w, y = Math.random() * h, r = Math.random() * 2.4 + 0.7;
      var c = color || palette[Math.floor(Math.random() * palette.length)];
      s += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + r.toFixed(1) + '" fill="' + c + '" opacity="' + (Math.random() * 0.6 + 0.4).toFixed(2) + '"/>';
    }
    return s;
  }

  function bg(id, c1, c2) {
    return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + c1 + '"/><stop offset="100%" stop-color="' + c2 + '"/></linearGradient></defs>' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#' + id + ')"/>';
  }

  function ground(cy, color) {
    return '<ellipse cx="400" cy="' + (cy + 120) + '" rx="520" ry="170" fill="' + color + '"/>';
  }

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

  function rocket(x, y, sc) {
    sc = sc || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">' +
      '<path d="M0 -120 Q40 -60 40 40 L-40 40 Q-40 -60 0 -120 Z" fill="#e6edf3"/>' +
      '<path d="M0 -120 Q40 -60 40 40 L0 40 Z" fill="#cdd6df"/>' +
      '<circle cx="0" cy="-40" r="22" fill="#7fd4ff" stroke="#3a8fc0" stroke-width="5"/>' +
      '<path d="M-40 20 L-70 70 L-30 50 Z" fill="#ff5a8a"/><path d="M40 20 L70 70 L30 50 Z" fill="#ff5a8a"/>' +
      '<path d="M-18 40 Q0 110 18 40 Z" fill="#ffd84d"/><path d="M-10 40 Q0 80 10 40 Z" fill="#ff8a3a"/></g>';
  }

  function face(cx, cy, r, eye, mood) {
    // mood: 'happy' | 'sad' | 'angry' | 'calm'
    eye = eye || '#2a2a33';
    var ex = r * 0.32, ey = -r * 0.12, er = Math.max(3, r * 0.11);
    var s = '<circle cx="' + (cx - ex) + '" cy="' + (cy + ey) + '" r="' + er + '" fill="' + eye + '"/>' +
      '<circle cx="' + (cx + ex) + '" cy="' + (cy + ey) + '" r="' + er + '" fill="' + eye + '"/>';
    var my = cy + r * 0.32, mx = r * 0.3;
    if (mood === 'sad') s += '<path d="M' + (cx - mx) + ' ' + (my + 8) + ' Q' + cx + ' ' + (my - 8) + ' ' + (cx + mx) + ' ' + (my + 8) + '" stroke="' + eye + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    else if (mood === 'angry') s += '<path d="M' + (cx - mx) + ' ' + (my + 6) + ' Q' + cx + ' ' + (my - 6) + ' ' + (cx + mx) + ' ' + (my + 6) + '" stroke="' + eye + '" stroke-width="4" fill="none" stroke-linecap="round"/><line x1="' + (cx - ex - 8) + '" y1="' + (cy + ey - 12) + '" x2="' + (cx - ex + 6) + '" y2="' + (cy + ey - 6) + '" stroke="' + eye + '" stroke-width="3"/><line x1="' + (cx + ex + 8) + '" y1="' + (cy + ey - 12) + '" x2="' + (cx + ex - 6) + '" y2="' + (cy + ey - 6) + '" stroke="' + eye + '" stroke-width="3"/>';
    else s += '<path d="M' + (cx - mx) + ' ' + my + ' Q' + cx + ' ' + (my + 14) + ' ' + (cx + mx) + ' ' + my + '" stroke="' + eye + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    s += '<circle cx="' + (cx - r * 0.5) + '" cy="' + (cy + r * 0.18) + '" r="' + (r * 0.13) + '" fill="#ff8aa0" opacity=".5"/>' +
      '<circle cx="' + (cx + r * 0.5) + '" cy="' + (cy + r * 0.18) + '" r="' + (r * 0.13) + '" fill="#ff8aa0" opacity=".5"/>';
    return s;
  }

  // ---------- Figuras nuevas ----------
  // Torbellino (Aire / Remo). intensity 0..3 — cono de bandas en espiral
  function whirl(x, y, sc, intensity, mood) {
    sc = sc || 1; intensity = intensity == null ? 2 : intensity;
    var wob = 4 + intensity * 4;
    var bands = '';
    for (var i = 0; i < 7; i++) {
      var cy = -118 + i * 38, rx = 132 - i * 16, dx = (i % 2 ? wob : -wob);
      bands += '<ellipse cx="' + dx + '" cy="' + cy + '" rx="' + rx + '" ry="27" fill="' + (i % 2 ? "#cfeaff" : "#e6f4ff") + '" stroke="#bfe3ff" stroke-width="2"/>';
    }
    return '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">' + bands +
      '<g transform="translate(0,-126)"><circle cx="0" cy="0" r="44" fill="#f2f9ff"/>' + face(0, 0, 42, '#3a6a9a', mood || 'happy') + '</g></g>';
  }

  // Llama (Fuego / Ascua)
  function flame(x, y, sc, mood) {
    sc = sc || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">' +
      '<path d="M0 -114 C54 -62 48 32 0 62 C-48 32 -54 -62 0 -114 Z" fill="#ff8a3a"/>' +
      '<path d="M0 -72 C32 -36 28 30 0 50 C-28 30 -32 -36 0 -72 Z" fill="#ffd84d"/>' +
      '<path d="M0 -34 C14 -14 12 22 0 34 C-12 22 -14 -14 0 -34 Z" fill="#fff3b0"/>' +
      face(0, 6, 28, '#8a3b00', mood || 'happy') +
      '<circle cx="-64" cy="-28" r="5" fill="#ffd84d"/><circle cx="62" cy="-56" r="4" fill="#ffb84d"/><circle cx="50" cy="8" r="3" fill="#fff3b0"/>' +
      '</g>';
  }

  // Nube (Agua / Nimbo). rain: true/false
  function cloud(x, y, sc, mood, rain) {
    sc = sc || 1;
    var drops = '';
    if (rain) {
      for (var i = -2; i <= 2; i++) {
        drops += '<path d="M' + (i * 34) + ' 60 q-7 14 0 22 q7 -8 0 -22 Z" fill="#7fd4ff"/>';
      }
    }
    return '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">' +
      '<g fill="#eef6ff" stroke="#cfe2f2" stroke-width="3">' +
      '<circle cx="-58" cy="10" r="42"/><circle cx="0" cy="-18" r="54"/><circle cx="60" cy="8" r="44"/>' +
      '<rect x="-96" y="6" width="196" height="48" rx="24"/></g>' +
      '<g transform="translate(0,-6)">' + face(0, 0, 40, '#4a7aa0', mood || 'happy') + '</g>' + drops + '</g>';
  }

  // Brote / planta / árbol (Tierra / Brote). stage 0=semilla,1=brote,2=planta,3=árbol
  function sprout(x, y, sc, stage, mood) {
    sc = sc || 1; stage = stage || 0;
    var g = '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">';
    if (stage === 0) {
      g += '<ellipse cx="0" cy="0" rx="34" ry="44" fill="#caa46a" stroke="#a8814a" stroke-width="4"/>' + face(0, 4, 30, '#5a3b1a', mood || 'sad');
    } else if (stage === 1) {
      g += '<path d="M0 60 L0 -10" stroke="#5ab85a" stroke-width="10" stroke-linecap="round"/>' +
        '<path d="M0 0 Q34 -10 40 -36 Q10 -28 0 0 Z" fill="#7ad17a"/>' +
        '<g transform="translate(0,-24)">' + face(0, 0, 22, '#2a6a2a', mood || 'happy') + '</g>';
    } else if (stage === 2) {
      g += '<path d="M0 90 L0 -30" stroke="#4a9a4a" stroke-width="14" stroke-linecap="round"/>' +
        '<path d="M0 10 Q44 0 56 -34 Q14 -26 0 10 Z" fill="#7ad17a"/>' +
        '<path d="M0 -10 Q-44 -20 -56 -54 Q-14 -46 0 -10 Z" fill="#8ad98a"/>' +
        '<circle cx="0" cy="-46" r="20" fill="#ff8ab0"/><circle cx="0" cy="-46" r="8" fill="#ffd84d"/>';
    } else {
      g += '<rect x="-16" y="-20" width="32" height="120" rx="12" fill="#8a5a2a"/>' +
        '<circle cx="0" cy="-70" r="80" fill="#5ab85a"/><circle cx="-56" cy="-40" r="50" fill="#6ec46e"/><circle cx="56" cy="-40" r="50" fill="#6ec46e"/>' +
        '<circle cx="-18" cy="-90" r="8" fill="#ffd84d"/><circle cx="28" cy="-70" r="8" fill="#ff8ab0"/>';
    }
    return g + '</g>';
  }

  function kite(x, y, sc) {
    sc = sc || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + sc + ')">' +
      '<polygon points="0,-50 40,0 0,50 -40,0" fill="#ff5a8a" stroke="#fff" stroke-width="3"/>' +
      '<line x1="0" y1="-50" x2="0" y2="50" stroke="#fff" stroke-width="2"/><line x1="-40" y1="0" x2="40" y2="0" stroke="#fff" stroke-width="2"/>' +
      '<path d="M0 50 q10 20 -4 34 q14 6 4 28" stroke="#ffd84d" stroke-width="3" fill="none"/></g>';
  }

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

  var STARLIST = [
    { n: 'Lumi', c: '#ffd84d', x: 120, y: 120 }, { n: 'Rubí', c: '#ff5a5a', x: 680, y: 118 },
    { n: 'Coral', c: '#ff5a8a', x: 130, y: 250 }, { n: 'Aqua', c: '#3ad1c8', x: 690, y: 250 },
    { n: 'Cielo', c: '#7fd4ff', x: 400, y: 110 }, { n: 'Violeta', c: '#9b6bff', x: 120, y: 400 },
    { n: 'Hoja', c: '#5ad15a', x: 690, y: 400 }, { n: 'Bruno', c: '#ff8a3a', x: 250, y: 120 },
    { n: 'Perla', c: '#ffffff', x: 560, y: 120 }, { n: 'Estela', c: '#ffd84d', x: 690, y: 540 },
    { n: 'Lila', c: '#c89bff', x: 120, y: 540 }, { n: 'Nube', c: '#eaf6ff', x: 400, y: 130 }
  ];

  window.OrbiDraw = {
    W: W, H: H, stars: stars, bg: bg, ground: ground, orbi: orbi, chispa: chispa,
    planet: planet, rocket: rocket, face: face, whirl: whirl, flame: flame,
    cloud: cloud, sprout: sprout, kite: kite, nstar: nstar, STARLIST: STARLIST
  };
})();
