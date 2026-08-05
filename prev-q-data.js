/**
 * Cierre proyectado del Q ANTERIOR (congelado).
 *
 * Sirve de "punto de partida" del Q actual para cada cocina mientras NO exista
 * su diagnóstico real del nuevo Q. En cuanto una cocina tiene diagnóstico real
 * del Q actual, el dashboard usa el real y este valor solo se conserva para
 * comparar (diferencia en pp).
 *
 * Se genera UNA vez por trimestre corriendo `export-prev-q.js` en el dashboard
 * (con los datos del Q que está por cerrar), y se commitea el archivo resultante.
 *
 * Estructura:
 *   window.PREV_Q_DATA = {
 *     MX: { quarterLabel: "Q2 2026",
 *           byKitchen: { "<norm cocina>": { score: 86.3, byQuestion: { "1":100, "2":50, ... } } } },
 *     CO: {...}, PE: {...}
 *   }
 *
 * Mientras esté vacío, el dashboard se comporta igual que antes (sin transición).
 */
window.PREV_Q_DATA = window.PREV_Q_DATA || { MX: null, CO: null, PE: null };
