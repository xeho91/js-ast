import type { Identifier } from "estree";
import { type AST, parse } from "svelte/compiler";
import { describe, it } from "vitest";

import { print, printSvelte } from "./lib.ts";

describe(print, () => {
	it("it prints correctly JavaScript AST node", ({ expect }) => {
		const node = {
			type: "Identifier",
			name: "JavaScript",
		} satisfies Identifier;
		expect(print(node).code).toMatchInlineSnapshot(`"JavaScript"`);
	});

	it("it prints correctly Svelte AST node", ({ expect }) => {
		const node = {
			type: "ConstTag",
			declaration: {
				type: "VariableDeclaration",
				kind: "const",
				declarations: [
					{
						type: "VariableDeclarator",
						id: {
							type: "Identifier",
							name: "framework",
						},
						init: {
							type: "Literal",
							value: "Svelte",
						},
					},
				],
			},
		} satisfies AST.ConstTag;
		expect(print(node).code).toMatchInlineSnapshot(`"{@const framework = 'Svelte'}"`);
	});
});

describe(printSvelte, () => {
	it("it prints correctly Svelte code without TypeScript syntax", ({ expect }) => {
		const code = `
			<script module lang="ts">
				export const FOO = "BAR";
			</script>

			<script lang="ts">
				interface Props {
					foo: string;
				}
				let { foo }: Props = $props();
			</script>

			<div>{foo}</div>
		`;
		const ast = parse(code, { modern: true });
		expect(printSvelte(ast).code).toMatchInlineSnapshot(`
			"<script module lang="ts">
				export const FOO = "BAR";
			</script>

			<script lang="ts">
				interface Props { foo: string }

				let { foo }: Props = $props();
			</script>

			<div>{foo}</div>"
		`);
	});

	it("it prints correctly Svelte code with TypeScript syntax", ({ expect }) => {
		const code = `
			<script>
				console.log('asd');
			</script>

			<div><p>Asd</p></div>

			<style>
				p { color: red }
			</style>
		`;
		const ast = parse(code, { modern: true });
		expect(printSvelte(ast).code).toMatchInlineSnapshot(`
			"<script>
				console.log('asd');
			</script>

			<div><p>Asd</p></div>

			<style>
				p {
					color: red;
				}
			</style>"
		`);
	});
});
