import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../../tests/shared.js";

import { hasStyleSheetLang, isStyleSheet } from "./style-sheet.js";

describe(isStyleSheet.name, () => {
	it("returns true for `<style>` tag AST node", ({ expect }) => {
		const code = `
			<style>
				div {
					background-color: orange;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.StyleSheet>(code, "StyleSheet");
		expect(isStyleSheet(node)).toBe(true);
	});

	it("returns false for other AST node", ({ expect }) => {
		const code = `
			<script>
				console.log("This isn't a style tag");
			</script>
		`;
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isStyleSheet(node)).toBe(false);
	});
});

describe(hasStyleSheetLang.name, () => {
	it('returns true for testing `lang="scss" attribute`', ({ expect }) => {
		const code = `
			<style lang="scss">
				div {
					font-family: monospacce;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.StyleSheet>(code, "StyleSheet");
		expect(isStyleSheet(node)).toBe(true);
		if (isStyleSheet(node)) {
			expect(hasStyleSheetLang(node, "scss")).toBe(true);
		}
	});

	it("returns false for standard `<style>` tag", ({ expect }) => {
		const code = `
			<style>
				div {
					whitespace: nowrap;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.StyleSheet>(code, "StyleSheet");
		expect(isStyleSheet(node)).toBe(true);
		if (isStyleSheet(node)) {
			expect(hasStyleSheetLang(node, "stylus")).toBe(false);
		}
	});
});
