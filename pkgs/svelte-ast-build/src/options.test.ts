import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../tests/shared.js";

import { isSvelteOptions } from "./options.js";

describe(isSvelteOptions.name, () => {
	// FIXME: Need research to figure out why the AST node of `<svelte:options>` differ from others
	it.fails("returns true for svelte:options node", ({ expect }) => {
		const code = "<svelte:options immutable={true} />";
		const node = parse_and_extract<AST.Root>(code, "Root");
		expect(node.options).toBeDefined();
		if (node.options) {
			expect(isSvelteOptions(node.options)).toBe(true);
		}
	});

	it("returns false for non-options node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
		expect(isSvelteOptions(node)).toBe(false);
	});
});
