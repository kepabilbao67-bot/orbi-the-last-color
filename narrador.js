/* ============================================================
   Orbi — Narrador (lectura en voz alta) + Asistente del libro
   Funciona en español, inglés y chino segun <html lang="..">
   Sin claves, sin servidor, sin coste. Usa la voz del navegador.
   ============================================================ */
(function () {
  "use strict";

  // Idioma de la página (es / en / zh)
  var LANG = (document.documentElement.lang || "es").slice(0, 2).toLowerCase();

  // Mapa de códigos de voz por idioma
  var VOICE_LANG = { es: "es", en: "en", zh: "zh" };

  // ---------- Textos de la interfaz por idioma ----------
  var UI = {
    es: {
      readOn: "🔊 Leer en voz alta: ACTIVADO",
      readOff: "🔇 Leer en voz alta: apagado",
      hint: "Pasa el dedo o el ratón por el texto y te lo leo · por el dibujo y suena 🔊🙂",
      askBtn: "🤖 Pregúntale al libro",
      askTitle: "Pregúntale al libro de Orbi",
      placeholder: "Escribe tu pregunta...",
      send: "Enviar",
      close: "Cerrar",
      suggestions: [
        "¿De qué trata el libro?",
        "¿Quién es Orbi?",
        "¿Quién es Chispa?",
        "¿Cómo se hacen los colores?",
        "¿Para qué edad es?",
        "¿A dónde va el dinero?"
      ],
      welcome: "¡Hola! Soy el ayudante del libro. Pregúntame lo que quieras sobre Orbi y los colores del universo. 🌈"
    },
    en: {
      readOn: "🔊 Read aloud: ON",
      readOff: "🔇 Read aloud: off",
      hint: "Touch the text to hear it read · touch the picture for its sound 🔊🙂",
      askBtn: "🤖 Ask the book",
      askTitle: "Ask Orbi's book",
      placeholder: "Type your question...",
      send: "Send",
      close: "Close",
      suggestions: [
        "What is the book about?",
        "Who is Orbi?",
        "Who is Spark?",
        "How are colors made?",
        "What age is it for?",
        "Where does the money go?"
      ],
      welcome: "Hi! I'm the book helper. Ask me anything about Orbi and the colors of the universe. 🌈"
    },
    zh: {
      readOn: "🔊 朗读：开启",
      readOff: "🔇 朗读：关闭",
      hint: "碰文字会朗读 · 碰图画会发出声音 🔊🙂",
      askBtn: "🤖 问问这本书",
      askTitle: "问问奥比的书",
      placeholder: "输入你的问题……",
      send: "发送",
      close: "关闭",
      suggestions: [
        "这本书讲什么？",
        "奥比是谁？",
        "火花是谁？",
        "颜色是怎么来的？",
        "适合多大孩子？",
        "钱用到哪里？"
      ],
      welcome: "你好！我是这本书的小助手。关于奥比和宇宙的颜色，你都可以问我。🌈"
    }
  }[LANG] || null;

  if (!UI) return; // idioma no soportado

  // ---------- Base de conocimiento del "asistente" ----------
  // Cada entrada: palabras clave -> respuesta. Coincidencia simple.
  var KB = {
    es: [
      { k: ["trata", "sobre que", "de que", "historia", "argumento", "resumen"],
        a: "El universo está perdiendo sus colores. Orbi viaja por el espacio en un cohete de lata y descubre un secreto: los colores no se encuentran, se regalan. Cada acto de bondad hace nacer un color nuevo." },
      { k: ["orbi", "protagonista", "niña", "nina"],
        a: "Orbi es la protagonista: una niña valiente con el pelo lleno de rizos y los bolsillos llenos de tuercas. Construye un cohete con una lata vieja para salvar los colores." },
      { k: ["chispa", "luciernaga", "luciérnaga", "amiga", "mascota"],
        a: "Chispa es la mejor amiga de Orbi: una luciérnaga de hojalata que brilla muy poquito y la acompaña en todo el viaje." },
      { k: ["color", "colores", "naranja", "azul", "amarillo", "como se hacen"],
        a: "Los colores nacen con la bondad: el naranja nació al regalar una bufanda, el azul al compartir agua, y el amarillo al repartir la merienda. ¡Compartir, ayudar y consolar crean colores!" },
      { k: ["edad", "años", "anos", "para quien", "pequeños"],
        a: "Es para niños de 4 a 9 años. ¡Perfecto para leer en voz alta antes de dormir!" },
      { k: ["dinero", "beneficios", "caritas", "cáritas", "solidario", "ayuda"],
        a: "Parte de los beneficios del libro se destinan a Cáritas, para ayudar a niños y familias que lo necesitan." },
      { k: ["enseña", "valor", "valores", "moraleja", "mensaje"],
        a: "Enseña la bondad, la generosidad y el compartir: cuando ayudamos a los demás, el mundo se vuelve más luminoso." },
      { k: ["gigante", "montañas", "montanas"],
        a: "En el primer planeta, Orbi conoce a un gigante triste y solo. Le regala su bufanda y lo escucha, y las montañas se tiñen de naranja." },
      { k: ["final", "termina", "acaba"],
        a: "Al final, el universo vuelve a brillar gracias a la bondad de todos. Y recuerda: tú también guardas un color escondido para regalar. 🌈" },
      { k: ["idiomas", "idioma", "lenguas"],
        a: "El libro está en tres idiomas: español, inglés y chino. Puedes cambiar arriba." }
    ],
    en: [
      { k: ["about", "story", "plot", "summary", "what is"],
        a: "The universe is losing its colors. Orbi travels through space in a tin rocket and discovers a secret: colors aren't found, they're given. Every act of kindness gives birth to a new color." },
      { k: ["orbi", "main", "girl", "hero"],
        a: "Orbi is the hero: a brave girl with curly hair and pockets full of bolts. She builds a rocket from an old can to save the colors." },
      { k: ["spark", "firefly", "friend", "pet"],
        a: "Spark is Orbi's best friend: a little tin firefly that glows faintly and joins her on the whole journey." },
      { k: ["color", "colours", "colors", "orange", "blue", "yellow", "how are"],
        a: "Colors are born from kindness: orange came from giving a scarf, blue from sharing water, and yellow from sharing a snack. Sharing, helping and comforting create colors!" },
      { k: ["age", "years", "old", "for who"],
        a: "It's for children aged 4 to 9. Perfect for reading aloud at bedtime!" },
      { k: ["money", "proceeds", "charity", "help", "donate"],
        a: "Part of the proceeds from the book go to charity, to help children and families in need." },
      { k: ["teach", "value", "values", "moral", "message", "lesson"],
        a: "It teaches kindness, generosity and sharing: when we help others, the world becomes brighter." },
      { k: ["giant", "mountains"],
        a: "On the first planet, Orbi meets a sad and lonely giant. She gives him her scarf and listens, and the mountains turn orange." },
      { k: ["end", "ending", "finish"],
        a: "In the end, the universe shines again thanks to everyone's kindness. And remember: you too keep a hidden color to give away. 🌈" },
      { k: ["language", "languages"],
        a: "The book is in three languages: Spanish, English and Chinese. You can switch at the top." }
    ],
    zh: [
      { k: ["讲什么", "故事", "内容", "关于", "简介"],
        a: "宇宙正在失去颜色。奥比乘着铁皮火箭在太空旅行，发现一个秘密：颜色不是被找到的，而是被赠予的。每一个善举都会诞生一种新颜色。" },
      { k: ["奥比", "主角", "女孩"],
        a: "奥比是主角：一个勇敢的女孩，满头卷发，口袋里装满螺丝。她用一个旧罐头造了一艘火箭去拯救颜色。" },
      { k: ["火花", "萤火虫", "朋友", "宠物"],
        a: "火花是奥比最好的朋友：一只铁皮做的萤火虫，会发出微微的光，一路陪着她。" },
      { k: ["颜色", "橙", "蓝", "黄", "怎么来"],
        a: "颜色因善良而诞生：橙色来自送出的围巾，蓝色来自分享的泉水，黄色来自分给大家的点心。分享、帮助和安慰都会创造颜色！" },
      { k: ["几岁", "年龄", "多大", "适合"],
        a: "适合4到9岁的孩子，非常适合睡前大声朗读！" },
      { k: ["钱", "收益", "慈善", "捐", "帮助"],
        a: "本书的部分收益将捐给慈善机构，帮助有需要的儿童和家庭。" },
      { k: ["教", "价值", "意义", "道理"],
        a: "它教给孩子善良、慷慨与分享：当我们帮助别人，世界就会更明亮。" },
      { k: ["巨人", "群山", "山"],
        a: "在第一颗星球上，奥比遇到一个又伤心又孤单的巨人。她把围巾送给他并倾听，群山就染上了橙色。" },
      { k: ["结局", "结尾", "最后"],
        a: "最后，因为大家的善良，宇宙重新亮了起来。记住：你的心里也藏着一种颜色，可以送出去。🌈" },
      { k: ["语言", "几种语言"],
        a: "这本书有三种语言：西班牙语、英语和中文。可以在上方切换。" }
    ]
  }[LANG];

  function answerFor(qRaw) {
    var q = (qRaw || "").toLowerCase();
    var best = null, bestScore = 0;
    KB.forEach(function (entry) {
      var score = 0;
      entry.k.forEach(function (kw) { if (q.indexOf(kw.toLowerCase()) !== -1) score++; });
      if (score > bestScore) { bestScore = score; best = entry; }
    });
    if (best) return best.a;
    // respuesta por defecto
    if (LANG === "es") return "Mmm, no estoy seguro de eso. Prueba a preguntarme por Orbi, Chispa, los colores, la edad o a dónde va el dinero. 🙂";
    if (LANG === "zh") return "嗯，这个我不太确定。你可以问我奥比、火花、颜色、适合年龄或收益去向。🙂";
    return "Hmm, I'm not sure about that. Try asking me about Orbi, Spark, the colors, the age, or where the money goes. 🙂";
  }

  // ---------- Voz (Web Speech API) ----------
  var voices = [];
  function loadVoices() { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; }
  if (window.speechSynthesis) {
    loadVoices();
    if (typeof speechSynthesis.onvoiceschanged !== "undefined") {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }
  function pickVoice() {
    var pref = VOICE_LANG[LANG];
    var matches = voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(pref) === 0; });
    // intentar una voz que suene femenina/infantil
    var female = matches.find(function (v) { return /female|mujer|woman|niñ|child|kid|girl|Mónica|Sabina|Helena|Ting|Mei|Yu/i.test(v.name); });
    return female || matches[0] || null;
  }
  function speak(text) {
    if (!window.speechSynthesis || !text) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    var v = pickVoice();
    if (v) u.voice = v;
    u.lang = (v && v.lang) || (VOICE_LANG[LANG] + (LANG === "zh" ? "-CN" : ""));
    u.pitch = 1.6;   // tono alto -> voz más infantil
    u.rate = 0.95;   // un pelín lento para niños
    u.volume = 1;
    speechSynthesis.speak(u);
  }
  function stopSpeak() { if (window.speechSynthesis) speechSynthesis.cancel(); }

  // ---------- Efectos de sonido (Web Audio, sin archivos) ----------
  var AC = null;
  function audio() {
    if (!AC) {
      try { AC = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { AC = null; }
    }
    if (AC && AC.state === "suspended") { try { AC.resume(); } catch (e) {} }
    return AC;
  }
  // tono simple
  function tone(freq, start, dur, type, vol) {
    var ac = audio(); if (!ac) return;
    var t0 = ac.currentTime + (start || 0);
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.25, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + (dur || 0.3));
    o.connect(g); g.connect(ac.destination);
    o.start(t0); o.stop(t0 + (dur || 0.3) + 0.05);
  }
  // barrido de frecuencia (cohete / magia)
  function sweep(f1, f2, dur, type, vol) {
    var ac = audio(); if (!ac) return;
    var t0 = ac.currentTime;
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type || "sawtooth";
    o.frequency.setValueAtTime(f1, t0);
    o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(ac.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  // ruido (mar / viento / despegue)
  function noise(dur, freq, q, vol) {
    var ac = audio(); if (!ac) return;
    var t0 = ac.currentTime;
    var n = Math.floor(ac.sampleRate * dur);
    var buf = ac.createBuffer(1, n, ac.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    var src = ac.createBufferSource(); src.buffer = buf;
    var f = ac.createBiquadFilter(); f.type = "bandpass";
    f.frequency.value = freq || 600; f.Q.value = q || 1;
    var g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(ac.destination);
    src.start(t0); src.stop(t0 + dur);
  }
  function arp(freqs, step, dur, type, vol) {
    freqs.forEach(function (f, i) { tone(f, i * step, dur, type, vol); });
  }

  // Efectos por nombre de escena
  var FX = {
    sparkle: function () { arp([880, 1175, 1568, 2093], 0.07, 0.18, "triangle", 0.18); },     // chispas/estrellas
    twinkle: function () { tone(1568, 0, 0.18, "triangle", 0.2); tone(2093, 0.09, 0.2, "triangle", 0.16); }, // Chispa
    fade:    function () { sweep(440, 120, 0.7, "sine", 0.15); },                              // colores apagándose
    rocket:  function () { noise(0.9, 300, 0.6, 0.22); sweep(120, 600, 0.7, "sawtooth", 0.12); }, // cohete
    sadwind: function () { noise(1.0, 220, 0.8, 0.14); },                                      // gigante triste
    warm:    function () { arp([523, 659, 784], 0.09, 0.45, "sine", 0.2); },                   // nace un color (cálido)
    ding:    function () { tone(1318, 0, 0.4, "sine", 0.22); },                                // idea 💡
    dry:     function () { tone(196, 0, 0.5, "triangle", 0.14); },                             // mar seco
    water:   function () { tone(700, 0, 0.18, "sine", 0.12); tone(520, 0.12, 0.2, "sine", 0.12); tone(880, 0.26, 0.18, "sine", 0.1); noise(0.5, 1200, 2, 0.06); }, // agua/burbujas
    happy:   function () { arp([523, 659, 784, 1047], 0.08, 0.22, "square", 0.14); },          // risas/alegría
    magic:   function () { sweep(400, 1600, 0.6, "triangle", 0.16); arp([1047, 1319, 1568], 0.12, 0.25, "sine", 0.12); }, // magia colores
    rainbow: function () { arp([523, 587, 659, 698, 784, 880, 988, 1047], 0.07, 0.25, "sine", 0.16); } // arcoíris
  };

  // Mapa de escena -> efecto (mismo orden de páginas en los 3 idiomas)
  // 0 portada,1 gris,2 Orbi+Chispa,3 cohete,4 gigante,5 montañas naranja,6 idea,
  // 7 mar seco,8 mar azul,9 asteroide,10 amarillo/risas,11 secreto,12 estela,13 arcoíris,14 ventana,15 fin
  var SCENE_FX = ["sparkle","fade","twinkle","rocket","sadwind","warm","ding","dry","water","happy","happy","magic","rocket","rainbow","twinkle","warm"];

  function playSceneSound() {
    if (!readEnabled) return;
    var pages = [].slice.call(document.querySelectorAll(".page"));
    var act = document.querySelector(".page.active");
    var idx = act ? pages.indexOf(act) : -1;
    var name = (idx >= 0 && SCENE_FX[idx]) ? SCENE_FX[idx] : "sparkle"; // portada/landing -> chispas
    if (FX[name]) FX[name]();
  }

  // ---------- Estilos ----------
  var css = document.createElement("style");
  css.textContent = [
    ".orbi-bar{position:fixed;top:10px;right:10px;z-index:9999;display:flex;flex-direction:column;gap:8px;align-items:flex-end;font-family:inherit}",
    ".orbi-btn{cursor:pointer;border:none;border-radius:30px;padding:10px 16px;font-size:14px;font-weight:bold;box-shadow:0 4px 0 rgba(0,0,0,.25)}",
    ".orbi-read{background:#3ad1c8;color:#063b38}",
    ".orbi-read.off{background:#9aa;color:#222}",
    ".orbi-ask{background:#ff5a8a;color:#fff}",
    ".orbi-reading{outline:3px dashed #ffd84d!important;outline-offset:3px;border-radius:10px;cursor:pointer}",
    ".orbi-panel{position:fixed;inset:auto 12px 12px auto;bottom:12px;right:12px;width:min(92vw,380px);max-height:72vh;background:#1a1040;color:#fff;border:2px solid #7a4bd0;border-radius:18px;z-index:10000;display:none;flex-direction:column;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.6)}",
    ".orbi-panel.open{display:flex}",
    ".orbi-phead{background:#7a4bd0;padding:12px 14px;font-weight:bold;display:flex;justify-content:space-between;align-items:center}",
    ".orbi-pclose{cursor:pointer;background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:20px;padding:4px 10px;font-weight:bold}",
    ".orbi-msgs{padding:12px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:10px}",
    ".orbi-m{padding:10px 12px;border-radius:14px;line-height:1.45;font-size:15px;max-width:85%}",
    ".orbi-bot{background:rgba(255,255,255,.12);align-self:flex-start;border-bottom-left-radius:4px}",
    ".orbi-user{background:#ffd84d;color:#5a3000;align-self:flex-end;border-bottom-right-radius:4px}",
    ".orbi-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 8px}",
    ".orbi-chip{cursor:pointer;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#cdbcff;border-radius:20px;padding:6px 10px;font-size:12px}",
    ".orbi-chip:hover{background:rgba(255,255,255,.2)}",
    ".orbi-input{display:flex;gap:6px;padding:10px;border-top:1px solid rgba(255,255,255,.15)}",
    ".orbi-input input{flex:1;border-radius:20px;border:none;padding:10px 14px;font-size:15px;font-family:inherit}",
    ".orbi-input button{cursor:pointer;border:none;background:#3ad1c8;color:#063b38;border-radius:20px;padding:0 16px;font-weight:bold}",
    ".orbi-hint{font-size:11px;color:#9a86d6;max-width:170px;text-align:right;line-height:1.3}"
  ].join("");
  document.head.appendChild(css);

  // ---------- Botones flotantes ----------
  var bar = document.createElement("div");
  bar.className = "orbi-bar";
  var readBtn = document.createElement("button");
  readBtn.className = "orbi-btn orbi-read";
  readBtn.textContent = UI.readOn;
  var askBtn = document.createElement("button");
  askBtn.className = "orbi-btn orbi-ask";
  askBtn.textContent = UI.askBtn;
  var hint = document.createElement("div");
  hint.className = "orbi-hint";
  hint.textContent = UI.hint;
  bar.appendChild(readBtn);
  bar.appendChild(askBtn);
  bar.appendChild(hint);
  document.body.appendChild(bar);

  // ---------- Lectura al pasar por encima ----------
  var readEnabled = true;
  function targets() {
    return document.querySelectorAll(".caption, .story-text p, .story-text h2, .story-text h3, .cover .title, .tagline, .intro, h1");
  }
  function onEnter(e) {
    if (!readEnabled) return;
    var el = e.currentTarget;
    el.classList.add("orbi-reading");
    speak(el.textContent.trim());
  }
  function onLeave(e) { e.currentTarget.classList.remove("orbi-reading"); }
  function onTap(e) {
    if (!readEnabled) return;
    var el = e.currentTarget;
    el.classList.add("orbi-reading");
    speak(el.textContent.trim());
    setTimeout(function () { el.classList.remove("orbi-reading"); }, 1200);
  }
  function onTouch(e) {
    if (!readEnabled) return;
    // dedo (tablet/móvil): leer al tocar
    var el = e.currentTarget;
    el.classList.add("orbi-reading");
    speak(el.textContent.trim());
    setTimeout(function () { el.classList.remove("orbi-reading"); }, 1200);
  }
  function wireReaders() {
    targets().forEach(function (el) {
      if (el.dataset.orbiWired) return;
      el.dataset.orbiWired = "1";
      el.style.cursor = "pointer";
      el.addEventListener("mouseenter", onEnter);   // ratón: al pasar por encima
      el.addEventListener("mouseleave", onLeave);
      el.addEventListener("click", onTap);          // clic
      el.addEventListener("touchstart", onTouch, { passive: true }); // dedo
    });
    // Ilustraciones: al pasar el dedo/ratón por el dibujo -> sonido de la escena
    document.querySelectorAll(".page svg, .cover svg").forEach(function (svg) {
      if (svg.dataset.orbiFx) return;
      svg.dataset.orbiFx = "1";
      svg.addEventListener("mouseenter", playSceneSound);
      svg.addEventListener("touchstart", playSceneSound, { passive: true });
    });
  }
  wireReaders();
  // re-cablear cuando el libro cambia de página (el contenido se regenera)
  setInterval(wireReaders, 1500);

  readBtn.addEventListener("click", function () {
    readEnabled = !readEnabled;
    readBtn.textContent = readEnabled ? UI.readOn : UI.readOff;
    readBtn.classList.toggle("off", !readEnabled);
    if (!readEnabled) stopSpeak();
  });

  // ---------- Panel del asistente ----------
  var panel = document.createElement("div");
  panel.className = "orbi-panel";
  panel.innerHTML =
    '<div class="orbi-phead"><span>' + UI.askTitle + '</span>' +
    '<button class="orbi-pclose">' + UI.close + '</button></div>' +
    '<div class="orbi-msgs"></div>' +
    '<div class="orbi-chips"></div>' +
    '<div class="orbi-input"><input type="text" placeholder="' + UI.placeholder + '"/>' +
    '<button class="orbi-send">' + UI.send + '</button></div>';
  document.body.appendChild(panel);

  var msgs = panel.querySelector(".orbi-msgs");
  var chips = panel.querySelector(".orbi-chips");
  var input = panel.querySelector("input");

  function addMsg(text, who, talk) {
    var m = document.createElement("div");
    m.className = "orbi-m " + (who === "user" ? "orbi-user" : "orbi-bot");
    m.textContent = text;
    msgs.appendChild(m);
    msgs.scrollTop = msgs.scrollHeight;
    if (who === "bot" && talk !== false) speak(text);
  }
  function ask(q) {
    if (!q) return;
    addMsg(q, "user");
    var a = answerFor(q);
    setTimeout(function () { addMsg(a, "bot"); }, 250);
  }

  UI.suggestions.forEach(function (s) {
    var c = document.createElement("button");
    c.className = "orbi-chip";
    c.textContent = s;
    c.addEventListener("click", function () { ask(s); });
    chips.appendChild(c);
  });

  panel.querySelector(".orbi-send").addEventListener("click", function () {
    var q = input.value.trim(); input.value = "";
    ask(q);
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { var q = input.value.trim(); input.value = ""; ask(q); }
  });
  panel.querySelector(".orbi-pclose").addEventListener("click", function () {
    panel.classList.remove("open"); stopSpeak();
  });
  var welcomed = false;
  askBtn.addEventListener("click", function () {
    panel.classList.toggle("open");
    if (panel.classList.contains("open") && !welcomed) {
      welcomed = true;
      addMsg(UI.welcome, "bot", false);
    }
  });
})();
