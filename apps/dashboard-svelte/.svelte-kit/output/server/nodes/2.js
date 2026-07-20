

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.BCKNMLHx.js","_app/immutable/chunks/C4Rcq62L.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/vs1qf66w.js"];
export const stylesheets = ["_app/immutable/assets/PageShell.D_oVxLBC.css"];
export const fonts = [];
