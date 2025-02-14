import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../../tests/shared.ts";

import { isFragment } from "./fragment.ts";

describe(isFragment.name, () => {
	it("returns true for fragment node", ({ expect }) => {
		const code = `
<script>
	// Not a part of fragment
</script>

<h1>Fragment heading</h1>
<div>Fragment content</div>

<style>
	/* Not a part of fragment */
</style>
`;
		const node = parse_and_extract<AST.Fragment>(code, "Fragment");
		expect(isFragment(node)).toBe(true);
	});

	it("returns false for non-fragment node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
		expect(isFragment(node)).toBe(false);
	});
});
