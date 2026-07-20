import "./index-server.js";
import { T as escape_html } from "./server.js";
//#region src/lib/components/theme-toggle/ThemeToggle.svelte
function ThemeToggle($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<button class="dm-theme-toggle" aria-label="Toggle theme">${escape_html("☾ Dark")}</button>`);
	});
}
//#endregion
//#region src/lib/components/page-shell/PageShell.svelte
function PageShell($$renderer, $$props) {
	let { title, children } = $$props;
	$$renderer.push(`<div class="dm-page-shell"><header class="dm-page-shell__header">`);
	if (title) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<h1 class="dm-page-shell__title">${escape_html(title)}</h1>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> <div style="margin-left: auto;">`);
	ThemeToggle($$renderer, {});
	$$renderer.push(`<!----></div></header> <main class="dm-page-shell__main">`);
	if (children) {
		$$renderer.push("<!--[0-->");
		children($$renderer);
		$$renderer.push(`<!---->`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></main></div>`);
}
//#endregion
export { PageShell as t };
