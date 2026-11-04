// ═══════════════════════════════════════════════════════════════════════════
// BASICS 1.0 / 2.0 — Colombia (Q4 2026)
// Fuente: formulario nuevo (respuestas por cocina). Cada pregunta puede responder:
//   "Sí"                         → cumple el estándar nuevo (2.0)
//   "Parcialmente (versión 1.0)" → cumple 1.0 pero no 2.0
//   "Parcialmente"               → parcial clásico (50%)
//   "No"                         → no cumple
// Preguntas invertidas (Sí = malo): 1 (cables), 7 (plagas), 14 (focos).
//
// Metodología de cálculo (por pregunta, luego promedio):
//   estado    Basics 1.0   Basics 2.0
//   yes (2.0)   100          100
//   p1 (1.0)    100           80
//   p (parc)     50           50
//   no            0            0
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  "use strict";

  // Metadatos de las 41 preguntas (no, bloque, tema, área, texto, invertida).
  var SEG = "Seguridad y condiciones operativas";
  var HIG = "Higiene personal y sanitaria";
  var INF = "Infraestructura y mantenimiento";
  var LIM = "Limpieza desinfección y control ambiental";
  var META = [
    { no: 1,  bloque: SEG, tema: "Seguridad eléctrica y de gas", area: "City",    inverted: true,  text: "¿Se identifican cables expuestos, extensiones o conexiones improvisadas que puedan representar un riesgo eléctrico?" },
    { no: 2,  bloque: SEG, tema: "Seguridad eléctrica y de gas", area: "City",    text: "¿Las tuberías de gas están protegidas y sin fugas detectables (olor / detector)?" },
    { no: 3,  bloque: HIG, tema: "EPP e higiene personal",       area: "Quality", l2: true, text: "La cocina cuenta con estación de lavado de manos independiente?" },
    { no: 4,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "Quality", text: "¿Se cuenta con un método de comprobación de agua potable (análisis físico-químico y microbiológico)?" },
    { no: 5,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "Admin",   text: "¿Se garantiza el uso de agua potable en las cocinas? (Control de lavado de tanques, uso de filtros de agua o agua de bidón)" },
    { no: 6,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "City",    text: "¿Los drenajes (de piso, tarjas y lavabos) funcionan sin obstrucciones ni malos olores?" },
    { no: 7,  bloque: LIM, tema: "Control de plagas",            area: "Admin",   inverted: true,  text: "¿Se observan signos de plagas (insectos, roedores, excretas, mordeduras)?" },
    { no: 8,  bloque: LIM, tema: "Control de plagas",            area: "Admin",   text: "¿Hay plan de fumigación vigente con registros del proveedor autorizado?" },
    { no: 9,  bloque: LIM, tema: "Control de plagas",            area: "Quality", text: "¿El personal ha sido capacitado en prevención de plagas en los últimos 6 meses?" },
    { no: 10, bloque: LIM, tema: "Control de plagas",            area: "City",    l2: true, text: "¿Se han cerrado los puntos de ingreso o anidación detectados?" },
    { no: 11, bloque: SEG, tema: "Refrigeración constante",      area: "City",    text: "¿Todos los refrigeradores y congeladores operan dentro de los rangos (0–4 °C / –18 °C)?" },
    { no: 12, bloque: SEG, tema: "Refrigeración constante",      area: "Quality", text: "¿Los registros de temperatura se encuentran diligenciados al menos dos veces al día y están completos?" },
    { no: 13, bloque: SEG, tema: "Iluminación y ventilación",    area: "City",    text: "¿La iluminación permite ver claramente las áreas de trabajo?" },
    { no: 14, bloque: SEG, tema: "Iluminación y ventilación",    area: "City",    inverted: true,  text: "¿Hay focos fundidos o luminarias sin protección?" },
    { no: 15, bloque: SEG, tema: "Iluminación y ventilación",    area: "City",    l2: true, text: "¿Extractores, ventiladores y aires funcionan correctamente?" },
    { no: 16, bloque: SEG, tema: "Equipos críticos",            area: "City",    text: "¿El 100% de los equipos están operativos?" },
    { no: 17, bloque: SEG, tema: "Equipos críticos",            area: "Quality", text: "¿Existen registros de mantenimientos preventivos y correctivos?" },
    { no: 18, bloque: SEG, tema: "Equipos críticos",            area: "Admin",   text: "¿La trampa de grasa funciona adecuadamente y se limpia de acuerdo al cronograma de aseo?" },
    { no: 19, bloque: SEG, tema: "Equipos críticos",            area: "Admin",   l2: true, nuevo: true, text: "La cocina cuenta con la cantidad suficiente de tablets funcionales para garantizar una operación eficiente?" },
    { no: 20, bloque: SEG, tema: "Equipos críticos",            area: "Admin",   l2: true, nuevo: true, text: "¿La cocina cuenta con una conexión a internet estable y funcional para garantizar la operación?" },
    { no: 21, bloque: LIM, tema: "Limpieza y desinfección",     area: "Quality", text: "¿Existe cronograma de limpieza diaria y profunda visible en la cocina?" },
    { no: 22, bloque: LIM, tema: "Limpieza y desinfección",     area: "Quality", l2: true, nuevo: true, text: "¿La cocina cuenta con los insumos de aseo aprobados por Calidad y en las cantidades necesarias para cumplir con la frecuencia de entrega establecida?" },
    { no: 23, bloque: LIM, tema: "Limpieza y desinfección",     area: "Quality", l2: true, nuevo: true, text: "¿Se cumplen los procesos de limpieza y desinfección establecidos en el Programa del Plan de Saneamiento?" },
    { no: 24, bloque: LIM, tema: "Limpieza y desinfección",     area: "City",    text: "¿Se realizan limpiezas profundas según cronograma de aseo y se hace seguimiento del mismo?" },
    { no: 25, bloque: LIM, tema: "Gestión de residuos",         area: "Quality", text: "¿Se usan botes de basura rotulados para separación según categoría?" },
    { no: 26, bloque: LIM, tema: "Gestión de residuos",         area: "Quality", text: "¿El personal ha sido entrenado en manejo de residuos y reciclaje?" },
    { no: 27, bloque: LIM, tema: "Gestión de residuos",         area: "City",    l2: true, text: "¿El área de almacenamiento de basura (shut) está aislada y en buen estado sanitario (limpio y cerrado)?" },
    { no: 28, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿El piso está sin baldosas sueltas ni fisuras, y seguro para el personal?" },
    { no: 29, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿Las paredes están sin grietas, humedad ni desprendimiento de pintura?" },
    { no: 30, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿Los techos están libres de moho o filtraciones?" },
    { no: 31, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿Hay mediacañas instaladas en zonas operativas?" },
    { no: 32, bloque: INF, tema: "Utensilios y superficies",    area: "Admin",   text: "¿Los utensilios están en buen estado sin óxido ni fisuras?" },
    { no: 33, bloque: INF, tema: "Utensilios y superficies",    area: "Admin",   text: "¿La cocina cuenta con un espacio de lockers o almacenamiento de pertenencias en buen estado (sin óxido, sin fisuras)?" },
    { no: 34, bloque: INF, tema: "Utensilios y superficies",    area: "City",    text: "¿Existe una separación clara entre área de lavado y operativa?" },
    { no: 35, bloque: INF, tema: "Utensilios y superficies",    area: "Admin",   text: "¿El almacenamiento del menaje está estandarizado e higiénico?" },
    { no: 36, bloque: HIG, tema: "People",                       area: "People",  l2: true, text: "¿Todo el personal, con más de un mes, cuenta con uniforme completo y en buen estado (pantalón, cofia/gorra, delantal, calzado antideslizante, chaqueta)?" },
    { no: 37, bloque: HIG, tema: "People",                       area: "People",  text: "¿La dotación se reemplaza con la frecuencia establecida?" },
    { no: 38, bloque: HIG, tema: "People",                       area: "Admin",   text: "¿Hay un espacio adecuado para que el personal pueda comer cómodamente (mesas y sillas)?" },
    { no: 39, bloque: HIG, tema: "People",                       area: "Admin",   text: "¿La cocina dispone de platos, vasos y cubiertos suficientes y en buen estado para el personal?" },
    { no: 40, bloque: HIG, tema: "People",                       area: "City",    text: "¿Los baños se encuentran limpios y en buen estado?" },
    { no: 41, bloque: HIG, tema: "People",                       area: "People",  text: "¿Siempre hay disponibilidad de papel higiénico, jabón y toallas para secarse las manos?" },
  ];

  function norm(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/\s+/g, " ").trim();
  }

  // Respuesta → estado canónico: "yes" | "p1" | "p" | "no" | null (sin responder).
  function answerState(answer, inverted) {
    var a = norm(answer);
    if (!a) return null;
    if (a.indexOf("VERSION 1.0") >= 0) return "p1";       // Parcialmente (versión 1.0)
    if (a === "PARCIALMENTE") return "p";
    if (a === "SI") return inverted ? "no" : "yes";
    if (a === "NO") return inverted ? "yes" : "no";
    return null;
  }

  // Estado → valor según la versión ("1.0" | "2.0").
  function basicsValue(st, version) {
    if (st == null) return null;
    if (st === "yes") return 100;
    if (st === "p1") return version === "2.0" ? 80 : 100;
    if (st === "p") return 50;
    return 0; // "no"
  }

  function mean(arr) {
    var a = arr.filter(function (x) { return x != null; });
    return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : null;
  }
  function kitchenNum(s) { var m = String(s || "").match(/^\d+/); return m ? m[0] : ""; }

  // Construye la estructura FORM_SCORES para una versión, a partir del mapa de
  // estados por cocina { normCocina: { no: "yes"|"p1"|"p"|"no" } } y meta { norm:{name,city} }.
  function buildAggregates(stateByKitchen, metaByKitchen, version) {
    var blocks = []; META.forEach(function (q) { if (blocks.indexOf(q.bloque) < 0) blocks.push(q.bloque); });
    var temas = [];  META.forEach(function (q) { if (temas.indexOf(q.tema) < 0) temas.push(q.tema); });

    var byName = {}, byNum = {}, byKitchenQuestion = {}, byKitchenBloque = {}, byKitchenTema = {};
    Object.keys(stateByKitchen).forEach(function (nm) {
      var states = stateByKitchen[nm];
      var m = (metaByKitchen && metaByKitchen[nm]) || { name: nm };
      var num = kitchenNum(m.name);
      var byQ = {}, teAcc = {}, blAcc = {}, all = [];
      META.forEach(function (q) {
        var v = basicsValue(states[q.no], version);
        if (v == null) return;
        byQ[q.no] = v; all.push(v);
        (teAcc[q.tema] = teAcc[q.tema] || []).push(v);
        (blAcc[q.bloque] = blAcc[q.bloque] || []).push(v);
      });
      byKitchenQuestion[nm] = byQ;
      var te = {}; temas.forEach(function (t) { te[t] = teAcc[t] ? mean(teAcc[t]) : null; });
      byKitchenTema[nm] = te;
      var bl = {}; blocks.forEach(function (b) { bl[b] = blAcc[b] ? mean(blAcc[b]) : null; });
      byKitchenBloque[nm] = bl;
      var basic = mean(all);
      if (basic != null) { byName[nm] = basic; if (num) byNum[num] = basic; }
    });
    var byBloque = {}, byTema = {};
    blocks.forEach(function (b) { byBloque[b] = mean(Object.keys(byKitchenBloque).map(function (nm) { return byKitchenBloque[nm][b]; })); });
    temas.forEach(function (t) { byTema[t] = mean(Object.keys(byKitchenTema).map(function (nm) { return byKitchenTema[nm][t]; })); });

    var questions = META.map(function (q) {
      return { no: q.no, bloque: q.bloque, tema: q.tema, area: q.area || "City", mex: q.text, colper: q.text, inverted: !!q.inverted };
    });
    return {
      byName: byName, byNum: byNum, byKitchenQuestion: byKitchenQuestion,
      byKitchenBloque: byKitchenBloque, byKitchenTema: byKitchenTema,
      byBloque: byBloque, byTema: byTema, _questions: questions,
    };
  }

  window.CO_BASICS_META = META;
  window.basicsAnswerState = answerState;
  window.basicsValue = basicsValue;
  window.buildBasicsAggregates = buildAggregates;
  window.basicsNorm = norm;
})();
