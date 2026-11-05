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
  var META_CO = [
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

  // ── México (47 preguntas, formulario Basics 2.0) ──────────────────────────
  // Tema/Área autoritativos (hoja maestra "Basics 2.0 | Q4 2026" · MX Preguntas).
  // Bloque derivado del tema (misma taxonomía que CO). Invertidas: 1 (cables), 10 (plagas).
  // Nivel 2.0 (l2): detectado del formulario (opción "versión 1.0") + nuevas 21/22.
  var META_MX = [
    { no: 1,  bloque: SEG, tema: "Seguridad eléctrica y de gas", area: "City",    inverted: true, l2: true, text: "¿Se identifican cables expuestos, extensiones o conexiones improvisadas que puedan representar un riesgo eléctrico?" },
    { no: 2,  bloque: SEG, tema: "Seguridad eléctrica y de gas", area: "City",    text: "¿Las tuberías de gas están sin fugas detectables (olor / detector)?" },
    { no: 3,  bloque: HIG, tema: "EPP e higiene personal",       area: "Quality", l2: true, text: "La cocina cuenta con estación de lavado de manos independiente?" },
    { no: 4,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "Quality", text: "¿Se cuenta con un método de comprobación de agua potable diario (análisis físico-químico *medición cloro residual)" },
    { no: 5,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "Quality", l2: true, nuevo: true, text: "¿Se cuenta con un método de comprobación de agua potable anual (análisis microbiológico)? Comprobar vigencia del análisis" },
    { no: 6,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "Admin",   text: "¿Se garantiza el uso de agua potable en las cocinas? (Control de lavado de tinacos, uso de filtros de agua o agua de bidón)" },
    { no: 7,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "City",    text: "¿Las coladeras/drenajes (de piso, tarjas y lavabos) funcionan sin obstrucciones ni malos olores?" },
    { no: 8,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "City",    l2: true, nuevo: true, text: "¿Las coladeras (de piso, tarjas y lavabos) evitan la entrada de plaga?" },
    { no: 9,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "City",    l2: true, nuevo: true, text: "¿Las coladeras (de piso, tarjas y lavabos) son fáciles de lavar/limpiar?" },
    { no: 10, bloque: LIM, tema: "Control de plagas",            area: "Admin",   inverted: true, l2: true, text: "¿Se observan signos de plagas (insectos, roedores, excretas, mordeduras)?" },
    { no: 11, bloque: LIM, tema: "Control de plagas",            area: "Admin",   text: "¿Hay plan de fumigación vigente con registros del proveedor autorizado?" },
    { no: 12, bloque: LIM, tema: "Control de plagas",            area: "Quality", text: "¿El personal ha sido capacitado en prevención de plagas en los últimos 6 meses?" },
    { no: 13, bloque: LIM, tema: "Control de plagas",            area: "City",    l2: true, text: "¿Se han cerrado los puntos de ingreso o anidación detectados?" },
    { no: 14, bloque: SEG, tema: "Refrigeración constante",      area: "City",    text: "¿Todos los refrigeradores y congeladores operan dentro de los rangos (0–4 °C / –18 °C)?" },
    { no: 15, bloque: SEG, tema: "Refrigeración constante",      area: "City",    l2: true, nuevo: true, text: "¿Ningún refrigerador tiene fugas/goteo de agua?" },
    { no: 16, bloque: SEG, tema: "Refrigeración constante",      area: "Quality", text: "¿Se registran las temperatura de los refrigeradores y congeladores al menos 2 veces al día en los formatos correspondientes?" },
    { no: 17, bloque: SEG, tema: "Iluminación y ventilación",    area: "City",    text: "¿La iluminación permite ver claramente las áreas de trabajo?" },
    { no: 18, bloque: SEG, tema: "Iluminación y ventilación",    area: "City",    text: "¿Los focos de las campanas sel área caliente funcionan correctamente?" },
    { no: 19, bloque: SEG, tema: "Iluminación y ventilación",    area: "City",    l2: true, text: "¿Extractores, ventiladores y aires funcionan correctamente?" },
    { no: 20, bloque: SEG, tema: "Equipos críticos",            area: "City",    text: "¿El 100% de los equipos están operativos?" },
    { no: 21, bloque: SEG, tema: "Equipos críticos",            area: "City",    l2: true, nuevo: true, text: "La cocina cuenta con la cantidad suficiente de tablets funcionales para garantizar una operación eficiente?" },
    { no: 22, bloque: SEG, tema: "Equipos críticos",            area: "City",    l2: true, nuevo: true, text: "¿La cocina cuenta con una conexión a internet estable y funcional para garantizar la operación?" },
    { no: 23, bloque: SEG, tema: "Equipos críticos",            area: "Quality", l2: true, text: "¿Se registran, en el formato correspondiente, los mantenimientos preventivos y correctivos que se realizan en la cocina?" },
    { no: 24, bloque: SEG, tema: "Equipos críticos",            area: "Admin",   text: "¿La trampa de grasa funciona adecuadamente? (sin fugas, desborde de desechos, ruturas u óxidos)" },
    { no: 25, bloque: SEG, tema: "Equipos críticos",            area: "Admin",   l2: true, nuevo: true, text: "¿El servicio de limpieza de grasa se realiza cada mes y de manera correcta?" },
    { no: 26, bloque: LIM, tema: "Limpieza y desinfección",     area: "Quality", text: "¿Existe cronograma de limpieza diaria y profunda visible en la cocina?" },
    { no: 27, bloque: LIM, tema: "Limpieza y desinfección",     area: "City",    text: "¿Se realizan limpiezas profundas según cronograma de aseo y se hace seguimiento del mismo?" },
    { no: 28, bloque: LIM, tema: "Limpieza y desinfección",     area: "City",    l2: true, nuevo: true, text: "¿La cocina cuenta con un área exclusiva y adecuada para la limpieza y el lavado de los utensilios y herramientas de limpieza?" },
    { no: 29, bloque: LIM, tema: "Gestión de residuos",         area: "Quality", text: "¿Se usan botes de basura rotulados para separación según categoría?" },
    { no: 30, bloque: LIM, tema: "Gestión de residuos",         area: "Quality", text: "¿El personal ha sido entrenado en manejo de residuos y reciclaje en los últimos 6 meses?" },
    { no: 31, bloque: LIM, tema: "Gestión de residuos",         area: "City",    text: "¿El área de almacenamiento de basura (contenedores/cuarto de basura con contenedores) está lo más retirada posible al área de producción y se encuentra en buen estado sanitario (limpio y cerrado)?" },
    { no: 32, bloque: LIM, tema: "Gestión de residuos",         area: "City",    l2: true, nuevo: true, text: "¿La frecuencia de recolección de residuos es suficiente para evitar su acumulación en la cocina?" },
    { no: 33, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿El piso está sin losetas sueltas ni fisuras, y seguro para el personal?" },
    { no: 34, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿Las paredes están sin grietas, humedad ni desprendimiento de pintura?" },
    { no: 35, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿Los techos están libres de moho o filtraciones?" },
    { no: 36, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿Hay soclos instaladas en las paredes de las zonas operativas?" },
    { no: 37, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    l2: true, nuevo: true, text: "¿Las paredes, los techos y los pisos están construidos y se mantienen en condiciones que evitan la formación de refugios o sitios de anidación de plagas?" },
    { no: 38, bloque: INF, tema: "Utensilios y superficies",    area: "Admin",   text: "¿Los utensilios están en buen estado sin óxido ni fisuras?" },
    { no: 39, bloque: INF, tema: "Utensilios y superficies",    area: "Admin",   text: "¿La cocina cuenta con un espacio de lockers o almacenamiento de pertenencias en buen estado (sin óxido, sin fisuras, derechos y completos)?" },
    { no: 40, bloque: INF, tema: "Utensilios y superficies",    area: "City",    text: "¿Existe una separación clara entre área de lavado y operativa?" },
    { no: 41, bloque: INF, tema: "Utensilios y superficies",    area: "Admin",   text: "¿El almacenamiento (racks, cubetas, insertos, o estanterías de acómodo y almacén) del menaje está estandarizado e higiénico?" },
    { no: 42, bloque: HIG, tema: "People",                       area: "People",  l2: true, text: "¿Todo el personal cuenta con uniforme completo y en buen estado (playera y mandil)?" },
    { no: 43, bloque: HIG, tema: "People",                       area: "People",  text: "¿La dotación se reemplaza con la frecuencia establecida?" },
    { no: 44, bloque: HIG, tema: "People",                       area: "Admin",   text: "¿Hay un espacio adecuado para que el personal pueda comer cómodamente (mesas y sillas)?" },
    { no: 45, bloque: HIG, tema: "People",                       area: "Admin",   text: "¿La cocina dispone de platos, vasos y cubiertos suficientes y en buen estado para el personal?" },
    { no: 46, bloque: HIG, tema: "People",                       area: "City",    text: "¿Los baños se encuentran limpios y en buen estado?" },
    { no: 47, bloque: HIG, tema: "People",                       area: "Admin",   text: "¿Siempre hay disponibilidad de papel higiénico, jabón y toallas para secarse las manos?" },
  ];

  // ── Perú (42 preguntas, formulario Basics 2.0) ────────────────────────────
  // Tema/Área autoritativos (hoja maestra · PE Preguntas). Invertidas: 1, 7, 14.
  var META_PE = [
    { no: 1,  bloque: SEG, tema: "Seguridad eléctrica y de gas", area: "City",    inverted: true, text: "¿Se identifican cables expuestos, extensiones o conexiones improvisadas que puedan representar un riesgo eléctrico?" },
    { no: 2,  bloque: SEG, tema: "Seguridad eléctrica y de gas", area: "City",    text: "¿Las tuberías de gas están protegidas y sin fugas detectables (olor / detector)?" },
    { no: 3,  bloque: HIG, tema: "EPP e higiene personal",       area: "Quality", l2: true, text: "La cocina cuenta con estación de lavado de manos independiente?" },
    { no: 4,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "Quality", text: "¿Se cuenta con un método de comprobación de agua potable (análisis físico-químico y microbiológico)?" },
    { no: 5,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "Admin",   text: "¿Se garantiza el uso de agua potable en las cocinas? (Control de lavado de tanques, uso de filtros de agua o agua de bidón)" },
    { no: 6,  bloque: INF, tema: "Sistemas de agua y drenaje",   area: "City",    text: "¿Los drenajes (de piso, tarjas y lavabos) funcionan sin obstrucciones ni malos olores?" },
    { no: 7,  bloque: LIM, tema: "Control de plagas",            area: "Admin",   inverted: true, text: "¿Se observan signos de plagas (insectos, roedores, excretas, mordeduras)?" },
    { no: 8,  bloque: LIM, tema: "Control de plagas",            area: "Admin",   text: "¿Hay plan de fumigación vigente con registros del proveedor autorizado?" },
    { no: 9,  bloque: LIM, tema: "Control de plagas",            area: "Quality", text: "¿El personal ha sido capacitado en prevención de plagas en los últimos 6 meses?" },
    { no: 10, bloque: LIM, tema: "Control de plagas",            area: "City",    l2: true, text: "¿Se han cerrado los puntos de ingreso o anidación detectados?" },
    { no: 11, bloque: SEG, tema: "Refrigeración constante",      area: "City",    text: "¿Todos los refrigeradores y congeladores operan dentro de los rangos (0–4 °C / –18 °C)?" },
    { no: 12, bloque: SEG, tema: "Refrigeración constante",      area: "Quality", text: "¿Los registros de temperatura se encuentran diligenciados al menos dos veces al día y están completos?" },
    { no: 13, bloque: SEG, tema: "Iluminación y ventilación",    area: "City",    text: "¿La iluminación permite ver claramente las áreas de trabajo?" },
    { no: 14, bloque: SEG, tema: "Iluminación y ventilación",    area: "City",    inverted: true, text: "¿Hay focos fundidos o luminarias sin protección?" },
    { no: 15, bloque: SEG, tema: "Iluminación y ventilación",    area: "City",    l2: true, text: "¿Extractores, ventiladores y aires funcionan correctamente?" },
    { no: 16, bloque: SEG, tema: "Equipos críticos",            area: "City",    text: "¿El 100% de los equipos de cocina se encuentran operativos?" },
    { no: 17, bloque: SEG, tema: "Equipos críticos",            area: "City",    text: "¿El 100% de los equipos de apoyo a la operación se encuentran operativos?" },
    { no: 18, bloque: SEG, tema: "Equipos críticos",            area: "Quality", text: "¿Existen registros de mantenimientos preventivos y correctivos?" },
    { no: 19, bloque: SEG, tema: "Equipos críticos",            area: "Admin",   text: "¿La trampa de grasa funciona adecuadamente y se limpia de acuerdo al cronograma de aseo?" },
    { no: 20, bloque: SEG, tema: "Equipos críticos",            area: "Admin",   l2: true, nuevo: true, text: "La cocina cuenta con la cantidad suficiente de tablets funcionales para garantizar una operación eficiente?" },
    { no: 21, bloque: SEG, tema: "Equipos críticos",            area: "Admin",   l2: true, nuevo: true, text: "¿La cocina cuenta con una conexión a internet estable y funcional para garantizar la operación?" },
    { no: 22, bloque: LIM, tema: "Limpieza y desinfección",     area: "Quality", text: "¿Existe cronograma de limpieza diaria y profunda visible en la cocina?" },
    { no: 23, bloque: LIM, tema: "Limpieza y desinfección",     area: "Quality", l2: true, nuevo: true, text: "¿La cocina cuenta con los insumos de aseo aprobados por Calidad y en las cantidades necesarias para cumplir con la frecuencia de entrega establecida?" },
    { no: 24, bloque: LIM, tema: "Limpieza y desinfección",     area: "Quality", l2: true, nuevo: true, text: "¿Se cumplen los procesos de limpieza y desinfección establecidos en el Programa del Plan de Saneamiento?" },
    { no: 25, bloque: LIM, tema: "Limpieza y desinfección",     area: "City",    text: "¿Se realizan limpiezas profundas según cronograma de aseo y se hace seguimiento del mismo?" },
    { no: 26, bloque: LIM, tema: "Gestión de residuos",         area: "Quality", text: "¿Se usan botes de basura rotulados para separación según categoría?" },
    { no: 27, bloque: LIM, tema: "Gestión de residuos",         area: "Quality", text: "¿El personal ha sido entrenado en manejo de residuos y reciclaje?" },
    { no: 28, bloque: LIM, tema: "Gestión de residuos",         area: "City",    l2: true, text: "¿El área de almacenamiento de basura (shut) está aislada y en buen estado sanitario (limpio y cerrado)?" },
    { no: 29, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿El piso está sin baldosas sueltas ni fisuras, y seguro para el personal?" },
    { no: 30, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿Las paredes están sin grietas, humedad ni desprendimiento de pintura?" },
    { no: 31, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿Los techos están libres de moho o filtraciones?" },
    { no: 32, bloque: INF, tema: "Pisos, paredes y techos",     area: "City",    text: "¿Hay mediacañas instaladas en zonas operativas?" },
    { no: 33, bloque: INF, tema: "Utensilios y superficies",    area: "Admin",   text: "¿Los utensilios están en buen estado sin óxido ni fisuras?" },
    { no: 34, bloque: INF, tema: "Utensilios y superficies",    area: "Admin",   text: "¿La cocina cuenta con un espacio de lockers o almacenamiento de pertenencias en buen estado (sin óxido, sin fisuras)?" },
    { no: 35, bloque: INF, tema: "Utensilios y superficies",    area: "City",    text: "¿Existe una separación clara entre área de lavado y operativa?" },
    { no: 36, bloque: INF, tema: "Utensilios y superficies",    area: "Admin",   text: "¿El almacenamiento del menaje está estandarizado e higiénico?" },
    { no: 37, bloque: HIG, tema: "People",                       area: "People",  l2: true, text: "¿Todo el personal, con más de un mes, cuenta con uniforme completo y en buen estado (pantalón,  delantal, polo)?" },
    { no: 38, bloque: HIG, tema: "People",                       area: "People",  text: "¿La dotación se reemplaza con la frecuencia establecida?" },
    { no: 39, bloque: HIG, tema: "People",                       area: "Admin",   text: "¿Hay un espacio adecuado para que el personal pueda comer cómodamente (mesas y sillas)?" },
    { no: 40, bloque: HIG, tema: "People",                       area: "Admin",   text: "¿La cocina dispone de platos, vasos y cubiertos suficientes y en buen estado para el personal?" },
    { no: 41, bloque: HIG, tema: "People",                       area: "City",    text: "¿Los baños se encuentran limpios y en buen estado?" },
    { no: 42, bloque: HIG, tema: "People",                       area: "People",  text: "¿Siempre hay disponibilidad de papel higiénico, jabón y toallas para secarse las manos?" },
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
  function buildAggregates(stateByKitchen, metaByKitchen, version, metaDef) {
    var META = metaDef || window.CO_BASICS_META || META_CO;
    var blocks = []; META.forEach(function (q) { if (blocks.indexOf(q.bloque) < 0) blocks.push(q.bloque); });
    var temas = [];  META.forEach(function (q) { if (temas.indexOf(q.tema) < 0) temas.push(q.tema); });

    var byName = {}, byNum = {}, byKitchenQuestion = {}, byKitchenBloque = {}, byKitchenTema = {};
    Object.keys(stateByKitchen).forEach(function (nm) {
      var states = stateByKitchen[nm];
      var m = (metaByKitchen && metaByKitchen[nm]) || { name: nm };
      var num = kitchenNum(m.name);
      var byQ = {}, teAcc = {}, blAcc = {}, all = [];
      META.forEach(function (q) {
        // Las preguntas nuevas pertenecen solo al estándar 2.0: no entran en la métrica 1.0
        // (Basics 1.0 = estándar original, comparable con el Q anterior).
        if (version === "1.0" && q.nuevo) return;
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

  window.CO_BASICS_META = META_CO;
  window.MX_BASICS_META = META_MX;
  window.PE_BASICS_META = META_PE;
  window.BASICS_META_BY_COUNTRY = { CO: META_CO, MX: META_MX, PE: META_PE };
  window.basicsAnswerState = answerState;
  window.basicsValue = basicsValue;
  window.buildBasicsAggregates = buildAggregates;
  window.basicsNorm = norm;
})();
