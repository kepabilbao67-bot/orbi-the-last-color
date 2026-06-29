/* ============================================================
   Orbi — Motor del lector (genérico, multi-libro).
   Lee:
     window.ORBI_TEXT  -> textos del idioma (captions, portada, etc.)
     window.ORBI_ART   -> escenas SVG (índice 0 = portada)
     window.ORBI_LANGS -> [{c,label,href}] para la barra de idiomas
   Reutiliza window.OrbiDraw para el overlay de estrellas con nombre.
   ============================================================ */
(function () {
  "use strict";
  var T = window.ORBI_TEXT;
  var ART = window.ORBI_ART;
  var D = window.OrbiDraw;
  if (!T || !ART || !D) { return; }
  var W = D.W, H = D.H;
  var here = (document.documentElement.lang || "es").slice(0, 2);

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
    ".caption b{color:#e0476b}.caption i{color:#7a4bd0;font-style:normal;font-weight:bold}",
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
    ".hint{margin-top:14px;color:#9a86d6;font-size:13px;text-align:center;max-width:600px}",
    ".sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}",
    ".toolbar{margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center}",
    ".toolbar button{font-family:inherit;font-size:14px;font-weight:bold;border:none;cursor:pointer;background:rgba(255,255,255,.12);color:#cdbcff;border:1px solid rgba(255,255,255,.2);padding:9px 14px;border-radius:30px}",
    ".toolbar button:hover{background:rgba(255,255,255,.22)}",
    "body.night{filter:brightness(.55) saturate(.85)}",
    ".palette{position:absolute;left:0;right:0;bottom:10px;z-index:4;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;padding:0 10px}",
    ".swatch{width:34px;height:34px;border-radius:50%;border:3px solid #fff;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.4)}",
    ".swatch.sel{transform:scale(1.25);outline:2px solid #ffd84d}",
    ".swatch.eraser{background:#fff;font-size:16px;display:flex;align-items:center;justify-content:center}",
    ".fillable{cursor:pointer}",
    "@media print{body{background:#fff!important;filter:none!important}.brand,.langbar,.controls,.hint,.toolbar,.orbi-bar,.orbi-panel,.palette{display:none!important}.book{width:100%!important;box-shadow:none!important;border-radius:0!important}.page{display:flex!important;position:relative!important;page-break-after:always;height:96vh;border-bottom:1px solid #ccc}.page svg{position:relative!important}.caption{background:#fff!important;color:#000!important;box-shadow:none!important}}"
  ].join("");
  document.head.appendChild(css);

  var LANGS = window.ORBI_LANGS || [
    { c: "es", label: "🇪🇸 Español", href: "libro.html" },
    { c: "en", label: "🇬🇧 English", href: "libro-en.html" },
    { c: "ca", label: "🟡 Català", href: "libro-ca.html" },
    { c: "gl", label: "🔵 Galego", href: "libro-gl.html" },
    { c: "eu", label: "🟢 Euskara", href: "libro-eu.html" }
  ];

  // Texto rastreable para buscadores e IAs (GEO)
  (function injectSeoText() {
    var sr = document.createElement("article");
    sr.className = "sr-only";
    var html = "<h1>" + T.coverTitle + " — " + T.coverSub + "</h1><p>" + T.brand + "</p>";
    for (var i = 1; i < T.captions.length; i++) {
      if (T.captions[i]) { html += "<p>" + T.captions[i] + "</p>"; }
    }
    sr.innerHTML = html;
    document.body.appendChild(sr);
  })();

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

  var EXTRA = {
    es: { color: "🎨 ¡Colorea tú!", colorWord: "¡Colorea!", colorCap: "¡Ahora te toca a ti! Elige un color y toca el dibujo para pintarlo. 🎨", full: "⛶ Pantalla completa", night: "🌙 Modo noche", day: "☀️ Modo día", print: "🖨️ Guardar PDF / Imprimir", erase: "Borrar" },
    en: { color: "🎨 Color it!", colorWord: "Color!", colorCap: "Now it's your turn! Pick a color and tap the picture to paint it. 🎨", full: "⛶ Fullscreen", night: "🌙 Night mode", day: "☀️ Day mode", print: "🖨️ Save PDF / Print", erase: "Erase" },
    ca: { color: "🎨 Pinta-ho!", colorWord: "Pinta!", colorCap: "Ara et toca a tu! Tria un color i toca el dibuix per pintar-lo. 🎨", full: "⛶ Pantalla completa", night: "🌙 Mode nit", day: "☀️ Mode dia", print: "🖨️ Desa PDF / Imprimeix", erase: "Esborra" },
    gl: { color: "🎨 Colorea ti!", colorWord: "Colorea!", colorCap: "Agora tócache a ti! Escolle unha cor e toca o debuxo para pintalo. 🎨", full: "⛶ Pantalla completa", night: "🌙 Modo noite", day: "☀️ Modo día", print: "🖨️ Gardar PDF / Imprimir", erase: "Borrar" },
    eu: { color: "🎨 Margotu zuk!", colorWord: "Margotu!", colorCap: "Orain zure txanda da! Aukeratu kolore bat eta ukitu marrazkia margotzeko. 🎨", full: "⛶ Pantaila osoa", night: "🌙 Gau modua", day: "☀️ Egun modua", print: "🖨️ Gorde PDF / Inprimatu", erase: "Ezabatu" }
  }[here] || null;

  var toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.innerHTML =
    '<button id="btnFull">' + (EXTRA ? EXTRA.full : "⛶") + '</button>' +
    '<button id="btnNight">' + (EXTRA ? EXTRA.night : "🌙") + '</button>' +
    '<button id="btnPrint">' + (EXTRA ? EXTRA.print : "🖨️") + '</button>';
  document.body.appendChild(toolbar);

  toolbar.querySelector("#btnFull").addEventListener("click", function () {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    } else if (document.exitFullscreen) { document.exitFullscreen(); }
  });
  var nightBtn = toolbar.querySelector("#btnNight");
  nightBtn.addEventListener("click", function () {
    document.body.classList.toggle("night");
    nightBtn.textContent = document.body.classList.contains("night") ? (EXTRA ? EXTRA.day : "☀️") : (EXTRA ? EXTRA.night : "🌙");
  });
  toolbar.querySelector("#btnPrint").addEventListener("click", function () { window.print(); });

  ART.forEach(function (art, i) {
    var div = document.createElement("div");
    var isCover = (i === 0);
    div.className = "page" + (i === 0 ? " active" : "") + (isCover ? " cover" : "");
    var st = D.STARLIST[i % D.STARLIST.length];
    var inner = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice">' + art + D.nstar(st.x, st.y, st.c, st.n) + '</svg>';
    if (isCover) {
      inner += '<div class="title"><span class="big">' + T.coverTitle + '</span><span class="sub">' + T.coverSub + '</span></div>' +
               '<div class="ribbon"><span>' + T.ribbon + '</span></div>';
    } else {
      inner += '<div class="caption">' + (T.captions[i] || "") + '</div>';
    }
    div.innerHTML = inner;
    book.appendChild(div);
  });

  // Página para COLOREAR (genérica, reutilizada del Libro 1)
  var colorArt =
    '<rect width="800" height="800" fill="#ffffff"/>' +
    '<circle cx="170" cy="160" r="80" class="fillable" fill="#ffffff" stroke="#333" stroke-width="4"/>' +
    '<g stroke="#333" stroke-width="4"><line x1="170" y1="50" x2="170" y2="15"/><line x1="60" y1="160" x2="25" y2="160"/><line x1="280" y1="160" x2="315" y2="160"/><line x1="95" y1="85" x2="70" y2="60"/><line x1="245" y1="85" x2="270" y2="60"/></g>' +
    '<polygon points="600,90 612,128 652,128 620,152 632,190 600,166 568,190 580,152 548,128 588,128" class="fillable" fill="#ffffff" stroke="#333" stroke-width="4"/>' +
    '<polygon points="700,300 709,328 739,328 715,346 724,374 700,357 676,374 685,346 661,328 691,328" class="fillable" fill="#ffffff" stroke="#333" stroke-width="4"/>' +
    '<circle cx="160" cy="430" r="70" class="fillable" fill="#ffffff" stroke="#333" stroke-width="4"/>' +
    '<ellipse cx="160" cy="430" rx="110" ry="26" fill="none" stroke="#333" stroke-width="4"/>' +
    '<g transform="translate(440,470)"><path d="M0 -150 Q55 -70 55 60 L-55 60 Q-55 -70 0 -150 Z" class="fillable" fill="#ffffff" stroke="#333" stroke-width="4"/>' +
    '<circle cx="0" cy="-50" r="28" class="fillable" fill="#ffffff" stroke="#333" stroke-width="4"/>' +
    '<path d="M-55 30 L-95 90 L-45 70 Z" class="fillable" fill="#ffffff" stroke="#333" stroke-width="4"/>' +
    '<path d="M55 30 L95 90 L45 70 Z" class="fillable" fill="#ffffff" stroke="#333" stroke-width="4"/>' +
    '<path d="M-26 60 Q0 140 26 60 Z" class="fillable" fill="#ffffff" stroke="#333" stroke-width="4"/></g>' +
    '<path d="M0 700 Q400 620 800 700 L800 800 L0 800 Z" class="fillable" fill="#ffffff" stroke="#333" stroke-width="4"/>';

  var colorDiv = document.createElement("div");
  colorDiv.className = "page";
  var palColors = ["#ff5a5a", "#ff8a3a", "#ffd84d", "#5ad15a", "#3ad1c8", "#7fd4ff", "#9b6bff", "#ff5a8a", "#8a5a3a", "#333333"];
  var swatches = palColors.map(function (c) { return '<div class="swatch" data-c="' + c + '" style="background:' + c + '"></div>'; }).join("");
  swatches += '<div class="swatch eraser" data-c="#ffffff" title="' + (EXTRA ? EXTRA.erase : "Erase") + '">🧽</div>';
  colorDiv.innerHTML =
    '<svg viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet">' + colorArt + '</svg>' +
    '<div class="palette">' + swatches + '</div>' +
    '<div class="caption">' + (EXTRA ? EXTRA.colorCap : "🎨") + '</div>';
  book.appendChild(colorDiv);

  var currentColor = palColors[0];
  colorDiv.querySelectorAll(".swatch").forEach(function (sw) {
    sw.addEventListener("click", function () {
      currentColor = sw.getAttribute("data-c");
      colorDiv.querySelectorAll(".swatch").forEach(function (s) { s.classList.remove("sel"); });
      sw.classList.add("sel");
    });
  });
  colorDiv.querySelector(".swatch").classList.add("sel");
  colorDiv.querySelectorAll(".fillable").forEach(function (shape) {
    var paint = function () { shape.setAttribute("fill", currentColor); };
    shape.addEventListener("click", paint);
    shape.addEventListener("touchstart", function (e) { e.preventDefault(); paint(); }, { passive: false });
  });

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
    if (cur === 0) counter.textContent = T.coverWord;
    else if (cur === total - 1) counter.textContent = (EXTRA ? EXTRA.colorWord : "🎨");
    else if (cur === total - 2) counter.textContent = T.endWord;
    else counter.textContent = T.pageWord + " " + cur;
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
