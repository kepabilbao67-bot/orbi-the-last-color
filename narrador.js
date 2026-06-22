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
  var VOICE_LANG = { es: "es", en: "en", ca: "ca", gl: "gl", eu: "eu" };

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
    ca: {
      readOn: "🔊 Llegir en veu alta: ACTIVAT",
      readOff: "🔇 Llegir en veu alta: apagat",
      hint: "Passa el dit o el ratolí pel text i te'l llegeixo · pel dibuix i sona 🔊🙂",
      askBtn: "🤖 Pregunta al llibre",
      askTitle: "Pregunta al llibre de l'Orbi",
      placeholder: "Escriu la teva pregunta...",
      send: "Envia",
      close: "Tanca",
      suggestions: ["De què tracta el llibre?","Qui és l'Orbi?","Qui és l'Espurna?","Com es fan els colors?","Per a quina edat és?","On va el diner?"],
      welcome: "Hola! Soc l'ajudant del llibre. Pregunta'm el que vulguis sobre l'Orbi i els colors de l'univers. 🌈"
    },
    gl: {
      readOn: "🔊 Ler en voz alta: ACTIVADO",
      readOff: "🔇 Ler en voz alta: apagado",
      hint: "Pasa o dedo ou o rato polo texto e léocho · polo debuxo e soa 🔊🙂",
      askBtn: "🤖 Pregúntalle ao libro",
      askTitle: "Pregúntalle ao libro de Orbi",
      placeholder: "Escribe a túa pregunta...",
      send: "Enviar",
      close: "Pechar",
      suggestions: ["De que trata o libro?","Quen é Orbi?","Quen é Faísca?","Como se fan as cores?","Para que idade é?","A onde vai o diñeiro?"],
      welcome: "Ola! Son o axudante do libro. Pregúntame o que queiras sobre Orbi e as cores do universo. 🌈"
    },
    eu: {
      readOn: "🔊 Ozen irakurri: PIZTUTA",
      readOff: "🔇 Ozen irakurri: itzalita",
      hint: "Pasatu hatza edo sagua testutik eta irakurriko dizut · marrazkitik eta soinua 🔊🙂",
      askBtn: "🤖 Galdetu liburuari",
      askTitle: "Galdetu Orbiren liburuari",
      placeholder: "Idatzi zure galdera...",
      send: "Bidali",
      close: "Itxi",
      suggestions: ["Zeri buruzkoa da liburua?","Nor da Orbi?","Nor da Txinparta?","Nola sortzen dira koloreak?","Zer adinetarako da?","Nora doa dirua?"],
      welcome: "Kaixo! Liburuaren laguntzailea naiz. Galdetu nahi duzuna Orbiri eta unibertsoaren koloreei buruz. 🌈"
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
    ca: [
      { k: ["tracta","de què","història","resum","argument"], a: "L'univers està perdent els colors. L'Orbi viatja per l'espai en un coet de llauna i descobreix un secret: els colors no es troben, es regalen. Cada acte de bondat fa néixer un color nou." },
      { k: ["orbi","protagonista","nena","heroïna"], a: "L'Orbi és la protagonista: una nena valenta amb els cabells arrissats i les butxaques plenes de cargols. Construeix un coet amb una llauna vella per salvar els colors." },
      { k: ["espurna","cuca","amiga"], a: "L'Espurna és la millor amiga de l'Orbi: una cuca de llum de llauna que brilla molt poquet i l'acompanya en tot el viatge." },
      { k: ["color","colors","taronja","blau","groc"], a: "Els colors neixen amb la bondat: el taronja en regalar una bufanda, el blau en compartir aigua i el groc en repartir el berenar. Compartir, ajudar i consolar creen colors!" },
      { k: ["edat","anys","per a qui"], a: "És per a nens de 4 a 9 anys. Perfecte per llegir en veu alta abans de dormir!" },
      { k: ["diner","beneficis","càritas","caritas","solidari"], a: "Part dels beneficis del llibre es destinen a Càritas, per ajudar nens i famílies que ho necessiten." },
      { k: ["final","acaba"], a: "Al final, l'univers torna a brillar gràcies a la bondat de tothom. I recorda: tu també guardes un color amagat per regalar. 🌈" }
    ],
    gl: [
      { k: ["trata","de que","historia","resumo","argumento"], a: "O universo está a perder as cores. Orbi viaxa polo espazo nun foguete de lata e descobre un segredo: as cores non se atopan, regálanse. Cada acto de bondade fai nacer unha cor nova." },
      { k: ["orbi","protagonista","nena","heroína"], a: "Orbi é a protagonista: unha nena valente co pelo rizo e os petos cheos de porcas. Constrúe un foguete cunha lata vella para salvar as cores." },
      { k: ["faísca","faisca","vagalume","amiga"], a: "Faísca é a mellor amiga de Orbi: un vagalume de lata que brilla moi pouquiño e acompáñaa en toda a viaxe." },
      { k: ["cor","cores","laranxa","azul","amarelo"], a: "As cores nacen coa bondade: o laranxa ao regalar unha bufanda, o azul ao compartir auga e o amarelo ao repartir a merenda. Compartir, axudar e consolar crean cores!" },
      { k: ["idade","anos","para quen"], a: "É para nenos de 4 a 9 anos. Perfecto para ler en voz alta antes de durmir!" },
      { k: ["diñeiro","dineiro","beneficios","cáritas","caritas","solidario"], a: "Parte dos beneficios do libro destínanse a Cáritas, para axudar a nenos e familias que o precisan." },
      { k: ["final","remata","acaba"], a: "Ao final, o universo volve brillar grazas á bondade de todos. E lembra: ti tamén gardas unha cor agochada para regalar. 🌈" }
    ],
    eu: [
      { k: ["zeri","buruz","istorio","laburpen","kontatzen"], a: "Unibertsoa koloreak galtzen ari da. Orbik espazioan zehar bidaiatzen du lata-suziri batean eta sekretu bat aurkitzen du: koloreak ez dira aurkitzen, oparitu egiten dira. Ontasun-keinu bakoitzak kolore berri bat sortzen du." },
      { k: ["orbi","protagonista","neska"], a: "Orbi protagonista da: neska ausarta, ile kizkurra eta poltsikoak torlojuz beteta. Lata zahar batekin suziri bat eraikitzen du koloreak salbatzeko." },
      { k: ["txinparta","ipurtargi","lagun"], a: "Txinparta Orbiren lagunik onena da: latazko ipurtargi bat, apur bat distiratzen duena, eta bidaia osoan laguntzen diona." },
      { k: ["kolore","koloreak","laranja","urdin","hori"], a: "Koloreak ontasunarekin sortzen dira: laranja bufanda bat oparituz, urdina ura partekatuz eta horia askaria banatuz. Partekatzeak, laguntzeak eta kontsolatzeak koloreak sortzen dituzte!" },
      { k: ["adina","urte","norentzat"], a: "4 eta 9 urte bitarteko haurrentzat da. Lo egin aurretik ozen irakurtzeko ezin hobea!" },
      { k: ["dirua","diru","irabazi","caritas","elkartasun"], a: "Liburuaren irabazien zati bat Caritasera bideratzen da, behar duten haur eta familiei laguntzeko." },
      { k: ["amaiera","bukaera"], a: "Amaieran, unibertsoa berriz distiratzen da denen ontasunari esker. Eta gogoratu: zuk ere kolore ezkutu bat gordetzen duzu oparitzeko. 🌈" }
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
    if (LANG === "en") return "Hmm, I'm not sure about that. Try asking me about Orbi, Spark, the colors, the age, or where the money goes. 🙂";
    if (LANG === "ca") return "Mmm, no n'estic segur. Prova de preguntar-me per l'Orbi, l'Espurna, els colors, l'edat o on va el diner. 🙂";
    if (LANG === "gl") return "Hmm, non estou seguro. Pregúntame por Orbi, Faísca, as cores, a idade ou a onde vai o diñeiro. 🙂";
    if (LANG === "eu") return "Mmm, ez nago ziur. Galdetu Orbi, Txinparta, koloreak, adina edo dirua nora doan. 🙂";
    return "Mmm, no estoy seguro de eso. Prueba a preguntarme por Orbi, Chispa, los colores, la edad o a dónde va el dinero. 🙂";
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
    // si no hay voz para catalán/gallego/euskera, usar la castellana (suena natural)
    if (!matches.length && (LANG === "ca" || LANG === "gl" || LANG === "eu")) {
      matches = voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf("es") === 0; });
    }
    var female = matches.find(function (v) { return /female|mujer|woman|niñ|child|kid|girl|Mónica|Sabina|Helena|Montse|Núria/i.test(v.name); });
    return female || matches[0] || null;
  }
  function speak(text) {
    if (!window.speechSynthesis || !text) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    var v = pickVoice();
    if (v) u.voice = v;
    var region = { es: "es-ES", en: "en-GB", ca: "ca-ES", gl: "gl-ES", eu: "eu-ES" }[LANG] || "es-ES";
    u.lang = (v && v.lang) || region;
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
    sparkle: function () { arp([880, 1175, 1568, 2093, 2637], 0.07, 0.22, "triangle", 0.24); },     // chispas/estrellas
    twinkle: function () { tone(1568, 0, 0.22, "triangle", 0.26); tone(2093, 0.09, 0.24, "triangle", 0.2); tone(2637, 0.2, 0.2, "triangle", 0.16); }, // Chispa
    fade:    function () { sweep(520, 110, 0.9, "sine", 0.2); tone(330, 0.1, 0.6, "sine", 0.12); },  // colores apagándose
    rocket:  function () { noise(1.1, 320, 0.6, 0.3); sweep(110, 700, 0.9, "sawtooth", 0.18); tone(80, 0, 0.9, "square", 0.12); }, // cohete 🚀
    sadwind: function () { noise(1.3, 220, 0.8, 0.18); sweep(300, 160, 1.0, "sine", 0.08); },        // gigante triste
    warm:    function () { arp([523, 659, 784, 1047], 0.1, 0.55, "sine", 0.26); },                   // nace un color (cálido)
    ding:    function () { tone(1318, 0, 0.45, "sine", 0.28); tone(1976, 0.08, 0.35, "sine", 0.16); }, // idea 💡
    dry:     function () { tone(196, 0, 0.6, "triangle", 0.18); noise(0.4, 400, 1, 0.06); },          // mar seco
    water:   function () { tone(740, 0, 0.2, "sine", 0.16); tone(540, 0.12, 0.22, "sine", 0.16); tone(900, 0.26, 0.2, "sine", 0.14); tone(660, 0.4, 0.2, "sine", 0.12); noise(0.7, 1300, 2, 0.08); }, // agua/burbujas
    happy:   function () { arp([523, 659, 784, 1047, 1319], 0.08, 0.26, "square", 0.18); },           // risas/alegría
    magic:   function () { sweep(380, 1800, 0.7, "triangle", 0.2); arp([1047, 1319, 1568, 2093], 0.12, 0.3, "sine", 0.16); }, // magia colores
    rainbow: function () { arp([523, 587, 659, 698, 784, 880, 988, 1047, 1175], 0.07, 0.3, "sine", 0.2); }, // arcoíris 🌈
    boss:    function () { tone(90, 0, 0.6, "sawtooth", 0.22); tone(70, 0.15, 0.7, "square", 0.16); noise(0.5, 150, 1, 0.12); }, // Sol mandón 🌞
    clash:   function () { noise(0.5, 500, 0.7, 0.3); sweep(900, 120, 0.5, "sawtooth", 0.22); tone(1200, 0, 0.12, "square", 0.22); } // pelea 💥
  };

  // Mapa de escena -> efecto (mismo orden de páginas en los 3 idiomas)
  // 0 portada,1 gris,2 Orbi+Chispa,3 cohete,4 gigante,5 montañas naranja,6 idea,
  // 7 mar seco,8 mar azul,9 asteroide,10 amarillo/risas,11 secreto,12 estela,13 arcoíris,14 ventana,15 fin
  var SCENE_FX = ["sparkle","fade","twinkle","rocket","sadwind","warm","ding","dry","water","happy","happy","magic","rocket","rainbow","twinkle","boss","rainbow","clash","warm","rainbow","warm"];

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

  // MÁS RUIDOS: reproducir el sonido de la escena automáticamente al pasar de página
  var _lastIdx = null;
  function autoSceneSound() {
    var pages = [].slice.call(document.querySelectorAll(".page"));
    var act = document.querySelector(".page.active");
    var idx = act ? pages.indexOf(act) : -1;
    if (idx !== _lastIdx) {
      if (_lastIdx !== null && idx >= 0 && readEnabled) playSceneSound();
      _lastIdx = idx;
    }
  }
  setInterval(autoSceneSound, 400);

  // DEDO EN MÓVIL/TABLET: al deslizar el dedo, leer las letras y sonar los dibujos
  var _lastTouchEl = null;
  document.addEventListener("touchmove", function (e) {
    if (!readEnabled) return;
    var t = e.touches && e.touches[0];
    if (!t) return;
    var el = document.elementFromPoint(t.clientX, t.clientY);
    if (!el) return;
    var textEl = el.closest(".caption, .story-text p, .story-text h2, .story-text h3, .cover .title, .tagline, .intro, h1, .orbi-m");
    if (textEl) {
      if (textEl !== _lastTouchEl) { _lastTouchEl = textEl; speak(textEl.textContent.trim()); }
      return;
    }
    var svg = el.closest("svg");
    if (svg) {
      if (svg !== _lastTouchEl) { _lastTouchEl = svg; playSceneSound(); }
    }
  }, { passive: true });
  document.addEventListener("touchend", function () { _lastTouchEl = null; });

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

  // ---------- Canción de cuna (al final del libro) ----------
  if (window.ORBI_TEXT && window.ORBI_TEXT.lullaby) {
    var L = window.ORBI_TEXT;
    var lullBtn = document.createElement("button");
    lullBtn.className = "orbi-btn";
    lullBtn.style.background = "#9b6bff";
    lullBtn.style.color = "#fff";
    lullBtn.textContent = L.lullabyBtn || "🌙";
    bar.insertBefore(lullBtn, hint);

    var lpanel = document.createElement("div");
    lpanel.className = "orbi-panel";
    lpanel.innerHTML =
      '<div class="orbi-phead"><span>' + (L.lullabyTitle || "") + '</span>' +
      '<button class="orbi-pclose">' + UI.close + '</button></div>' +
      '<div class="orbi-msgs" style="text-align:center;font-size:17px;line-height:1.9">' +
      L.lullaby.map(function (line) { return '<div>' + line + '</div>'; }).join("") +
      '</div>';
    document.body.appendChild(lpanel);
    lpanel.querySelector(".orbi-pclose").addEventListener("click", function () {
      lpanel.classList.remove("open"); stopSpeak();
    });

    function playMelody() {
      var ac = audio(); if (!ac) return;
      var C = 261.63, D = 293.66, E = 329.63, F = 349.23, G = 392.0, A = 440.0;
      var seq = [C, C, G, G, A, A, G, F, F, E, E, D, D, C];
      var durs = [.5, .5, .5, .5, .5, .5, 1, .5, .5, .5, .5, .5, .5, 1];
      var t = 0;
      for (var i = 0; i < seq.length; i++) { tone(seq[i], t, durs[i] * 0.95, "sine", 0.12); t += durs[i]; }
    }
    lullBtn.addEventListener("click", function () {
      var open = lpanel.classList.toggle("open");
      if (open) { playMelody(); speak(L.lullaby.join(". ")); }
      else { stopSpeak(); }
    });
  }
})();
