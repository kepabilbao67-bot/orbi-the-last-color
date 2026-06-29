/* Orbi — Libro 6: la Llamita (Fuego). Escenas SVG (window.ORBI_ART). */
(function () {
  var d = window.OrbiDraw; if (!d) return;
  var W = d.W, H = d.H;
  function snow(n) {
    var s = '';
    for (var i = 0; i < n; i++) { s += '<circle cx="' + (Math.random() * W).toFixed(0) + '" cy="' + (Math.random() * H).toFixed(0) + '" r="' + (Math.random() * 2 + 1).toFixed(1) + '" fill="#fff" opacity=".8"/>'; }
    return s;
  }
  window.ORBI_ART = [
    // 0 Portada
    d.bg('f0', '#1a2450', '#0d1230') + d.stars(90, W, H) +
    '<g transform="translate(0,40)">' + d.flame(400, 540, 2.0, 'happy') + '</g>' +
    d.orbi(190, 600, 1.2) + d.chispa(630, 470, 1.3),

    // 1 Planeta de la Escarcha, triste
    d.bg('f1', '#3a4a70', '#9ab4d0') + snow(60) +
    '<path d="M0 640 L240 420 L460 640 Z" fill="#cfe0ee"/><path d="M380 640 L600 440 L800 640 Z" fill="#bcd0e2"/>' +
    '<rect width="' + W + '" height="170" y="640" fill="#e6eef6"/>' +
    '<rect x="360" y="500" width="90" height="120" rx="10" fill="#22304e"/><circle cx="405" cy="560" r="14" fill="#ffd84d" opacity=".5"/>',

    // 2 llamita temblando en la cueva
    d.bg('f2', '#22304e', '#10182e') + snow(20) +
    '<path d="M250 640 Q400 360 550 640 Z" fill="#1a2238"/>' +
    d.flame(400, 600, 0.8, 'sad'),

    // 3 Orbi y Chispa aterrizan en la nieve
    d.bg('f3', '#3a4a70', '#aac2dc') + snow(50) +
    '<rect width="' + W + '" height="170" y="640" fill="#eef4fb"/>' +
    '<g transform="translate(430,470)">' + d.rocket(0, 0, 1.3) + '</g>' +
    d.orbi(240, 580, 1.2) + d.chispa(320, 400, 1.1),

    // 4 Orbi habla con Ascua
    d.bg('f4', '#2a3654', '#5a6e92') + snow(20) +
    d.flame(560, 560, 1.0, 'sad') + d.orbi(250, 560, 1.5),

    // 5 Orbi propone probar algo
    d.bg('f5', '#33415f', '#6a82a8') + snow(20) +
    d.orbi(260, 540, 1.5) +
    '<path d="M340 520 L520 520" stroke="#ffd84d" stroke-width="6" stroke-dasharray="10 10" stroke-linecap="round"/>' +
    d.flame(600, 560, 1.0, 'calm'),

    // 6 pajarito aterido junto a Ascua
    d.bg('f6', '#2e3a58', '#6e86aa') + snow(26) +
    d.flame(440, 560, 1.2, 'happy') +
    '<g transform="translate(250,560)"><ellipse cx="0" cy="0" rx="26" ry="22" fill="#8ab0d8"/><circle cx="14" cy="-8" r="14" fill="#9cc0e6"/><circle cx="18" cy="-10" r="3" fill="#222"/><path d="M30 -8 l12 4 l-12 4 Z" fill="#ffae3a"/></g>',

    // 7 Ascua brilla un poco más, sorprendida
    d.bg('f7', '#2a3654', '#5a7098') +
    '<circle cx="400" cy="520" r="170" fill="#ffd84d" opacity=".22"/>' +
    d.flame(400, 560, 1.4, 'happy'),

    // 8 una niña triste y sola; Ascua le da calor
    d.bg('f8', '#33415f', '#6e86aa') + snow(18) +
    '<g transform="translate(250,560)"><circle cx="0" cy="-34" r="22" fill="#e0b48a"/><rect x="-22" y="-12" width="44" height="56" rx="14" fill="#5a6cc0"/><path d="M-8 -38 Q0 -30 8 -38" stroke="#5a3b2a" stroke-width="3" fill="none"/></g>' +
    d.flame(520, 560, 1.1, 'happy'),

    // 9 la niña sonríe y da la mano
    d.bg('f9', '#3a4a6e', '#86a0c4') + snow(14) +
    '<g transform="translate(300,560)"><circle cx="0" cy="-34" r="22" fill="#e0b48a"/><rect x="-22" y="-12" width="44" height="56" rx="14" fill="#ff8ab0"/><path d="M-8 -40 Q0 -32 8 -40" stroke="#5a3b2a" stroke-width="3" fill="none"/></g>' +
    d.flame(500, 560, 1.2, 'happy') + '<text x="400" y="300" text-anchor="middle" font-size="40">💛</text>',

    // 10 Ascua rodeada de quienes tienen frío
    d.bg('f10', '#2e3a58', '#6e86aa') + snow(20) +
    d.flame(400, 560, 1.5, 'happy') +
    '<circle cx="220" cy="600" r="18" fill="#9cc0e6"/><circle cx="600" cy="600" r="18" fill="#e0b48a"/><circle cx="160" cy="520" r="14" fill="#c9a0e0"/><circle cx="650" cy="520" r="14" fill="#8ab0d8"/>',

    // 11 Orbi explica con ternura
    d.bg('f11', '#33415f', '#7a92b6') + snow(16) +
    d.orbi(280, 560, 1.5) + d.flame(560, 560, 1.2, 'happy') +
    '<text x="430" y="250" text-anchor="middle" font-size="44">✨</text>',

    // 12 Ascua crece justo lo necesario, dorada y acogedora
    d.bg('f12', '#3a2a1a', '#a8662a') +
    '<circle cx="400" cy="520" r="220" fill="#ffd84d" opacity=".25"/>' +
    d.flame(400, 560, 1.7, 'happy'),

    // 13 planeta lleno de hogueras compartidas
    d.bg('f13', '#2a2440', '#6a5a8a') + d.stars(30, W, 300) +
    d.ground(650, '#5a4a72') +
    d.flame(220, 580, 0.8, 'happy') + d.flame(400, 600, 0.9, 'happy') + d.flame(580, 580, 0.8, 'happy'),

    // 14 cielo nocturno cálido; Orbi se despide
    d.bg('f14', '#2a1a3a', '#5a3a5a') + d.stars(110, W, H) +
    '<circle cx="620" cy="180" r="56" fill="#ffe9a8" opacity=".9"/>' +
    d.orbi(400, 600, 1.7) + d.chispa(560, 470, 1.2)
  ];
})();
