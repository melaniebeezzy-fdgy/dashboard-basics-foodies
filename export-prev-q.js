/**
 * EXPORTADOR (uso manual, una vez por trimestre).
 *
 * Congela el "cierre proyectado" del Q que está por cerrar y lo descarga como
 * prev-q-data.js. Ese archivo pasa a ser el punto de partida del Q siguiente:
 * cada cocina arranca en su cierre proyectado hasta que exista su diagnóstico
 * real del nuevo Q (ver la lógica de transición en index.html).
 *
 * CÓMO USARLO
 *   1. Abre el dashboard en el navegador y espera a que sincronice los datos
 *      del Q que vas a cerrar (la pestaña "Preguntas" del Q vigente y sus fixes).
 *   2. Abre la consola del navegador (F12 → Console).
 *   3. Ejecuta:  exportPrevQData(["MX"])
 *      - Puedes pasar varios países: exportPrevQData(["MX","CO","PE"])
 *      - Puedes forzar la etiqueta del Q: exportPrevQData(["MX"], "Q2 2026")
 *   4. Se descargará prev-q-data.js. Reemplaza el archivo del proyecto con ese
 *      y commitéalo. A partir de ahí el dashboard usará esos valores como
 *      proyección de arranque del nuevo Q.
 *
 * Nota: sólo sobrescribe los países que exportes; los demás conservan lo que ya
 * hubiera en prev-q-data.js.
 */
(function () {
  function serialize(data) {
    const body = JSON.stringify(data, null, 2);
    return (
      "/**\n" +
      " * Cierre proyectado del Q ANTERIOR (congelado).\n" +
      " * Generado por export-prev-q.js — no editar a mano.\n" +
      " * Fecha de generación: " + new Date().toISOString() + "\n" +
      " */\n" +
      "window.PREV_Q_DATA = " + body + ";\n"
    );
  }

  window.exportPrevQData = function (countries, quarterLabel) {
    countries = countries && countries.length ? countries : ["MX"];
    if (typeof window.buildPrevQSnapshot !== "function") {
      console.error("[export-prev-q] buildPrevQSnapshot no está disponible. ¿Cargó index.html completo?");
      return;
    }
    const snap = window.buildPrevQSnapshot({ countries: countries, quarterLabel: quarterLabel || null });
    // Merge: conserva países no exportados que ya existieran.
    const merged = Object.assign({ MX: null, CO: null, PE: null }, window.PREV_Q_DATA || {}, snap);
    const text = serialize(merged);

    countries.forEach(function (ck) {
      const n = snap[ck] ? Object.keys(snap[ck].byKitchen).length : 0;
      console.log("[export-prev-q] " + ck + ": " + n + " cocinas congeladas (" + (snap[ck] && snap[ck].quarterLabel) + ")");
    });

    const blob = new Blob([text], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prev-q-data.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    console.log("[export-prev-q] Descarga iniciada: prev-q-data.js");
    return merged;
  };
})();
