import { parse_and_extract } from "@internals/test/svelte";
import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { isHTMLNode } from "./mod.ts";

describe(isHTMLNode.name, () => {
	it("returns true for text node", ({ expect }) => {
		const code = "<div>text content</div>";
		const node = parse_and_extract<AST.Text>(code, "Text");
		expect(isHTMLNode(node)).toBe(true);
	});

	it("returns true for comment node", ({ expect }) => {
		const code = "<!-- comment -->";
		const node = parse_and_extract<AST.Comment>(code, "Comment");
		expect(isHTMLNode(node)).toBe(true);
	});

	it("returns false for non-HTML node", ({ expect }) => {
		const code = "<div></div>";
		const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
		expect(isHTMLNode(node)).toBe(false);
	});
});
