/* Orbi — Libro 5: el Aire enfadado. Escenas SVG (window.ORBI_ART). */
(function () {
  var d = window.OrbiDraw; if (!d) return;
  var W = d.W, H = d.H;
  window.ORBI_ART = [
    // 0 Portada
    d.bg('a0', '#2a3a7a', '#0d1640') + d.stars(110, W, H) +
    '<path d="M120 250 Q400 200 680 250" stroke="#bfe3ff" stroke-width="10" fill="none" opacity=".5"/>' +
    d.whirl(400, 560, 2.0, 2, 'happy') + d.orbi(180, 600, 1.2) + d.chispa(640, 470, 1.3),

    // 1 planeta de cielos despeinados
    d.bg('a1', '#5aa0e0', '#bfe3ff') + d.stars(20, W, 200) +
    d.planet(400, 470, 150, '#8ec0f0', '#c9e6ff') +
    '<path d="M150 180 Q300 140 460 180 M360 250 Q520 210 660 250" stroke="#fff" stroke-width="8" fill="none" opacity=".7"/>' +
    d.whirl(400, 430, 1.0, 1, 'happy'),

    // 2 girando muy fuerte
    d.bg('a2', '#4a78c0', '#9ec6f0') +
    d.ground(620, '#7aa6d6') +
    '<g transform="translate(120,300) rotate(20)">' + d.kite(0, 0, 0.8) + '</g>' +
    '<path d="M600 200 l30 20 M650 300 l34 8" stroke="#3a5a8a" stroke-width="6" stroke-linecap="round"/>' +
    '<ellipse cx="640" cy="360" rx="26" ry="10" fill="#8a5a2a"/>' +
    d.whirl(400, 560, 2.2, 3, 'angry'),

    // 3 Orbi y Chispa en el cohete entre el vendaval
    d.bg('a3', '#3a5a9a', '#7fb0e0') + d.stars(20, W, 160) +
    '<path d="M40 300 Q260 240 480 300 M120 420 Q360 360 620 420" stroke="#dff1ff" stroke-width="7" fill="none" opacity=".6"/>' +
    '<g transform="translate(420,440) rotate(-12)">' + d.rocket(0, 0, 1.3) + '</g>' +
    d.orbi(250, 560, 1.2) + d.chispa(330, 380, 1.1),

    // 4 Orbi habla con Remo
    d.bg('a4', '#5a86c8', '#bfe0ff') + d.ground(640, '#84acd8') +
    d.whirl(560, 540, 1.5, 2, 'angry') + d.orbi(240, 560, 1.5),

    // 5 Orbi invita a un viaje tranquilo
    d.bg('a5', '#6a96d6', '#d8ecff') + d.ground(640, '#8fb6df') +
    d.orbi(260, 540, 1.5) +
    '<path d="M340 520 L520 520" stroke="#fff" stroke-width="6" stroke-dasharray="10 10" stroke-linecap="round"/>' +
    d.whirl(600, 540, 1.2, 1, 'calm'),

    // 6 Montaña del Silencio (calma)
    d.bg('a6', '#9ec6ee', '#eef7ff') +
    '<path d="M0 640 L220 360 L420 640 Z" fill="#cfe2f5"/><path d="M360 640 L560 380 L760 640 Z" fill="#bcd6ee"/>' +
    '<rect width="' + W + '" height="170" y="640" fill="#aecbe6"/>' +
    '<circle cx="200" cy="220" r="40" fill="#fff" opacity=".6"/><circle cx="600" cy="180" r="30" fill="#fff" opacity=".6"/>' +
    d.whirl(520, 560, 1.1, 1, 'calm') + d.orbi(280, 570, 1.3),

    // 7 Remo respira, más calmado
    d.bg('a7', '#8fb6e6', '#e6f2ff') +
    '<circle cx="400" cy="380" r="180" fill="#fff" opacity=".25"/>' +
    d.whirl(400, 540, 1.6, 1, 'calm'),

    // 8 La Cometa Vieja
    d.bg('a8', '#7fb0e0', '#dff0ff') + d.stars(14, W, 140) +
    d.kite(400, 360, 1.7) +
    '<path d="M150 600 Q400 560 660 600" stroke="#9ec6ee" stroke-width="6" fill="none" opacity=".6"/>',

    // 9 La cometa sube altísima
    d.bg('a9', '#5a90d8', '#cfe6ff') +
    '<g transform="translate(560,220)">' + d.kite(0, 0, 1.4) + '</g>' +
    '<path d="M560 280 Q420 460 380 560" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>' +
    d.whirl(320, 560, 1.2, 1, 'happy'),

    // 10 brisa suave que acaricia y lleva cometas
    d.bg('a10', '#86b4e6', '#eaf4ff') +
    '<path d="M80 300 Q300 250 520 300 T780 300" stroke="#bfe3ff" stroke-width="10" fill="none" opacity=".7"/>' +
    '<path d="M80 380 Q300 330 520 380 T780 380" stroke="#dff1ff" stroke-width="8" fill="none" opacity=".7"/>' +
    d.kite(220, 230, 0.9) + d.kite(620, 300, 0.8),

    // 11 Orbi explica con cariño
    d.bg('a11', '#6a96d6', '#d8ecff') + d.ground(650, '#8fb6df') +
    d.orbi(280, 560, 1.5) + d.whirl(560, 540, 1.2, 1, 'happy') +
    '<text x="430" y="250" text-anchor="middle" font-size="44">💙</text>',

    // 12 Remo se vuelve brisa suave azul celeste
    d.bg('a12', '#7fc0f0', '#eaf8ff') +
    '<path d="M120 360 Q300 300 480 360 T780 360" stroke="#bfe3ff" stroke-width="14" fill="none" opacity=".8" stroke-linecap="round"/>' +
    d.whirl(400, 540, 1.4, 0, 'calm'),

    // 13 pájaros vuelven, planeta tranquilo
    d.bg('a13', '#9ed0f4', '#eef9ff') + d.ground(640, '#8fc0e6') +
    '<path d="M180 230 q14 -14 28 0 q14 -14 28 0 M520 200 q14 -14 28 0 q14 -14 28 0" stroke="#3a5a8a" stroke-width="4" fill="none"/>' +
    d.orbi(400, 560, 1.3),

    // 14 cielo nocturno sereno, Orbi se despide
    d.bg('a14', '#1a2a5a', '#3a4a8a') + d.stars(120, W, H) +
    '<circle cx="620" cy="180" r="60" fill="#fff" opacity=".9"/><circle cx="595" cy="165" r="60" fill="#1a2a5a"/>' +
    d.orbi(400, 600, 1.7) + d.chispa(560, 470, 1.2)
  ];
})();
