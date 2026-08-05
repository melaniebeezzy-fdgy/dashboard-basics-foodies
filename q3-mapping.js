// Mapeo Q3 validado contra "Resultados Q3 2026". Generado por análisis.
// Fuente RAW (respuestas): gid=0 del spreadsheet 186o3CErXrysBMijH40Pnoq0K2C4OzxWFgA9G_WeWStE
//   Layout RAW: col0="Marca temporal", col1="Selecciona la cocina:", luego grupos de 3
//   columnas por pregunta [respuesta, evidencia 📷, observación 📝]. Respuesta de la
//   pregunta q (q=1..37) en la columna (0-based) = 2 + (q-1)*3.
// Conversión: Sí=100, Parcialmente=50, No=0, vacío = se excluye del promedio.
// En preguntas INVERTIDAS ("Sí" es malo) se invierte: Sí=0, No=100, Parcialmente=50.
window.Q3_SCHEMA = {
  blocks: [
    "Seguridad y condiciones operativas",
    "Higiene personal y sanitaria",
    "Limpieza desinfección y control ambiental",
    "Infraestructura y mantenimiento"
  ],
  subareas: [
    { name:"Seguridad eléctrica y de gas",              block:"Seguridad y condiciones operativas",           questionNos:[1,2] },
    { name:"Refrigeración constante",                    block:"Seguridad y condiciones operativas",           questionNos:[11,12] },
    { name:"Iluminación y ventilación",                  block:"Seguridad y condiciones operativas",           questionNos:[13,14,15] },
    { name:"Equipos críticos",                           block:"Seguridad y condiciones operativas",           questionNos:[16,17,18] },
    { name:"Estación de lavado de manos",                block:"Higiene personal y sanitaria",                 questionNos:[3] },
    { name:"Dotación, uniformes y servicios al personal",block:"Higiene personal y sanitaria",                 questionNos:[32,33,34,35,36,37] },
    { name:"Control y manejo de plagas",                 block:"Limpieza desinfección y control ambiental",    questionNos:[7,8,9,10] },
    { name:"Programa de limpieza y desinfección",        block:"Limpieza desinfección y control ambiental",    questionNos:[19,20] },
    { name:"Manejo de residuos",                         block:"Limpieza desinfección y control ambiental",    questionNos:[21,22,23] },
    { name:"Pisos, paredes, techos y zoclos",            block:"Infraestructura y mantenimiento",              questionNos:[24,25,26,27] },
    { name:"Utensilios, lockers y áreas de trabajo",     block:"Infraestructura y mantenimiento",              questionNos:[28,29,30,31] },
    { name:"Agua potable y drenajes",                    block:"Infraestructura y mantenimiento",              questionNos:[4,5,6] }
  ],
  questions: [
    { no:1,  col:2,   subarea:"Seguridad eléctrica y de gas",              block:"Seguridad y condiciones operativas",        inverted:true,  text:"¿Se identifican cables expuestos? (Sí = riesgo)" },
    { no:2,  col:5,   subarea:"Seguridad eléctrica y de gas",              block:"Seguridad y condiciones operativas",        inverted:false, text:"¿Las tuberías de gas están protegidas y sin fugas detectables?" },
    { no:3,  col:8,   subarea:"Estación de lavado de manos",               block:"Higiene personal y sanitaria",              inverted:false, text:"¿Se cuenta con estación de lavado de manos equipada?" },
    { no:4,  col:11,  subarea:"Agua potable y drenajes",                   block:"Infraestructura y mantenimiento",           inverted:false, text:"¿Se realiza la comprobación de agua potable (análisis/lavado de cisterna)?" },
    { no:5,  col:14,  subarea:"Agua potable y drenajes",                   block:"Infraestructura y mantenimiento",           inverted:false, text:"¿Se usa agua potable / se cuenta con filtros?" },
    { no:6,  col:17,  subarea:"Agua potable y drenajes",                   block:"Infraestructura y mantenimiento",           inverted:false, text:"¿Las coladeras/drenajes funcionan correctamente?" },
    { no:7,  col:20,  subarea:"Control y manejo de plagas",                block:"Limpieza desinfección y control ambiental", inverted:true,  text:"¿Se observan signos de plagas? (Sí = malo)" },
    { no:8,  col:23,  subarea:"Control y manejo de plagas",                block:"Limpieza desinfección y control ambiental", inverted:false, text:"¿Existe plan de fumigación vigente?" },
    { no:9,  col:26,  subarea:"Control y manejo de plagas",                block:"Limpieza desinfección y control ambiental", inverted:false, text:"¿El personal está capacitado en prevención de plagas?" },
    { no:10, col:29,  subarea:"Control y manejo de plagas",                block:"Limpieza desinfección y control ambiental", inverted:false, text:"¿Están cerrados los puntos de ingreso/anidación de plagas?" },
    { no:11, col:32,  subarea:"Refrigeración constante",                   block:"Seguridad y condiciones operativas",        inverted:false, text:"¿Los refrigeradores/congeladores operan dentro de rango?" },
    { no:12, col:35,  subarea:"Refrigeración constante",                   block:"Seguridad y condiciones operativas",        inverted:false, text:"¿Existen registros de temperatura?" },
    { no:13, col:38,  subarea:"Iluminación y ventilación",                 block:"Seguridad y condiciones operativas",        inverted:false, text:"¿La iluminación es adecuada en las áreas de trabajo?" },
    { no:14, col:41,  subarea:"Iluminación y ventilación",                 block:"Seguridad y condiciones operativas",        inverted:true,  text:"¿Hay focos fundidos / luminarias sin protección? (Sí = malo)" },
    { no:15, col:44,  subarea:"Iluminación y ventilación",                 block:"Seguridad y condiciones operativas",        inverted:false, text:"¿Los extractores, ventiladores y aires funcionan correctamente?" },
    { no:16, col:47,  subarea:"Equipos críticos",                          block:"Seguridad y condiciones operativas",        inverted:false, text:"¿El 100% de los equipos críticos están operativos?" },
    { no:17, col:50,  subarea:"Equipos críticos",                          block:"Seguridad y condiciones operativas",        inverted:false, text:"¿Existen registros de mantenimientos preventivos/correctivos?" },
    { no:18, col:53,  subarea:"Equipos críticos",                          block:"Seguridad y condiciones operativas",        inverted:false, text:"¿La trampa de grasa recibe mantenimiento adecuado?" },
    { no:19, col:56,  subarea:"Programa de limpieza y desinfección",       block:"Limpieza desinfección y control ambiental", inverted:false, text:"¿El cronograma de limpieza está visible y se cumple?" },
    { no:20, col:59,  subarea:"Programa de limpieza y desinfección",       block:"Limpieza desinfección y control ambiental", inverted:false, text:"¿Se realizan limpiezas profundas programadas?" },
    { no:21, col:62,  subarea:"Manejo de residuos",                        block:"Limpieza desinfección y control ambiental", inverted:false, text:"¿Los botes de basura están rotulados y con tapa/bolsa?" },
    { no:22, col:65,  subarea:"Manejo de residuos",                        block:"Limpieza desinfección y control ambiental", inverted:false, text:"¿El personal está entrenado en manejo de residuos?" },
    { no:23, col:68,  subarea:"Manejo de residuos",                        block:"Limpieza desinfección y control ambiental", inverted:false, text:"¿Existe un área adecuada de almacenamiento de basura?" },
    { no:24, col:71,  subarea:"Pisos, paredes, techos y zoclos",           block:"Infraestructura y mantenimiento",           inverted:false, text:"¿El piso está sin losetas sueltas / fisuras?" },
    { no:25, col:74,  subarea:"Pisos, paredes, techos y zoclos",           block:"Infraestructura y mantenimiento",           inverted:false, text:"¿Las paredes están sin grietas?" },
    { no:26, col:77,  subarea:"Pisos, paredes, techos y zoclos",           block:"Infraestructura y mantenimiento",           inverted:false, text:"¿Los techos están sin moho / filtraciones?" },
    { no:27, col:80,  subarea:"Pisos, paredes, techos y zoclos",           block:"Infraestructura y mantenimiento",           inverted:false, text:"¿Los zoclos/soclos están instalados correctamente?" },
    { no:28, col:83,  subarea:"Utensilios, lockers y áreas de trabajo",    block:"Infraestructura y mantenimiento",           inverted:false, text:"¿Los utensilios están en buen estado?" },
    { no:29, col:86,  subarea:"Utensilios, lockers y áreas de trabajo",    block:"Infraestructura y mantenimiento",           inverted:false, text:"¿Se cuenta con lockers en buen estado?" },
    { no:30, col:89,  subarea:"Utensilios, lockers y áreas de trabajo",    block:"Infraestructura y mantenimiento",           inverted:false, text:"¿Existe separación entre zona de lavado y operativa?" },
    { no:31, col:92,  subarea:"Utensilios, lockers y áreas de trabajo",    block:"Infraestructura y mantenimiento",           inverted:false, text:"¿El almacenamiento del menaje es estandarizado e higiénico?" },
    { no:32, col:95,  subarea:"Dotación, uniformes y servicios al personal",block:"Higiene personal y sanitaria",             inverted:false, text:"¿El personal cuenta con uniforme/EPP completo?" },
    { no:33, col:98,  subarea:"Dotación, uniformes y servicios al personal",block:"Higiene personal y sanitaria",             inverted:false, text:"¿La dotación se reemplaza con la frecuencia establecida?" },
    { no:34, col:101, subarea:"Dotación, uniformes y servicios al personal",block:"Higiene personal y sanitaria",             inverted:false, text:"¿Existe espacio adecuado para comer?" },
    { no:35, col:104, subarea:"Dotación, uniformes y servicios al personal",block:"Higiene personal y sanitaria",             inverted:false, text:"¿Se cuenta con platos/vasos/cubiertos para el personal?" },
    { no:36, col:107, subarea:"Dotación, uniformes y servicios al personal",block:"Higiene personal y sanitaria",             inverted:false, text:"¿Los baños están limpios y en buen estado?" },
    { no:37, col:110, subarea:"Dotación, uniformes y servicios al personal",block:"Higiene personal y sanitaria",             inverted:false, text:"¿Se cuenta con papel/jabón/toallas en los baños?" }
  ],
  value: { "SI":100, "SÍ":100, "PARCIALMENTE":50, "NO":0 },   // conversión base (normal)
  blockFormula: "meanSubareas",   // % bloque = promedio de sus sub-áreas
  basicFormula: "meanQuestions"   // Basic = promedio de las 37 preguntas (excluyendo vacías)
};

/* =========================================================================
   (1) REPORTE DE VALIDACIÓN
   -------------------------------------------------------------------------
   Se derivó el mapeo comparando el promedio calculado (con inversiones
   Sí/No/Parcialmente) contra "Resultados Q3 2026" (col3..col14 sub-áreas,
   col15..col18 bloques, col19 Basic). Se usaron 13 cocinas con datos limpios:
   01 DOCTORES, 23 SANTA CATARINA, 38 SALTILLO CENTRO, 11 AZCAPOTZALCO,
   09 CHURUBUSCO, 15 LINDAVISTA, 16 PEDREGAL, 27 IZTAPALAPA, 05 COAPA,
   02 SAN ANGEL, 51 SAMARA, 37 CANEK, 12 DEL VALLE.

   Fórmulas confirmadas:
     - Sub-área  = promedio de sus preguntas (excluyendo vacías)   -> exacto
     - Bloque    = promedio de sus sub-áreas (meanSubareas)
     - Basic     = promedio de las 37 preguntas (meanQuestions)
       (meanBlocks se descartó: daba hasta 4.13 pts de error)

   Diferencia máxima absoluta sobre las cocinas de prueba:
     - Sub-áreas : <= 0.5 pts (solo redondeo)
     - Bloques   : 0.5 pts  (fórmula meanSubareas)
     - Basic     : 0.04 pts (fórmula meanQuestions)

   Preguntas INVERTIDAS (donde "Sí" es malo): 1 (cables expuestos),
   7 (signos de plagas), 14 (focos fundidos / luminarias sin protección).
   No se encontraron otras preguntas invertidas.

   Asignación de sub-áreas a bloques (contigua, cuadra con conteos
   2,2,3,3,1,6,4,2,3,4,4,3):
     Bloque 1 "Seguridad y condiciones operativas": Seguridad eléctrica y de
       gas(1,2), Refrigeración constante(11,12), Iluminación y ventilación
       (13,14,15), Equipos críticos(16,17,18).
     Bloque 2 "Higiene personal y sanitaria": Estación de lavado de manos(3),
       Dotación/uniformes/servicios(32,33,34,35,36,37).
     Bloque 3 "Limpieza desinfección y control ambiental": Control de plagas
       (7,8,9,10), Programa de limpieza(19,20), Manejo de residuos(21,22,23).
     Bloque 4 "Infraestructura y mantenimiento": Pisos/paredes/techos/zoclos
       (24,25,26,27), Utensilios/lockers/áreas(28,29,30,31), Agua potable y
       drenajes(4,5,6).

   =========================================================================
   (2) NOMBRES DE COCINA EN col1 DE LA RAW (cocinas con respuesta = 23)
   -------------------------------------------------------------------------
   "01 DOCTORES", "02 SAN ANGEL", "03 POLANCO", "04 SANTA FE", "05 COAPA",
   "09 CHURUBUSCO", "11 AZCAPOTZALCO", "12 DEL VALLE", "15 LINDAVISTA",
   "16 PEDREGAL", "20 ESMERALDA", "21 SANTA TERESITA", "23 SANTA CATARINA",
   "24 METEPEC", "25 TABACHINES", "27 IZTAPALAPA", "34 TLAQUEPAQUE",
   "37 CANEK", "38 SALTILLO CENTRO", "41 VOLCANES", "51 SAMARA",
   "52 MANACAR", "54 CENTR INTERLOMAS".
   Nota: el export CSV crudo se truncó (~58KB); se leyeron y validaron
   directamente 16 de estas 23 respuestas. Las 7 restantes (03 POLANCO,
   21 SANTA TERESITA, 24 METEPEC, 25 TABACHINES, 34 TLAQUEPAQUE, 52 MANACAR,
   54 CENTR INTERLOMAS) tienen resultados Q3 calculados, por lo que también
   respondieron.

   =========================================================================
   (3) COCINAS PENDIENTES (sin ninguna respuesta en la RAW / sin datos Q3) = 14
   -------------------------------------------------------------------------
   "06 SATELITE", "10 SAN JERONIMO", "13 TEC", "14 JARDINES", "17 CUMBRES",
   "19 LA CALMA", "22 SAN NICOLAS", "26 CIUDAD JUDICIAL",
   "28 CARRETERA NACIONAL", "30 LINCOLN", "31 MONTEJO", "39 MONTERREY CENTRO",
   "40 JARDINES DEL VALLE", "45 ESTADIO".
   ========================================================================= */
