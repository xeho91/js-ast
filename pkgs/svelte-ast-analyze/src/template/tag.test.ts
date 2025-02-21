import { parse_and_extract } from "@internals/test/svelte";
import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { isTag } from "./tag.ts";

describe(isTag.name, () => {
	it("returns true for expression tag", ({ expect }) => {
		const code = "{value}";
		const node = parse_and_extract<AST.ExpressionTag>(code, "ExpressionTag");
		expect(isTag(node)).toBe(true);
	});

	it("returns true for html tag", ({ expect }) => {
		const code = "{@html htmlContent}";
		const node = parse_and_extract<AST.HtmlTag>(code, "HtmlTag");
		expect(isTag(node)).toBe(true);
	});

	it("returns true for debug tag", ({ expect }) => {
		const code = "{@debug value}";
		const node = parse_and_extract<AST.DebugTag>(code, "DebugTag");
		expect(isTag(node)).toBe(true);
	});

	it("returns false for non-tag node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
		expect(isTag(node)).toBe(false);
	});
});
