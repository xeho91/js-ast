import { parse_and_extract } from "@internals/test/svelte";
import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { isAttributeLike } from "./attribute.ts";

describe(isAttributeLike.name, () => {
	it("returns true for standard attribute", ({ expect }) => {
		const code = '<div class="test"></div>';
		const node = parse_and_extract<AST.Attribute>(code, "Attribute");
		expect(isAttributeLike(node)).toBe(true);
	});

	it("returns true for spread attribute", ({ expect }) => {
		const code = "<div {...props}></div>";
		const node = parse_and_extract<AST.SpreadAttribute>(code, "SpreadAttribute");
		expect(isAttributeLike(node)).toBe(true);
	});

	it("returns true for directive", ({ expect }) => {
		const code = "<div bind:value={value}></div>";
		const node = parse_and_extract<AST.BindDirective>(code, "BindDirective");
		expect(isAttributeLike(node)).toBe(true);
	});

	it("returns false for non-attribute node", ({ expect }) => {
		const code = "<div>text</div>";
		const node = parse_and_extract<AST.Text>(code, "Text");
		expect(isAttributeLike(node)).toBe(false);
	});
});
