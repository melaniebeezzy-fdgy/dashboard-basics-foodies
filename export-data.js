/**
 * INSTRUCCIONES:
 * 1. Abre el dashboard (local o Vercel)
 * 2. Espera a que termine el sync (el botón "Sincronizar Sheets" vuelva a su estado normal)
 * 3. Abre la consola del browser (F12 → Console)
 * 4. Pega TODO este script y presiona Enter
 * 5. Se descargarán automáticamente: fixes-data.js y sheet-detail-data.js
 */

(function exportDashboardData() {
  // ── Verificar que hay datos sincronizados ─────────────────────────────
  const fixes = window.FIXES_DATA;
  const sheet = window.SHEET_DETAIL_DATA;

  if (!fixes || !sheet) {
    alert("❌ No hay datos en memoria. Asegúrate de esperar a que termine el Sync antes de correr este script.");
    return;
  }

  const mxCount = (fixes.MX || []).length;
  const coCount = (fixes.CO || []).length;
  const peCount = (fixes.PE || []).length;
  const cpCount = (fixes.CP || []).length;
  const kitchenCount = (sheet.kitchens || []).length;

  console.log(`📦 Datos encontrados:`);
  console.log(`   Fixes: MX=${mxCount}, CO=${coCount}, PE=${peCount}, CP=${cpCount}`);
  console.log(`   Cocinas en sheet-detail: ${kitchenCount}`);
  console.log(`   Preguntas: ${(sheet.questions || []).length}`);

  if (mxCount + coCount + peCount + cpCount === 0) {
    alert("⚠️ Los fixes están vacíos. Haz sync primero y luego vuelve a correr el script.");
    return;
  }

  // ── Helper para descargar un archivo ─────────────────────────────────
  function download(filename, content) {
    const blob = new Blob([content], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  }

  // ── Generar fixes-data.js ─────────────────────────────────────────────
  // Limpiar campos internos que no deben persistir
  const cleanFix = (fix) => {
    const f = { ...fix };
    delete f._computed;
    delete f._matched;
    return f;
  };

  const fixesExport = {
    MX: (fixes.MX || []).map(cleanFix),
    CO: (fixes.CO || []).map(cleanFix),
    PE: (fixes.PE || []).map(cleanFix),
    CP: (fixes.CP || []).map(cleanFix),
  };

  const fixesContent = `window.FIXES_DATA = ${JSON.stringify(fixesExport, null, 0)};`;
  download("fixes-data.js", fixesContent);
  console.log("✅ fixes-data.js descargado");

  // ── Generar sheet-detail-data.js ──────────────────────────────────────
  // Usar los datos actuales de SHEET_DETAIL_DATA (actualizado por el sync)
  const sheetExport = {
    questions: sheet.questions || [],
    kitchens: sheet.kitchens || [],
  };

  const sheetContent = `window.SHEET_DETAIL_DATA = ${JSON.stringify(sheetExport, null, 0)};`;
  download("sheet-detail-data.js", sheetContent);
  console.log("✅ sheet-detail-data.js descargado");

  console.log("🎉 Listo. Mueve los archivos descargados a la carpeta del proyecto y haz git push.");
})();
