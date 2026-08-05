# Comparativo Q3 (vista nueva en el dashboard)

Pestaña **"Comparativo Q"** (solo México por ahora). Recalcula todo **desde las respuestas crudas** del diagnóstico Q3 (Sí / No / Parcialmente) y lo compara contra el Q2 2026.

## Qué muestra

- **Tabla** de cocinas (ordenadas de menor a mayor Basic): % por cada uno de los 4 bloques del Q3, Basic Q3, y variación vs Q2 (Δ en pp con flecha ▲ mejora / ▼ desmejora / ▬ igual).
- **Clic en una cocina** → desglose por **sub-área** consolidado dentro de cada bloque (con nº de preguntas y su % Q3 + Δ vs Q2).
- **Clic en una sub-área** → cada **pregunta** con su respuesta Q3 (color según cumplimiento) y la observación escrita, más la referencia de cómo estaba esa sub-área en Q2.
- **Pendientes de diagnóstico Q3** listadas aparte.

## Fuentes de datos

- `q3-data.js` — respuestas crudas del Q3 congeladas del Google Form (fuente: sheet `186o3...`). 20 cocinas respondieron, 17 pendientes.
- `q3-mapping.js` — mapeo validado de las 37 preguntas → 12 sub-áreas → 4 bloques, con las preguntas invertidas marcadas (1 cables, 7 plagas, 14 focos fundidos). Los % recalculados coinciden con la pestaña "Resultados Q3 2026" (diferencia ≤ 0.5 pp).
- **Q2 (anterior)**: se toma de los datos que el dashboard ya sincroniza (FORM_SCORES). Si aún no sincronizaste en este navegador, la columna de comparación aparece como "—"; basta darle a **Actualizar**.

Reglas de cálculo (validadas contra el sheet): sub-área = promedio de sus preguntas; bloque = promedio de sus sub-áreas; Basic = promedio de las 37 preguntas. Conversión Sí=100 / Parcialmente=50 / No=0 (invertida al revés en las 3 preguntas negativas).

## Sincronización del Q3 (en vivo, todas las cocinas)

El botón **Actualizar** ahora trae el diagnóstico Q3 de MX **en vivo** desde la pestaña **"Resultados Q3 2026"** (`gid=285527799`), que el motor de Google sí lee completa. De ahí salen **todas** las cocinas con dato (Basic + 4 bloques + 12 sub-áreas). Las cocinas en blanco en esa pestaña se marcan como pendientes. Se guarda en el navegador, así que sobrevive recargas sin re-sincronizar.

La pestaña de **respuestas crudas** del formulario no se puede leer en vivo (el motor de Google se engancha a otra mini-tabla), así que el **detalle por pregunta** (respuesta Sí/No/Parcial + observación) sigue viniendo del archivo congelado `q3-data.js` para las cocinas que ya tenían respuesta cruda. Los % de bloque/sub-área/Basic de todas las cocinas sí son en vivo. Para refrescar también el detalle por pregunta de las nuevas cocinas, pídeme que regenere `q3-data.js`.

## México migrado al Q3 (todo el dashboard)

Todo el dashboard de MX (Dashboard, Por cocina, Por básico, Detalle por cocina, Detalle por básico, Impacto Fix, Gantt) ahora opera sobre el **diagnóstico del Q3**: preguntas nuevas, sub-áreas, bloques y % recalculados desde las respuestas crudas (`q3-data.js` + `q3-mapping.js`), igual que Colombia trabaja su Q vigente. El título muestra "Q3 2026".

- Las cocinas sin diagnóstico Q3 cargado aparecen como **pendientes** (sin dato), no con el valor viejo.
- El Q2 previo de MX se preserva (`window.Q2_FORM_MX`) para que el Comparativo siga comparando Q3 vs Q2.
- CO y PE no se tocan (PE sigue en Q2).
- Construcción: `q3-mx.js` arma `FORM_SCORES.MX` y la lista de preguntas Q3 al cargar y después de cada sincronización. Se validó que las 9 vistas renderizan sin errores y que MX muestra la estructura del Q3 (p. ej. 10 básicos en "Seguridad y condiciones operativas").

## Planes de acción de México (Fix)

Los planes de acción de MX ahora se leen del **nuevo archivo** (pestaña de planes `gid=1260122100` del sheet `186o3...`), igual que Colombia usa su propia hoja. Se reflejan en las vistas **Fix / Impacto Fix / Gantt** tras darle **Actualizar**. El mapeo de columnas es automático por encabezado (Subcategoría, Área, Ciudad, Cocina, Basic, Iniciativa / Plan de Acción, Fecha de compromiso/cierre, Total, Responsable, Status, Prioridad). Estados soportados: Pendiente / En proceso / Ejecutado / Despriorizado.

## Varianza en puntos porcentuales

En el Comparativo Q3, la variación Q3 vs Q2 se muestra en **pp** (con signo y flecha ▲/▼) por **cocina**, por **bloque** y por **sub-área**, además del Δ del Basic.

## Pendiente por revisar

Tres cocinas (24 METEPEC, 34 TLAQUEPAQUE, 54 CENTR INTERLOMAS) aparecen con resultados en tu pestaña "Resultados Q3 2026" pero **no tienen fila en la pestaña de respuestas crudas** del formulario, por lo que salen como pendientes en esta vista. Habría que revisar dónde quedaron sus respuestas para incluirlas.
