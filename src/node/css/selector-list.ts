/**
 * Related to Svelte AST node {@link Css.SelectorList}.
 * @module
 */

import { print_css_complex_selector } from "#node/css/complex-selector";
import { define_printer } from "#printer";
import type { Css } from "#types";

/**
 * Print Svelte AST node {@link Css.SelectorList} as string.
 */
export const print_css_selector_list = define_printer((node: Css.SelectorList, options) => {
	const { children } = node;

	return children
		.map((complex_selector) => {
			return print_css_complex_selector(complex_selector, options);
		})
		.join("");
});

if (import.meta.vitest) {
	const { describe, it } = import.meta.vitest;
	const [{ parse_and_extract_svelte_node }, { DEFAULT_OPTIONS }] = await Promise.all([
		import("#test/mod"),
		import("#options"),
	]);

	describe("Css.SelectorList", () => {
		it("prints correctly", ({ expect }) => {
			const code = `
				<style>
					p {
						color: red;
					}
				</style>
			`;
			const node = parse_and_extract_svelte_node<Css.SelectorList>(code, "SelectorList");
			expect(print_css_selector_list(node, DEFAULT_OPTIONS)).toMatchInlineSnapshot(`"p"`);
		});
	});
}
