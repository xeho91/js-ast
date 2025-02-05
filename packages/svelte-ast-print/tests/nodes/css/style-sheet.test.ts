import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract } from "../../shared.ts";

import { print } from "svelte-ast-print";

describe("AST.CSS.StyleSheet", () => {
	it("it prints correctly attributes", ({ expect }) => {
		const code = `
				<style lang="sass">
					/* */
				</style>
			`;
		const node = parse_and_extract<AST.CSS.StyleSheet>(code, "StyleSheet");
		expect(print(node)).toMatchInlineSnapshot(`
				"<style lang="sass">

				</style>"
			`);
	});

	it("it prints correctly advanced styles", ({ expect }) => {
		const code = `
				<style>
					@layer base {
						:root {
							--transition-fn: ease-in-out;
							--transition-dur: 250ms;
						}
					}

					@layer component {
						@container toast (max-width: 426px) {
							.toast ~ [aria-live="polite"] {
								width: 100px;
							}
						}

						.toast {
							transition-duration: var(--transition-dur);
							transition-timing-function: var(--transition-fn);

							transition-property:
								var(--transition-props-color),
								var(--transition-props-shadow);
						}
					}
				</style>
			`;
		const node = parse_and_extract<AST.CSS.StyleSheet>(code, "StyleSheet");
		expect(print(node)).toMatchInlineSnapshot(`
			"<style>
				@layer base {
					:root {
						--transition-fn: ease-in-out;
						--transition-dur: 250ms;
					}
				}

				@layer component {
					@container toast (max-width: 426px) {
						.toast ~[aria-live="polite"] {
							width: 100px;
						}
					}
					.toast {
						transition-duration: var(--transition-dur);
						transition-timing-function: var(--transition-fn);
						transition-property: var(--transition-props-color), var(--transition-props-shadow);
					}
				}
			</style>"
		`);
	});
});
