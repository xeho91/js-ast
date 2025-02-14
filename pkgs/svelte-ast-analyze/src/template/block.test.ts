import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../../tests/shared.js";

import { isBlock } from "./block.ts";

describe(isBlock.name, () => {
	it("returns true for if block", ({ expect }) => {
		const code = "{#if condition}content{/if}";
		const node = parse_and_extract<AST.IfBlock>(code, "IfBlock");
		expect(isBlock(node)).toBe(true);
	});

	it("returns true for each block", ({ expect }) => {
		const code = "{#each items as item}content{/each}";
		const node = parse_and_extract<AST.EachBlock>(code, "EachBlock");
		expect(isBlock(node)).toBe(true);
	});

	it("returns true for await block", ({ expect }) => {
		const code = "{#await promise}loading{/await}";
		const node = parse_and_extract<AST.AwaitBlock>(code, "AwaitBlock");
		expect(isBlock(node)).toBe(true);
	});

	it("returns false for non-block node", ({ expect }) => {
		const code = "<div>text</div>";
		const node = parse_and_extract<AST.Text>(code, "Text");
		expect(isBlock(node)).toBe(false);
	});
});
