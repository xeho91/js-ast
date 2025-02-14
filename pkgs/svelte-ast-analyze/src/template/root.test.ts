import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../../tests/shared.ts";

import { isRoot } from "./root.ts";

describe(isRoot.name, () => {
	it("returns true for root node", ({ expect }) => {
		const code = `
<script>
	// A a part of root too
</script>

<h1>Fragment heading</h1>
<div>Fragment content</div>

<style>
	/* A part of root too */
</style>
`;
		const node = parse_and_extract<AST.Root>(code, "Root");
		expect(isRoot(node)).toBe(true);
	});

	it("returns false for non-root node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
		expect(isRoot(node)).toBe(false);
	});
});
