import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../../tests/shared.ts";

import { isTemplateNode } from "./mod.ts";

describe(isTemplateNode.name, () => {
	it("returns true for root node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.Root>(code, "Root");
		expect(isTemplateNode(node)).toBe(true);
	});

	it("returns true for element node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
		expect(isTemplateNode(node)).toBe(true);
	});

	it("returns true for text node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.Text>(code, "Text");
		expect(isTemplateNode(node)).toBe(true);
	});

	it("returns false for non-template node", ({ expect }) => {
		const code = "<script>const x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isTemplateNode(node)).toBe(false);
	});
});
