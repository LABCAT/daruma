import "../../chunks/server.js";
import { t as PageShell } from "../../chunks/PageShell.js";
//#region src/routes/+page.svelte
function _page($$renderer) {
	PageShell($$renderer, {
		title: "Dashboard",
		children: ($$renderer) => {
			$$renderer.push(`<p>Welcome to the Daruma command center. <a href="/design">View Design System</a></p>`);
		},
		$$slots: { default: true }
	});
}
//#endregion
export { _page as default };
