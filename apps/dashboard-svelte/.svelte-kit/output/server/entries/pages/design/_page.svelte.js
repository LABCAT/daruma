import "../../../chunks/index-server.js";
import { C as attr, T as escape_html, a as element, h as getContext, i as derived, l as spread_props, n as attr_style, o as ensure_array_like, r as attributes, t as attr_class, u as stringify, w as clsx } from "../../../chunks/server.js";
import { t as PageShell } from "../../../chunks/PageShell.js";
//#region src/lib/components/stack/Stack.svelte
function Stack($$renderer, $$props) {
	let { space = "3", children } = $$props;
	$$renderer.push(`<div${attr_class(`dm-stack dm-stack--space-${space}`)}>`);
	if (children) {
		$$renderer.push("<!--[0-->");
		children($$renderer);
		$$renderer.push(`<!---->`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
//#region src/lib/components/button/Button.svelte
function Button($$renderer, $$props) {
	let { variant = "primary", size = "md", children, class: className = "", $$slots, $$events, ...rest } = $$props;
	$$renderer.push(`<button${attributes({
		class: `dm-button dm-button--${variant} dm-button--${size} ${className}`,
		...rest
	})}>`);
	if (children) {
		$$renderer.push("<!--[0-->");
		children($$renderer);
		$$renderer.push(`<!---->`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></button>`);
}
//#endregion
//#region src/lib/components/text-input/TextInput.svelte
function TextInput($$renderer, $$props) {
	let { label, error, helperText, icon, class: className = "", id, $$slots, $$events, ...rest } = $$props;
	$$renderer.push(`<div class="dm-text-input">`);
	if (label) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<label class="dm-text-input__label"${attr("for", id)}>${escape_html(label)}</label>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> <div class="dm-text-input__wrapper">`);
	if (icon) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="dm-text-input__icon">`);
		icon($$renderer);
		$$renderer.push(`<!----></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> <input${attributes({
		id,
		class: `dm-text-input__field ${icon ? "dm-text-input__field--with-icon" : ""} ${error ? "dm-text-input__field--error" : ""} ${className}`,
		...rest
	}, void 0, void 0, void 0, 4)}/></div> `);
	if (error || helperText) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<span${attr_class(`dm-text-input__helper ${error ? "dm-text-input__helper--error" : ""}`)}>${escape_html(error || helperText)}</span>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
//#region src/lib/components/table-row/TableRow.svelte
function TableRow($$renderer, $$props) {
	let { isHeader = false, children } = $$props;
	$$renderer.push(`<div${attr_class(`dm-table-row ${isHeader ? "dm-table-row--header" : "dm-table-row--data"}`)}>`);
	if (children) {
		$$renderer.push("<!--[0-->");
		children($$renderer);
		$$renderer.push(`<!---->`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
//#region src/lib/components/badge/Badge.svelte
function Badge($$renderer, $$props) {
	let { variant = "default", children, class: className = "", $$slots, $$events, ...rest } = $$props;
	$$renderer.push(`<div${attributes({
		class: `dm-badge dm-badge--${variant} ${className}`,
		...rest
	})}>`);
	if (children) {
		$$renderer.push("<!--[0-->");
		children($$renderer);
		$$renderer.push(`<!---->`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div>`);
}
//#endregion
//#region src/lib/components/alert/Alert.svelte
function Alert($$renderer, $$props) {
	let { variant = "default", title, icon, children, class: className = "", $$slots, $$events, ...rest } = $$props;
	$$renderer.push(`<div${attributes({
		class: `dm-alert dm-alert--${variant} ${className}`,
		role: "alert",
		...rest
	})}>`);
	if (icon) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="dm-alert__icon">`);
		icon($$renderer);
		$$renderer.push(`<!----></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> <div class="dm-alert__content">`);
	if (title) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<h5 class="dm-alert__title">${escape_html(title)}</h5>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--> <div class="dm-alert__description">`);
	if (children) {
		$$renderer.push("<!--[0-->");
		children($$renderer);
		$$renderer.push(`<!---->`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></div></div></div>`);
}
//#endregion
//#region src/lib/components/switch/Switch.svelte
function Switch($$renderer, $$props) {
	let { label, class: className = "", $$slots, $$events, ...rest } = $$props;
	$$renderer.push(`<label${attr_class(`dm-switch-wrapper ${className}`)}><div class="dm-switch"><input${attributes({
		type: "checkbox",
		class: "dm-switch__input",
		...rest
	}, void 0, void 0, void 0, 4)}/> <span class="dm-switch__slider"></span></div> `);
	if (label) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<span class="dm-switch__label">${escape_html(label)}</span>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></label>`);
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@1.25.0_svelte@5.56.6_@typescript-eslint+types@8.64.0_/node_modules/@lucide/svelte/dist/defaultAttributes.js
/**
* @file
* @license @lucide/svelte v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
};
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@1.25.0_svelte@5.56.6_@typescript-eslint+types@8.64.0_/node_modules/@lucide/svelte/dist/utils/hasA11yProp.js
/**
* @file
* @license @lucide/svelte v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
/**
* Check if a component has an accessibility prop
*
* @param {object} props
* @returns {boolean} Whether the component has an accessibility prop
*/
var hasA11yProp = (props) => {
	for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
	return false;
};
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@1.25.0_svelte@5.56.6_@typescript-eslint+types@8.64.0_/node_modules/@lucide/svelte/dist/context.js
/**
* @file
* @license @lucide/svelte v1.25.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var LucideContext = Symbol("lucide-context");
var getLucideContext = () => getContext(LucideContext);
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@1.25.0_svelte@5.56.6_@typescript-eslint+types@8.64.0_/node_modules/@lucide/svelte/dist/Icon.svelte
function Icon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const globalProps = getLucideContext() ?? {};
		const { name, color = globalProps.color ?? "currentColor", size = globalProps.size ?? 24, strokeWidth = globalProps.strokeWidth ?? 2, absoluteStrokeWidth = globalProps.absoluteStrokeWidth ?? false, iconNode = [], children, $$slots, $$events, ...props } = $$props;
		const calculatedStrokeWidth = derived(() => absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth);
		$$renderer.push(`<svg${attributes({
			...defaultAttributes,
			...!children && !hasA11yProp(props) && { "aria-hidden": "true" },
			...props,
			width: size,
			height: size,
			stroke: color,
			"stroke-width": calculatedStrokeWidth(),
			class: clsx([
				"lucide-icon lucide",
				globalProps.class,
				name && `lucide-${name}`,
				props.class
			])
		}, void 0, void 0, void 0, 3)}><!--[-->`);
		const each_array = ensure_array_like(iconNode);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let [tag, attrs] = each_array[$$index];
			element($$renderer, tag, () => {
				$$renderer.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
			});
		}
		$$renderer.push(`<!--]-->`);
		children?.($$renderer);
		$$renderer.push(`<!----></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@1.25.0_svelte@5.56.6_@typescript-eslint+types@8.64.0_/node_modules/@lucide/svelte/dist/icons/check.svelte
function Check($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "check" },
		props,
		{ iconNode: [["path", { "d": "M20 6 9 17l-5-5" }]] }
	]));
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@1.25.0_svelte@5.56.6_@typescript-eslint+types@8.64.0_/node_modules/@lucide/svelte/dist/icons/circle-alert.svelte
function Circle_alert($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "circle-alert" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "10"
			}],
			["line", {
				"x1": "12",
				"x2": "12",
				"y1": "8",
				"y2": "12"
			}],
			["line", {
				"x1": "12",
				"x2": "12.01",
				"y1": "16",
				"y2": "16"
			}]
		] }
	]));
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@1.25.0_svelte@5.56.6_@typescript-eslint+types@8.64.0_/node_modules/@lucide/svelte/dist/icons/info.svelte
function Info($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "info" },
		props,
		{ iconNode: [
			["circle", {
				"cx": "12",
				"cy": "12",
				"r": "10"
			}],
			["path", { "d": "M12 16v-4" }],
			["path", { "d": "M12 8h.01" }]
		] }
	]));
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@1.25.0_svelte@5.56.6_@typescript-eslint+types@8.64.0_/node_modules/@lucide/svelte/dist/icons/search.svelte
function Search($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "search" },
		props,
		{ iconNode: [["path", { "d": "m21 21-4.34-4.34" }], ["circle", {
			"cx": "11",
			"cy": "11",
			"r": "8"
		}]] }
	]));
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@1.25.0_svelte@5.56.6_@typescript-eslint+types@8.64.0_/node_modules/@lucide/svelte/dist/icons/settings.svelte
function Settings($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "settings" },
		props,
		{ iconNode: [["path", { "d": "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" }], ["circle", {
			"cx": "12",
			"cy": "12",
			"r": "3"
		}]] }
	]));
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@1.25.0_svelte@5.56.6_@typescript-eslint+types@8.64.0_/node_modules/@lucide/svelte/dist/icons/trash-2.svelte
function Trash_2($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "trash-2" },
		props,
		{ iconNode: [
			["path", { "d": "M10 11v6" }],
			["path", { "d": "M14 11v6" }],
			["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
			["path", { "d": "M3 6h18" }],
			["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
		] }
	]));
}
//#endregion
//#region ../../node_modules/.pnpm/@lucide+svelte@1.25.0_svelte@5.56.6_@typescript-eslint+types@8.64.0_/node_modules/@lucide/svelte/dist/icons/triangle-alert.svelte
function Triangle_alert($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "triangle-alert" },
		props,
		{ iconNode: [
			["path", { "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }],
			["path", { "d": "M12 9v4" }],
			["path", { "d": "M12 17h.01" }]
		] }
	]));
}
//#endregion
//#region src/lib/components/checkbox/Checkbox.svelte
function Checkbox($$renderer, $$props) {
	let { label, description, class: className = "", $$slots, $$events, ...rest } = $$props;
	$$renderer.push(`<label${attr_class(`dm-checkbox-wrapper ${className}`)}><div class="dm-checkbox"><input${attributes({
		type: "checkbox",
		class: "dm-checkbox__input",
		...rest
	}, void 0, void 0, void 0, 4)}/> <div class="dm-checkbox__box">`);
	Check($$renderer, { class: "dm-checkbox__icon" });
	$$renderer.push(`<!----></div></div> `);
	if (label || description) {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="dm-checkbox__text">`);
		if (label) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<span class="dm-checkbox__label">${escape_html(label)}</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (description) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="dm-checkbox__description">${escape_html(description)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	} else $$renderer.push("<!--[-1-->");
	$$renderer.push(`<!--]--></label>`);
}
//#endregion
//#region src/routes/design/+page.svelte
function _page($$renderer) {
	const spaces = [
		{
			token: "1",
			px: "4px"
		},
		{
			token: "2",
			px: "8px"
		},
		{
			token: "3",
			px: "12px"
		},
		{
			token: "4",
			px: "16px"
		},
		{
			token: "5",
			px: "24px"
		},
		{
			token: "6",
			px: "32px"
		},
		{
			token: "8",
			px: "48px"
		},
		{
			token: "10",
			px: "64px"
		}
	];
	const radii = [
		{
			name: "sm",
			px: "4px"
		},
		{
			name: "md",
			px: "8px"
		},
		{
			name: "lg",
			px: "12px"
		},
		{
			name: "pill",
			px: "9999px"
		}
	];
	const elevations = [
		{
			name: "sm",
			desc: "Buttons, inputs, toggles"
		},
		{
			name: "base",
			desc: "Cards, list items"
		},
		{
			name: "md",
			desc: "Dropdowns, popovers"
		},
		{
			name: "lg",
			desc: "Modals, dialogs"
		}
	];
	PageShell($$renderer, {
		title: "Design System Preview",
		children: ($$renderer) => {
			Stack($$renderer, {
				space: "8",
				children: ($$renderer) => {
					$$renderer.push(`<section><h2 style="margin-bottom: var(--dm-space-4); font-size: var(--dm-font-size-lg)">Typography</h2> `);
					Stack($$renderer, {
						space: "2",
						children: ($$renderer) => {
							$$renderer.push(`<h1>Heading 1 - Inter Bold</h1> <h2>Heading 2 - Inter Bold</h2> <h3>Heading 3 - Inter Bold</h3> <h4>Heading 4 - Inter Bold</h4> <p>Body - Inter Regular. This dashboard is intended to be a sleek, futuristic, and magical command center. It leverages generous whitespace, rounded corners, and subtle shadows. The design relies heavily on precise contrasts and perfect spacing.</p>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></section> <section><h2 style="margin-bottom: var(--dm-space-6); font-size: var(--dm-font-size-xl)">Design Tokens</h2> `);
					Stack($$renderer, {
						space: "8",
						children: ($$renderer) => {
							$$renderer.push(`<div><h3 style="margin-bottom: var(--dm-space-3); font-size: var(--dm-font-size-lg)">Spacing</h3> <p style="margin-bottom: var(--dm-space-4); color: var(--dm-color-muted-foreground)">A strict 4px grid system for consistent rhythm and layout.</p> <div style="border: var(--dm-border-width-base) solid var(--dm-color-border); border-radius: var(--dm-radius-md); overflow: hidden">`);
							TableRow($$renderer, {
								isHeader: true,
								children: ($$renderer) => {
									$$renderer.push(`<div style="width: 150px">Token</div> <div style="width: 100px">Pixels</div> <div style="flex: 1">Preview</div>`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> <!--[-->`);
							const each_array = ensure_array_like(spaces);
							for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
								let space = each_array[$$index];
								TableRow($$renderer, {
									children: ($$renderer) => {
										$$renderer.push(`<div style="width: 150px; font-family: monospace; font-size: var(--dm-font-size-sm); color: var(--dm-color-primary)">--dm-space-${escape_html(space.token)}</div> <div style="width: 100px; color: var(--dm-color-muted-foreground); font-size: var(--dm-font-size-sm)">${escape_html(space.px)}</div> <div style="flex: 1; display: flex; align-items: center"><div${attr_style(`width: var(--dm-space-${stringify(space.token)}); height: 16px; background-color: hsl(var(--dm-primary-hsl) / 0.5); border-radius: 2px`)}></div></div>`);
									},
									$$slots: { default: true }
								});
							}
							$$renderer.push(`<!--]--></div></div> <div><h3 style="margin-bottom: var(--dm-space-3); font-size: var(--dm-font-size-lg)">Border Radius</h3> <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--dm-space-4)"><!--[-->`);
							const each_array_1 = ensure_array_like(radii);
							for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
								let radius = each_array_1[$$index_1];
								$$renderer.push(`<div${attr_style(`border-radius: var(--dm-radius-${stringify(radius.name)}); border: var(--dm-border-width-base) solid var(--dm-color-border); padding: var(--dm-space-4); text-align: center; background-color: var(--dm-color-surface); box-shadow: var(--dm-shadow-sm)`)}><div style="margin-bottom: var(--dm-space-1); font-family: monospace; font-size: var(--dm-font-size-sm); font-weight: var(--dm-font-weight-bold)">${escape_html(radius.name)}</div> <div style="color: var(--dm-color-muted-foreground); font-size: var(--dm-font-size-xs)">${escape_html(radius.px)}</div></div>`);
							}
							$$renderer.push(`<!--]--></div></div> <div><h3 style="margin-bottom: var(--dm-space-3); font-size: var(--dm-font-size-lg)">Elevation</h3> <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--dm-space-6); padding: var(--dm-space-8); background-color: var(--dm-color-surface); border-radius: var(--dm-radius-lg); border: var(--dm-border-width-base) solid var(--dm-color-border)"><!--[-->`);
							const each_array_2 = ensure_array_like(elevations);
							for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
								let shadow = each_array_2[$$index_2];
								$$renderer.push(`<div${attr_style(`box-shadow: var(--dm-shadow-${stringify(shadow.name)}); background-color: var(--dm-color-bg); padding: var(--dm-space-5); border-radius: var(--dm-radius-md); border: var(--dm-border-width-base) solid var(--dm-color-border); display: flex; flex-direction: column; gap: var(--dm-space-1)`)}><span style="font-family: monospace; font-size: var(--dm-font-size-sm); font-weight: var(--dm-font-weight-bold)">shadow-${escape_html(shadow.name)}</span> <span style="font-size: var(--dm-font-size-xs); color: var(--dm-color-muted-foreground)">${escape_html(shadow.desc)}</span></div>`);
							}
							$$renderer.push(`<!--]--></div></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></section> <section><h2 style="margin-bottom: var(--dm-space-4); font-size: var(--dm-font-size-lg)">Buttons</h2> `);
					Stack($$renderer, {
						space: "4",
						children: ($$renderer) => {
							$$renderer.push(`<div><p style="margin-bottom: var(--dm-space-2); color: var(--dm-color-muted-foreground); font-size: var(--dm-font-size-sm)">Variants</p> <div style="display: flex; gap: 16px; flex-wrap: wrap">`);
							Button($$renderer, {
								variant: "primary",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Primary`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "secondary",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Secondary`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "tertiary",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Tertiary`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "outline",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Outline`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "ghost",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Ghost`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "danger",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Danger Outline`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div></div> <div><p style="margin-bottom: var(--dm-space-2); color: var(--dm-color-muted-foreground); font-size: var(--dm-font-size-sm)">Sizes &amp; Icons</p> <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center">`);
							Button($$renderer, {
								size: "sm",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Small`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								size: "md",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Medium`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								size: "lg",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Large`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "primary",
								children: ($$renderer) => {
									Settings($$renderer, { size: 18 });
									$$renderer.push(`<!----> With Icon`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								variant: "outline",
								size: "icon",
								children: ($$renderer) => {
									Trash_2($$renderer, { size: 18 });
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div></div>`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></section> <section><h2 style="margin-bottom: var(--dm-space-4); font-size: var(--dm-font-size-lg)">BADGES</h2> <div style="display: flex; gap: 16px; flex-wrap: wrap">`);
					Badge($$renderer, {
						variant: "default",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Neutral`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Badge($$renderer, {
						variant: "primary",
						children: ($$renderer) => {
							$$renderer.push(`<!---->Primary`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Badge($$renderer, {
						variant: "success",
						children: ($$renderer) => {
							Check($$renderer, { size: 14 });
							$$renderer.push(`<!----> Success`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Badge($$renderer, {
						variant: "warning",
						children: ($$renderer) => {
							Triangle_alert($$renderer, { size: 14 });
							$$renderer.push(`<!----> Warning`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Badge($$renderer, {
						variant: "danger",
						children: ($$renderer) => {
							Circle_alert($$renderer, { size: 14 });
							$$renderer.push(`<!----> Danger`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Badge($$renderer, {
						variant: "primary",
						children: ($$renderer) => {
							Info($$renderer, { size: 14 });
							$$renderer.push(`<!----> Info`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div></section> <section><h2 style="margin-bottom: var(--dm-space-4); font-size: var(--dm-font-size-lg)">ALERTS</h2> `);
					Stack($$renderer, {
						space: "3",
						children: ($$renderer) => {
							{
								function icon($$renderer) {
									Check($$renderer, {});
								}
								Alert($$renderer, {
									variant: "success",
									title: "Saved",
									icon,
									children: ($$renderer) => {
										$$renderer.push(`<!---->Your changes have been synced.`);
									},
									$$slots: {
										icon: true,
										default: true
									}
								});
							}
							$$renderer.push(`<!----> `);
							{
								function icon($$renderer) {
									Triangle_alert($$renderer, {});
								}
								Alert($$renderer, {
									variant: "warning",
									title: "Storage almost full",
									icon,
									children: ($$renderer) => {
										$$renderer.push(`<!---->You've used 92% of your quota.`);
									},
									$$slots: {
										icon: true,
										default: true
									}
								});
							}
							$$renderer.push(`<!----> `);
							{
								function icon($$renderer) {
									Circle_alert($$renderer, {});
								}
								Alert($$renderer, {
									variant: "danger",
									title: "Payment failed",
									icon,
									children: ($$renderer) => {
										$$renderer.push(`<!---->We couldn't process your card.`);
									},
									$$slots: {
										icon: true,
										default: true
									}
								});
							}
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></section> <section><h2 style="margin-bottom: var(--dm-space-4); font-size: var(--dm-font-size-lg)">Forms &amp; Controls</h2> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px">`);
					Stack($$renderer, {
						space: "4",
						children: ($$renderer) => {
							TextInput($$renderer, {
								label: "Email Address",
								type: "email",
								placeholder: "agent@daruma.nz"
							});
							$$renderer.push(`<!----> `);
							{
								function icon($$renderer) {
									Search($$renderer, {});
								}
								TextInput($$renderer, {
									label: "Search",
									placeholder: "Search projects...",
									icon,
									$$slots: { icon: true }
								});
							}
							$$renderer.push(`<!----> `);
							TextInput($$renderer, {
								label: "API Key",
								type: "password",
								placeholder: "••••••••",
								error: "API Key is invalid"
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Stack($$renderer, {
						space: "4",
						children: ($$renderer) => {
							Switch($$renderer, { label: "Enable Notifications" });
							$$renderer.push(`<!----> `);
							Switch($$renderer, {
								label: "Dark Mode",
								checked: true
							});
							$$renderer.push(`<!----> `);
							Checkbox($$renderer, {
								label: "Accept Terms",
								description: "You agree to our Terms of Service and Privacy Policy."
							});
							$$renderer.push(`<!----> `);
							Checkbox($$renderer, { label: "Subscribe to Newsletter" });
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----></div></section>`);
				},
				$$slots: { default: true }
			});
		},
		$$slots: { default: true }
	});
}
//#endregion
export { _page as default };
