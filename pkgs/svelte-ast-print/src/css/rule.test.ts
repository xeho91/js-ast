import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract } from "../../tests/shared.ts";

import { printCSSAtrule, printCSSBlock, printCSSDeclaration, printCSSRule } from "./mod.js";

describe(printCSSBlock.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
					background-color: black;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.Block>(code, "Block");
		expect(printCSSBlock(node).code).toMatchInlineSnapshot(`
			"{
				color: red;
				background-color: black;
			}"
		`);
	});
});

describe(printCSSDeclaration.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				div {
					background-color: orange;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.Declaration>(code, "Declaration");
		expect(printCSSDeclaration(node).code).toMatchInlineSnapshot(`"background-color: orange;"`);
	});
});

describe(printCSSAtrule.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				@media screen and (max-width: 1000px) {
					p {
						max-width: 60ch;
					}
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.Atrule>(code, "Atrule");
		expect(printCSSAtrule(node).code).toMatchInlineSnapshot(`
			"@media screen and (max-width: 1000px) {
				p {
					max-width: 60ch;
				}
			}"
		`);
	});
});

describe(printCSSRule.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.Rule>(code, "Rule");
		expect(printCSSRule(node).code).toMatchInlineSnapshot(`
			"p {
				color: red;
			}"
		`);
	});

	it("prints nested rules correctly", ({ expect }) => {
		const code = `
			<style>
				h1 {
					color: red;
					& + p {
						margin-bottom: 0.5em;
					}
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.Rule>(code, "Rule");
		expect(printCSSRule(node).code).toMatchInlineSnapshot(`
			"h1 {
				color: red;
				& + p {
					margin-bottom: 0.5em;
				}
			}"
		`);
	});
});
