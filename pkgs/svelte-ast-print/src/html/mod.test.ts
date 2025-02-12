import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../../tests/shared.ts";

import { printComment, printHTML, printText } from "./mod.js";

describe(printHTML.name, () => {
	describe(printComment.name, () => {
		it("prints correctly a single line comment from random code", ({ expect }) => {
			const code = `
			{#each boxes as box}
				<!-- This is a single line comment -->
				{@const area = box.width * box.height}
				{box.width} * {box.height} = {area}
			{/each}
		`;
			const node = parse_and_extract<AST.Comment>(code, "Comment");
			expect(printComment(node).toString()).toMatchInlineSnapshot(`"<!-- This is a single line comment -->"`);
		});

		it("supports multiple line comment", ({ expect }) => {
			const code = `
			<!--
				This
				is
				multiple
				line
				comment
			-->
		`;
			const node = parse_and_extract<AST.Comment>(code, "Comment");
			expect(printComment(node).toString()).toMatchInlineSnapshot(
				`
			"<!--
				This
				is
				multiple
				line
				comment
			-->"
		`,
			);
		});
	});

	describe(printText.name, () => {
		it("prints correctly a random text comment from random code", ({ expect }) => {
			const code = `
			<span>Catch me if you can</span>
		`;
			const node = parse_and_extract<AST.Text>(code, "Text");
			expect(printText(node).toString()).toMatchInlineSnapshot(`"Catch me if you can"`);
		});
	});
});
