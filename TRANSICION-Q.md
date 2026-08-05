# Transición entre trimestres (Q anterior → Q actual)

Lógica que hace que cada cocina tenga un "punto de partida" del Q vigente:

- **Sin diagnóstico real del nuevo Q** → la cocina arranca en el **cierre proyectado del Q anterior** (el % después de aplicar los planes de acción ejecutados o en proceso). Se muestra como `PROYECTADO`.
- **Con diagnóstico real del nuevo Q** → se usa el **resultado real** y se deja de usar la proyección como valor principal. Se muestra como `REAL`.
- Prioridad: **real Q actual > cierre proyectado Q anterior**. Un valor real nunca se reemplaza por una proyección.
- Cuando una cocina ya tiene real, se conserva la proyección anterior sólo para **comparar** y mostrar la diferencia en **pp**.

La misma regla aplica por sección/bloques y por básico, no sólo al % global de la cocina.

Alcance actual: **MX**. El diseño es genérico y sirve para los trimestres siguientes (Q3→Q4, etc.) sin nombres ni fechas fijas.

## Piezas

- `prev-q-data.js` — cierre proyectado del Q anterior, **congelado**. Mientras esté vacío, el dashboard funciona igual que antes (sin transición).
- `export-prev-q.js` — exportador que genera `prev-q-data.js` a partir de los datos vigentes.
- `index.html` — resolutor de transición, badges `REAL`/`PROYECTADO`, diferencia en pp, barra de indicadores y filtro `Todas / Con dato real / Con dato proyectado`.

## Indicadores y filtro

En la barra superior aparecen (sólo cuando hay datos congelados): cocinas totales del Q actual, con diagnóstico real, proyectadas (cierre del Q anterior) y % de diagnósticos completados. El selector **Diagnóstico** filtra el listado por origen.

## Pasos por trimestre (una vez)

### 1. Congelar el cierre proyectado del Q que va a cerrar
1. Abre el dashboard y deja que sincronice los datos del Q vigente (pestaña `Preguntas` + fixes).
2. Consola del navegador (F12 → Console) y ejecuta:
   ```js
   exportPrevQData(["MX"])            // o exportPrevQData(["MX"], "Q2 2026") para forzar etiqueta
   ```
3. Se descarga `prev-q-data.js`. Reemplaza el del proyecto con ese archivo y commitéalo.

### 2. Cargar el diagnóstico del nuevo Q
- Crea una pestaña nueva en el Sheet con el nombre `Preguntas Q<n>` (ej. `Preguntas Q3` o `Preguntas Q3 2026`). **No sobrescribas** la pestaña `Preguntas` del Q anterior.
- El dashboard **autodetecta** la pestaña `Preguntas Q<n>` más reciente y la usa como diagnóstico del Q actual. Si aún no existe, sigue mostrando todo como `PROYECTADO`.
- A medida que cargas cocinas en esa pestaña, van pasando de `PROYECTADO` a `REAL` automáticamente, con su diferencia en pp.

## Notas

- El exportador sólo sobrescribe los países que le pases; los demás conservan lo que ya hubiera en `prev-q-data.js`.
- La proyección congelada usa la misma regla que la vista de impacto: los básicos cubiertos por planes **ejecutados o en proceso** suben a 100.
