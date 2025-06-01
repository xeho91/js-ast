import { parse_and_extract } from "@internals/test/svelte";
import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { printComment, printHTMLNode, printText } from "./html.ts";

describe(printHTMLNode, () => {
	describe(printComment, () => {
		it("prints correctly a single line comment from random code", ({ expect }) => {
			const code = `<!-- This is a single line comment -->`;
			const node = parse_and_extract<AST.Comment>(code, "Comment");
			expect(printComment(node).code).toMatchInlineSnapshot(`"<!-- This is a single line comment -->"`);
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
			expect(printComment(node).code).toMatchInlineSnapshot(
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

	describe(printText, () => {
		it("prints correctly a random text comment from random code", ({ expect }) => {
			const code = `<span>Catch me if you can</span>`;
			const node = parse_and_extract<AST.Text>(code, "Text");
			expect(printText(node).code).toMatchInlineSnapshot(`"Catch me if you can"`);
		});
	});
});
