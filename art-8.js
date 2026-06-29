/* Orbi — Libro 8: la Semilla (Tierra). Escenas SVG (window.ORBI_ART). */
(function () {
  var d = window.OrbiDraw; if (!d) return;
  var W = d.W, H = d.H;
  function soil(y) { return '<rect width="' + W + '" height="' + (H - y) + '" y="' + y + '" fill="#8a5a2a"/><path d="M0 ' + y + ' Q400 ' + (y - 24) + ' 800 ' + y + '" fill="#9a6a34"/>'; }
  window.ORBI_ART = [
    // 0 Portada
    d.bg('t0', '#2a4a2a', '#0d2010') + d.stars(70, W, H) +
    soil(640) + d.sprout(400, 600, 1.8, 1, 'happy') +
    '<g opacity=".4">' + d.sprout(620, 600, 1.6, 3) + '</g>' +
    d.orbi(190, 600, 1.2) + d.chispa(630, 470, 1.3),

    // 1 planeta de tierra desnuda
    d.bg('t1', '#caa46a', '#a8814a') + soil(560) +
    '<path d="M150 600 l30 -10 M420 620 l24 -8 M640 600 l28 -10" stroke="#7a5a2a" stroke-width="4"/>',

    // 2 bajo el suelo, la semillita impaciente
    '<rect width="' + W + '" height="' + H + '" fill="#8a5a2a"/>' +
    '<path d="M0 220 Q400 190 800 220" fill="#caa46a"/><rect width="' + W + '" height="220" fill="#caa46a"/>' +
    d.sprout(400, 470, 1.8, 0, 'angry'),

    // 3 Orbi y Chispa aterrizan junto a la tierra
    d.bg('t3', '#9ec0e6', '#dff0ff') + soil(640) +
    '<g transform="translate(430,470)">' + d.rocket(0, 0, 1.3) + '</g>' +
    d.orbi(240, 580, 1.2) + d.chispa(330, 400, 1.1),

    // 4 Orbi con la oreja en el suelo, habla con Brote
    d.bg('t4', '#aecbe6', '#eaf4ff') + soil(600) +
    d.orbi(300, 540, 1.5) +
    '<g transform="translate(540,560)">' + d.sprout(0, 0, 0.9, 0, 'angry') + '</g>',

    // 5 Orbi riega con una gotita y un rayo de sol
    d.bg('t5', '#bfe0ff', '#eef8ff') + soil(620) +
    '<circle cx="660" cy="150" r="50" fill="#ffd84d"/><g stroke="#ffd84d" stroke-width="6" stroke-linecap="round"><line x1="660" y1="70" x2="660" y2="44"/><line x1="740" y1="150" x2="772" y2="150"/></g>' +
    d.orbi(260, 540, 1.4) +
    '<path d="M430 470 l0 70" stroke="#7fd4ff" stroke-width="4" stroke-dasharray="6 8"/>' +
    '<g transform="translate(540,560)">' + d.sprout(0, 0, 0.9, 0, 'calm') + '</g>',

    // 6 una puntita verde asoma
    d.bg('t6', '#c0e6ff', '#eef9ff') + soil(560) +
    d.sprout(400, 560, 1.3, 1, 'happy') + d.orbi(220, 520, 1.1),

    // 7 Brote impaciente; Orbi la calma
    d.bg('t7', '#bfe0ff', '#eef6ff') + soil(600) +
    d.orbi(280, 540, 1.4) + '<g transform="translate(540,560)">' + d.sprout(0, 0, 1.0, 1, 'angry') + '</g>' +
    '<text x="430" y="250" text-anchor="middle" font-size="40">⏳</text>',

    // 8 secuencia de crecimiento día a día
    d.bg('t8', '#cfe6ff', '#f0f9ff') + soil(640) +
    '<g transform="translate(180,640)">' + d.sprout(0, 0, 0.7, 0) + '</g>' +
    '<g transform="translate(330,640)">' + d.sprout(0, 0, 0.8, 1) + '</g>' +
    '<g transform="translate(500,640)">' + d.sprout(0, 0, 0.9, 1) + '</g>' +
    '<g transform="translate(650,640)">' + d.sprout(0, 0, 0.9, 2) + '</g>',

    // 9 una plantita fuerte con flores; Brote orgullosa
    d.bg('t9', '#bfe6ff', '#eef9ff') + soil(620) +
    d.sprout(400, 620, 1.6, 2, 'happy'),

    // 10 Brote pensativa, comprende esperar
    d.bg('t10', '#cfe6ff', '#f0f9ff') + soil(620) +
    d.sprout(400, 620, 1.4, 2, 'calm') + '<text x="560" y="360" text-anchor="middle" font-size="38">💭</text>',

    // 11 Orbi explica con ternura
    d.bg('t11', '#bfe0ff', '#eef6ff') + soil(620) +
    d.orbi(280, 560, 1.5) + '<g transform="translate(560,580)">' + d.sprout(0, 0, 1.2, 2, 'happy') + '</g>' +
    '<text x="430" y="250" text-anchor="middle" font-size="44">💚</text>',

    // 12 las estaciones giran y crece el árbol
    d.bg('t12', '#9ed0f4', '#eafbff') + soil(660) +
    d.sprout(400, 660, 2.0, 3) +
    '<text x="150" y="200" font-size="34">🌸</text><text x="650" y="200" font-size="34">❄️</text><text x="150" y="560" font-size="34">🍂</text><text x="650" y="560" font-size="34">☀️</text>',

    // 13 gran árbol con nidos; niños y animales
    d.bg('t13', '#9ed0f4', '#eafbff') + d.ground(640, '#6ec46e') +
    d.sprout(400, 600, 2.2, 3) +
    '<g transform="translate(220,620)"><circle cx="0" cy="-24" r="16" fill="#e0b48a"/><rect x="-14" y="-8" width="28" height="34" rx="8" fill="#ff8ab0"/></g>' +
    '<g transform="translate(600,630)"><ellipse cx="0" cy="0" rx="24" ry="16" fill="#caa46a"/><circle cx="16" cy="-10" r="10" fill="#caa46a"/></g>',

    // 14 atardecer cálido; Orbi se despide
    d.bg('t14', '#ff9a5a', '#ffd0a0') + d.ground(650, '#6ea84e') +
    '<circle cx="400" cy="260" r="70" fill="#fff" opacity=".5"/>' +
    d.orbi(400, 600, 1.7) + d.chispa(560, 470, 1.2)
  ];
})();
