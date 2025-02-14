import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../../tests/shared.ts";

import { isCSSNode } from "./mod.ts";

describe(isCSSNode.name, () => {
	it("returns true for `<style>` tag AST node", ({ expect }) => {
		const code = `
			<style>
				div {
					background-color: orange;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.StyleSheet>(code, "StyleSheet");
		expect(isCSSNode(node)).toBe(true);
	});

	it("returns true for CSS selector AST node", ({ expect }) => {
		const code = `
			<style>
				button[disabled] {
					background-color: grey;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.AttributeSelector>(code, "AttributeSelector");
		expect(isCSSNode(node)).toBe(true);
	});

	it("returns false for non-CSS related AST node", ({ expect }) => {
		const code = `
			<script>
				console.log("This isn't a CSS AST node");
			</script>
		`;
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isCSSNode(node)).toBe(false);
	});
});
