import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../tests/shared.js";

import { isHTML } from "./html.js";

describe(isHTML.name, () => {
	it("returns true for text node", ({ expect }) => {
		const code = "<div>text content</div>";
		const node = parse_and_extract<AST.Text>(code, "Text");
		expect(isHTML(node)).toBe(true);
	});

	it("returns true for comment node", ({ expect }) => {
		const code = "<!-- comment -->";
		const node = parse_and_extract<AST.Comment>(code, "Comment");
		expect(isHTML(node)).toBe(true);
	});

	it("returns false for non-HTML node", ({ expect }) => {
		const code = "<div></div>";
		const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
		expect(isHTML(node)).toBe(false);
	});
});
