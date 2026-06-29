/* Orbi — Libro 7: la Nube (Agua). Escenas SVG (window.ORBI_ART). */
(function () {
  var d = window.OrbiDraw; if (!d) return;
  var W = d.W, H = d.H;
  function dryflower(x, y, c) {
    return '<g transform="translate(' + x + ',' + y + ')"><path d="M0 0 q-6 24 -2 40" stroke="#9a7a4a" stroke-width="4" fill="none"/><path d="M0 0 q-16 -10 -22 2 q14 6 22 -2 Z" fill="' + (c || '#caa46a') + '"/></g>';
  }
  function flower(x, y, c) {
    return '<g transform="translate(' + x + ',' + y + ')"><line x1="0" y1="0" x2="0" y2="-40" stroke="#4a9a4a" stroke-width="5"/><circle cx="0" cy="-46" r="14" fill="' + (c || '#ff8ab0') + '"/><circle cx="0" cy="-46" r="6" fill="#ffd84d"/></g>';
  }
  window.ORBI_ART = [
    // 0 Portada
    d.bg('w0', '#1a3a6a', '#0d2040') + d.stars(80, W, H) +
    d.cloud(400, 360, 1.7, 'happy', true) + d.orbi(190, 620, 1.2) + d.chispa(630, 500, 1.3),

    // 1 planeta polvoriento con sed
    d.bg('w1', '#caa46a', '#9a7a4a') +
    '<rect width="' + W + '" height="220" y="580" fill="#9a7a4a"/>' +
    '<path d="M150 640 L250 740 M420 600 L400 740 M620 630 L690 740" stroke="#7a5a2a" stroke-width="4" fill="none"/>' +
    dryflower(230, 600) + dryflower(560, 610, '#b8945a') + dryflower(400, 600),

    // 2 Nimbo arriba guardando su lluvia
    d.bg('w2', '#7ab0e0', '#cfe6ff') + d.stars(12, W, 120) +
    d.ground(660, '#caa46a') + d.cloud(420, 280, 1.5, 'angry', false),

    // 3 Orbi y Chispa suben en el cohete
    d.bg('w3', '#5a90d8', '#bfe0ff') + d.stars(14, W, 140) +
    '<g transform="translate(420,450) rotate(-8)">' + d.rocket(0, 0, 1.3) + '</g>' +
    d.cloud(640, 200, 0.8, 'angry', false) + d.orbi(230, 580, 1.2) + d.chispa(320, 400, 1.1),

    // 4 Orbi habla con Nimbo señalando abajo
    d.bg('w4', '#6a9ad8', '#d8ecff') + d.ground(660, '#caa46a') +
    d.cloud(540, 280, 1.2, 'angry', false) + d.orbi(250, 580, 1.5),

    // 5 Orbi anima a soltar una gotita
    d.bg('w5', '#6a9ad8', '#d8ecff') +
    d.cloud(540, 300, 1.2, 'calm', false) + d.orbi(250, 560, 1.5) +
    '<path d="M540 360 l0 60" stroke="#7fd4ff" stroke-width="4" stroke-dasharray="6 8"/>',

    // 6 una gota cae sobre una flor mustia que se abre
    d.bg('w6', '#7fb0e6', '#eaf4ff') + d.ground(660, '#b89a64') +
    d.cloud(400, 240, 1.1, 'happy', false) +
    '<path d="M400 300 q-6 12 0 18 q6 -6 0 -18 Z" fill="#7fd4ff"/>' +
    flower(400, 600, '#ff8ab0'),

    // 7 Nimbo sorprendido, sigue casi lleno
    d.bg('w7', '#7ab0e0', '#dff0ff') +
    d.cloud(400, 320, 1.6, 'happy', false) + flower(400, 640, '#ffd84d'),

    // 8 lluvia suave: ríos, animales, niños
    d.bg('w8', '#6aa0dc', '#cfe6ff') +
    d.cloud(400, 220, 1.5, 'happy', true) +
    '<path d="M0 660 Q200 620 400 660 T800 660 V800 H0 Z" fill="#3a8fe0" opacity=".8"/>' +
    flower(160, 640, '#ff8ab0') + flower(640, 650, '#9b6bff'),

    // 9 ciclo: sol calienta, vapor sube, Nimbo se llena
    d.bg('w9', '#86c0ee', '#eaf6ff') +
    '<circle cx="660" cy="160" r="60" fill="#ffd84d"/><g stroke="#ffd84d" stroke-width="6" stroke-linecap="round"><line x1="660" y1="70" x2="660" y2="40"/><line x1="740" y1="160" x2="775" y2="160"/></g>' +
    d.cloud(280, 280, 1.3, 'happy', false) +
    '<path d="M300 520 q-10 -40 6 -80 M360 540 q-10 -50 6 -90" stroke="#cfe6ff" stroke-width="6" fill="none" opacity=".8"/>',

    // 10 Nimbo entiende, contempla la lluvia que vuelve
    d.bg('w10', '#6aa0dc', '#dff0ff') +
    d.cloud(400, 320, 1.5, 'happy', true) + '<text x="400" y="640" text-anchor="middle" font-size="40">💧</text>',

    // 11 Orbi explica con ternura
    d.bg('w11', '#6a9ad8', '#d8ecff') + d.ground(660, '#9ec46e') +
    d.orbi(280, 560, 1.5) + d.cloud(560, 280, 1.1, 'happy', false) +
    '<text x="430" y="240" text-anchor="middle" font-size="44">💙</text>',

    // 12 Nimbo grande, generoso, azul brillante
    d.bg('w12', '#3a8fe0', '#bfe6ff') +
    d.cloud(400, 320, 1.9, 'happy', true),

    // 13 planeta florecido, verde y fresco
    d.bg('w13', '#8fd0f4', '#eafbff') + d.ground(640, '#6ec46e') +
    flower(200, 600, '#ff8ab0') + flower(330, 620, '#ffd84d') + flower(480, 610, '#9b6bff') + flower(620, 600, '#ff5a8a') +
    d.orbi(400, 560, 1.2),

    // 14 cielo nocturno sereno; Orbi se despide
    d.bg('w14', '#16306a', '#2a4a8a') + d.stars(120, W, H) +
    '<circle cx="620" cy="180" r="58" fill="#fff" opacity=".9"/><circle cx="596" cy="166" r="58" fill="#16306a"/>' +
    d.orbi(400, 600, 1.7) + d.chispa(560, 470, 1.2)
  ];
})();
