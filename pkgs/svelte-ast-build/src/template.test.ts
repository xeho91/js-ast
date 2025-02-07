import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../tests/shared.js";

import { isTemplate } from "./template.js";

describe(isTemplate.name, () => {
	it("returns true for root node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.Root>(code, "Root");
		expect(isTemplate(node)).toBe(true);
	});

	it("returns true for element node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
		expect(isTemplate(node)).toBe(true);
	});

	it("returns true for text node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.Text>(code, "Text");
		expect(isTemplate(node)).toBe(true);
	});

	it("returns false for non-template node", ({ expect }) => {
		const code = "<script>const x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isTemplate(node)).toBe(false);
	});
});
