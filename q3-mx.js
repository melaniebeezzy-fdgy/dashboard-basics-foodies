// ═══════════════════════════════════════════════════════════════════════════
// MÉXICO en el Q3.  Construye, desde el diagnóstico crudo congelado (Q3_DATA)
// y el mapeo validado (Q3_SCHEMA), las estructuras que el dashboard ya usa:
//   • window.FORM_SCORES.MX   (byName, byNum, byKitchenQuestion, byKitchenBloque,
//                              byKitchenTema, byBloque, byTema, _questions)
//   • window.SHEET_DETAIL_DATA_MX_Q3  (questions + kitchens con values por pregunta)
// Así todas las vistas de MX (Dashboard, Por cocina, Por básico, Detalles,
// Impacto Fix, Gantt) quedan sobre el Q3, igual que Colombia trabaja su Q vigente.
// El Q2 previo de MX se guarda en window.Q2_FORM_MX para el Comparativo.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  // Texto ORIGINAL de cada pregunta (idéntico al que trae la hoja de planes de
  // acción en su columna "Basic"), necesario para que los fixes emparejen por texto.
  var FULL = {
    1: "¿Se identifican cables expuestos, extensiones o conexiones improvisadas que puedan representar un riesgo eléctrico?",
    2: "¿Las tuberías de gas están protegidas y sin fugas detectables (olor / detector)?",
    3: "¿La cocina cuenta con al menos un sitio para la estación de lavado de manos?",
    4: "¿Se cuenta con un método de comprobación de agua potable (análisis físico-químico y microbiológico)?",
    5: "¿Se garantiza el uso de agua potable en las cocinas? (Control de lavado de tanques, uso de filtros de agua o agua de bidón)",
    6: "¿Las coladeras (de piso, tarjas y lavabos) funcionan sin obstrucciones ni malos olores?",
    7: "¿Se observan signos de plagas (insectos, roedores, excretas, mordeduras)?",
    8: "¿Hay plan de fumigación vigente con registros del proveedor autorizado?",
    9: "¿El personal ha sido capacitado en prevención de plagas en los últimos 6 meses?",
    10: "¿Se han cerrado los puntos de ingreso o anidación detectados?",
    11: "¿Todos los refrigeradores y congeladores operan dentro de los rangos (0–4 °C / –18 °C)?",
    12: "¿Los registros de temperatura se encuentran diligenciados al menos dos veces al día y están completos?",
    13: "¿La iluminación permite ver claramente las áreas de trabajo?",
    14: "¿Hay focos fundidos o luminarias sin protección?",
    15: "¿Extractores, ventiladores y aires funcionan correctamente?",
    16: "¿El 100% de los equipos están operativos?",
    17: "¿Existen registros de mantenimientos preventivos y correctivos?",
    18: "¿La trampa de grasa funciona adecuadamente y se limpia de acuerdo al cronograma de aseo?",
    19: "¿Existe cronograma de limpieza diaria y profunda visible en la cocina?",
    20: "¿Se realizan limpiezas profundas según cronograma de aseo y se hace seguimiento del mismo?",
    21: "¿Se usan botes de basura rotulados para separación según categoría?",
    22: "¿El personal ha sido entrenado en manejo de residuos y reciclaje?",
    23: "¿El área de almacenamiento de basura (contenedores) está aislada y en buen estado sanitario (limpio y cerrado)?",
    24: "¿El piso está sin losetas sueltas ni fisuras, y seguro para el personal?",
    25: "¿Las paredes están sin grietas, humedad ni desprendimiento de pintura?",
    26: "¿Los techos están libres de moho o filtraciones?",
    27: "¿Hay soclos instaladas en las paredes de las zonas operativas?",
    28: "¿Los utensilios están en buen estado sin óxido ni fisuras?",
    29: "¿La cocina cuenta con un espacio de lockers o almacenamiento de pertenencias en buen estado (sin óxido, sin fisuras)?",
    30: "¿Existe una separación clara entre área de lavado y operativa?",
    31: "¿El almacenamiento del menaje está estandarizado e higiénico?",
    32: "¿Todo el personal cuenta con uniforme completo y en buen estado (playera y mandil)?",
    33: "¿La dotación se reemplaza con la frecuencia establecida?",
    34: "¿Hay un espacio adecuado para que el personal pueda comer cómodamente (mesas y sillas)?",
    35: "¿La cocina dispone de platos, vasos y cubiertos suficientes y en buen estado para el personal?",
    36: "¿Los baños se encuentran limpios y en buen estado?",
    37: "¿Siempre hay disponibilidad de papel higiénico, jabón y toallas para secarse las manos?"
  };

  function norm(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim();
  }
  function kitchenNum(s) { var m = String(s || "").match(/^\d+/); return m ? m[0] : ""; }
  function mean(a) { a = a.filter(function (x) { return x != null; }); return a.length ? a.reduce(function (s, x) { return s + x; }, 0) / a.length : null; }

  // RUTA AUTORITATIVA: construye MX desde la pestaña "Preguntas" (window.Q3_PREGUNTAS_MX),
  // que trae valor + Bloque + Tema + Área por pregunta (consistente con el Q2).
  function buildFromPreguntas(P) {
    var qs = P.questions;
    var questions = qs.map(function (q) {
      return { no: q.no, bloque: q.bloque, tema: q.tema, area: q.area || "City", mex: q.mex, colper: q.mex };
    });
    var blocks = []; qs.forEach(function (q) { if (q.bloque && blocks.indexOf(q.bloque) < 0) blocks.push(q.bloque); });
    var temasOf = {}; blocks.forEach(function (b) { temasOf[b] = []; });
    qs.forEach(function (q) { if (q.bloque && q.tema && temasOf[q.bloque].indexOf(q.tema) < 0) temasOf[q.bloque].push(q.tema); });
    var allTemas = []; qs.forEach(function (q) { if (q.tema && allTemas.indexOf(q.tema) < 0) allTemas.push(q.tema); });

    var byName = {}, byNum = {}, byKitchenQuestion = {}, byKitchenBloque = {}, byKitchenTema = {};
    var kitchens = [], pendingNorms = {};
    Object.keys(P.byKitchen).forEach(function (nm) {
      var bq = P.byKitchen[nm];
      var meta = (P.meta && P.meta[nm]) || { name: nm, city: "" };
      var num = kitchenNum(meta.name);
      var values = questions.map(function (q) { return bq[q.no] != null ? bq[q.no] : null; });
      var bqOut = {}; questions.forEach(function (q) { bqOut[q.no] = bq[q.no] != null ? bq[q.no] : null; });
      byKitchenQuestion[nm] = bqOut;
      var teAcc = {}; questions.forEach(function (q) { var v = bq[q.no]; if (v == null || !q.tema) return; (teAcc[q.tema] = teAcc[q.tema] || []).push(v); });
      var temaVals = {}; allTemas.forEach(function (t) { temaVals[t] = teAcc[t] ? mean(teAcc[t]) : null; });
      byKitchenTema[nm] = temaVals;
      var blkVals = {}; blocks.forEach(function (b) { blkVals[b] = mean(temasOf[b].map(function (t) { return temaVals[t]; })); });
      byKitchenBloque[nm] = blkVals;
      var basic = mean(questions.map(function (q) { return bq[q.no]; }));
      if (basic != null) { byName[nm] = basic; if (num) byNum[num] = basic; }
      kitchens.push({ country: "México", name: meta.name, city: meta.city || "", values: values });
    });
    (P.pending || []).forEach(function (p) { pendingNorms[norm(p)] = true; });
    var byBloque = {}, byTema = {};
    blocks.forEach(function (b) { byBloque[b] = mean(Object.keys(byKitchenBloque).map(function (nm) { return byKitchenBloque[nm][b]; })); });
    allTemas.forEach(function (t) { byTema[t] = mean(Object.keys(byKitchenTema).map(function (nm) { return byKitchenTema[nm][t]; })); });

    window.FORM_SCORES.MX = {
      byName: byName, byNum: byNum, byKitchenQuestion: byKitchenQuestion,
      byKitchenBloque: byKitchenBloque, byKitchenTema: byKitchenTema,
      byBloque: byBloque, byTema: byTema,
      _questions: questions, _meta: { quarter: "Q3 2026", source: "Preguntas" },
      __realNorms: Object.keys(byName), _isQ3: true
    };
    window.SHEET_DETAIL_DATA_MX_Q3 = { questions: questions, kitchens: kitchens };
    window.Q3_PENDING_MX = pendingNorms;
    window.CURRENT_DIAG_LABEL = "Q3 2026";
    return true;
  }

  window.buildQ3MX = function () {
    var S = window.Q3_SCHEMA, D = window.Q3_DATA;
    if (!S || !D || !D.answered) return false;
    // Guardar el Q2 previo de MX (para el Comparativo) antes de sobrescribir.
    window.FORM_SCORES = window.FORM_SCORES || {};
    if (window.FORM_SCORES.MX && !window.FORM_SCORES.MX._isQ3) window.Q2_FORM_MX = window.FORM_SCORES.MX;
    // Fuente preferida: pestaña "Preguntas" (autoritativa). Si no se ha sincronizado,
    // cae a la ruta anterior (Resultados + crudo congelado).
    var P = window.Q3_PREGUNTAS_MX;
    if (P && P.questions && P.questions.length && P.byKitchen && Object.keys(P.byKitchen).length) {
      return buildFromPreguntas(P);
    }
    var qByNo = {}; S.questions.forEach(function (q) { qByNo[q.no] = q; });

    function val(no, raw) {
      var q = qByNo[no];
      var n = norm(raw);
      var v = n === "SI" ? 100 : n === "PARCIALMENTE" ? 50 : n === "NO" ? 0 : null;
      if (v == null) return null;
      return (q && q.inverted) ? 100 - v : v;
    }

    // Área (pilar responsable) por básico del Q3: City / Quality / Admin / People.
    // Tomada de la columna "Área" de la hoja de planes (fuente real) para los 32
    // básicos que tienen plan; los 5 sin plan (8,9,20,22,37) quedan estimados.
    var AREA = {
      1:"City", 2:"City", 3:"Quality", 4:"Quality", 5:"Admin", 6:"City",
      7:"City", 8:"Admin", 9:"Quality", 10:"City", 11:"City", 12:"Quality",
      13:"City", 14:"City", 15:"City", 16:"City", 17:"Quality", 18:"Admin",
      19:"Quality", 20:"Quality", 21:"Quality", 22:"Quality", 23:"City", 24:"City",
      25:"City", 26:"City", 27:"City", 28:"Admin", 29:"City", 30:"City",
      31:"Admin", 32:"People", 33:"People", 34:"Admin", 35:"Admin", 36:"City", 37:"City"
    };
    // Lista de preguntas en el formato de SHEET_DETAIL_DATA (con texto original).
    var questions = S.questions.map(function (q) {
      return { no: q.no, bloque: q.block, tema: q.subarea, area: AREA[q.no] || "City", mex: FULL[q.no] || q.text, colper: FULL[q.no] || q.text, inverted: !!q.inverted };
    });

    var byName = {}, byNum = {}, byKitchenQuestion = {}, byKitchenBloque = {}, byKitchenTema = {};
    var kitchens = [];
    var pendingNorms = {};

    Object.keys(D.answered).forEach(function (name) {
      var k = D.answered[name];
      var nm = norm(name), num = kitchenNum(name);
      var bq = {}, values = [];
      questions.forEach(function (q) {
        var v = val(q.no, k.byQuestion[q.no]);
        bq[q.no] = v;
        values.push(v);
      });
      byKitchenQuestion[nm] = bq;
      // Sub-áreas (tema) y bloques por cocina
      var temaVals = {};
      S.subareas.forEach(function (sa) { temaVals[sa.name] = mean(sa.questionNos.map(function (no) { return val(no, k.byQuestion[no]); })); });
      byKitchenTema[nm] = temaVals;
      var blkVals = {};
      S.blocks.forEach(function (b) { blkVals[b] = mean(S.subareas.filter(function (sa) { return sa.block === b; }).map(function (sa) { return temaVals[sa.name]; })); });
      byKitchenBloque[nm] = blkVals;
      var basic = mean(questions.map(function (q) { return val(q.no, k.byQuestion[q.no]); }));
      if (basic != null) { byName[nm] = basic; if (num) byNum[num] = basic; }
      kitchens.push({ country: "México", name: name, city: k.city || "", values: values });
    });

    // ── Fusión con la pestaña "Resultados Q3" (sincronizada en vivo) ──
    // Cubre TODAS las cocinas con dato (no solo las que tienen respuesta cruda).
    // Basic/bloques/sub-áreas vienen de ahí (autoritativo, = al sheet); las
    // respuestas por pregunta y observaciones siguen del crudo donde existan.
    var R = window.Q3_RESULTS_MX;
    var kitchenByNorm = {};
    kitchens.forEach(function (k) { kitchenByNorm[norm(k.name)] = k; });
    if (R && Object.keys(R).length) {
      Object.keys(R).forEach(function (nm) {
        var r = R[nm];
        if (r.basic == null) { pendingNorms[nm] = true; return; } // sin datos → pendiente
        byName[nm] = r.basic;
        var num = kitchenNum(r.name);
        if (num) byNum[num] = r.basic;
        if (r.blocks) byKitchenBloque[nm] = r.blocks;
        if (r.subareas) byKitchenTema[nm] = r.subareas;
        // Si no hay fila cruda para esta cocina, agregarla (sin values por pregunta).
        if (!kitchenByNorm[nm]) {
          var kk = { country: "México", name: r.name, city: r.city || "", values: [] };
          kitchens.push(kk); kitchenByNorm[nm] = kk;
        }
      });
    } else {
      (D.pending || []).forEach(function (p) { pendingNorms[norm(p)] = true; });
    }

    // Promedios país por bloque y por sub-área (sobre cocinas con dato)
    var byBloque = {}, byTema = {};
    S.blocks.forEach(function (b) { byBloque[b] = mean(Object.keys(byKitchenBloque).map(function (nm) { return byKitchenBloque[nm][b]; })); });
    S.subareas.forEach(function (sa) { byTema[sa.name] = mean(Object.keys(byKitchenTema).map(function (nm) { return byKitchenTema[nm][sa.name]; })); });

    // Guardar el Q2 previo de MX (para el Comparativo) antes de sobrescribir.
    window.FORM_SCORES = window.FORM_SCORES || {};
    if (window.FORM_SCORES.MX && !window.FORM_SCORES.MX._isQ3) {
      window.Q2_FORM_MX = window.FORM_SCORES.MX;
    }

    window.FORM_SCORES.MX = {
      byName: byName, byNum: byNum, byKitchenQuestion: byKitchenQuestion,
      byKitchenBloque: byKitchenBloque, byKitchenTema: byKitchenTema,
      byBloque: byBloque, byTema: byTema,
      _questions: questions, _meta: { quarter: D.quarterLabel || "Q3 2026" },
      __realNorms: Object.keys(byName), _isQ3: true
    };
    window.SHEET_DETAIL_DATA_MX_Q3 = { questions: questions, kitchens: kitchens };
    window.Q3_PENDING_MX = pendingNorms;
    window.CURRENT_DIAG_LABEL = D.quarterLabel || "Q3 2026";
    return true;
  };
})();
