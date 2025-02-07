import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract } from "../tests/shared.js";

import { isSvelte, isSvelteOnly } from "./svelte.js";

describe(isSvelte.name, () => {
	it("returns true for Svelte node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
		expect(isSvelte(node)).toBe(true);
	});

	it("returns true for style node", ({ expect }) => {
		const code = "<style>div { color: red; }</style>";
		const node = parse_and_extract<AST.CSS.StyleSheet>(code, "StyleSheet");
		expect(isSvelte(node)).toBe(true);
	});
});

describe(isSvelteOnly.name, () => {
	it("returns true for Svelte-specific node", ({ expect }) => {
		const code = "{#if condition}content{/if}";
		const node = parse_and_extract<AST.IfBlock>(code, "IfBlock");
		expect(isSvelteOnly(node)).toBe(true);
	});

	it("returns false for non-Svelte-specific node", ({ expect }) => {
		const code = "<script>const x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		const program = node.content;
		expect(isSvelteOnly(program)).toBe(false);
	});
});
