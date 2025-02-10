// import { describe, it } from "vitest";
//
// import type { AST } from "svelte/compiler";
//
// import { parse_and_extract } from "../tests/shared.ts";
//
// import { printConstTag, printDebugTag, printExpressionTag, printHtmlTag, printRenderTag, printTag } from "./tag.js";
//
// describe(printTag.name, () => {
// 	it("print correctly `@const` tag", ({ expect }) => {
// 		const code = "{@const area = box.width * box.height}";
// 		const node = parse_and_extract<AST.ConstTag>(code, "ConstTag");
// 		expect(printTag(node).toString()).toMatchInlineSnapshot(`"{@const area = box.width * box.height}"`);
// 	});
//
// 	it("print correctly  `@debug` tag", ({ expect }) => {
// 		const code = "{@debug user}";
// 		const node = parse_and_extract<AST.DebugTag>(code, "DebugTag");
// 		expect(printTag(node).toString()).toMatchInlineSnapshot(`"{@debug user}"`);
// 	});
//
// 	it("print correctly `{expression}` tag", ({ expect }) => {
// 		const code = "{name}";
// 		const node = parse_and_extract<AST.ExpressionTag>(code, "ExpressionTag");
// 		expect(printTag(node).toString()).toMatchInlineSnapshot(`"{name}"`);
// 	});
//
// 	it("print correctly  `@html` tag", ({ expect }) => {
// 		const code = "{@html '<h1>Svelte 🧡</h1>'}";
// 		const node = parse_and_extract<AST.HtmlTag>(code, "HtmlTag");
// 		expect(printTag(node).toString()).toMatchInlineSnapshot(`"{@html '<h1>Svelte 🧡</h1>'}"`);
// 	});
//
// 	it("print correctly  `@render` tag", ({ expect }) => {
// 		const code = "{@render children()}";
// 		const node = parse_and_extract<AST.RenderTag>(code, "RenderTag");
// 		expect(printTag(node).toString()).toMatchInlineSnapshot(`"{@render children()}"`);
// 	});
// });
//
// describe(printConstTag.name, () => {
// 	it("prints correctly when used as direct child of allowed tags ", ({ expect }) => {
// 		const code = `
// 			{#each boxes as box}
// 				{@const area = box.width * box.height}
// 				{box.width} * {box.height} = {area}
// 			{/each}
// 		`;
// 		const node = parse_and_extract<AST.ConstTag>(code, "ConstTag");
// 		expect(printConstTag(node).toString()).toMatchInlineSnapshot(`"{@const area = box.width * box.height}"`);
// 	});
// });
//
// describe(printDebugTag.name, () => {
// 	it("prints correctly when used as direct child of allowed tags ", ({ expect }) => {
// 		const code = `
// 			<script>
// 				let user = {
// 					firstname: 'Ada',
// 					lastname: 'Lovelace'
// 				};
// 			</script>
//
// 			{@debug user}
//
// 			<h1>Hello {user.firstname}!</h1>
// 		`;
// 		const node = parse_and_extract<AST.DebugTag>(code, "DebugTag");
// 		expect(printDebugTag(node).toString()).toMatchInlineSnapshot(`"{@debug user}"`);
// 	});
// });
//
// describe(printExpressionTag.name, () => {
// 	it("correctly prints an reactive and simple Svelte expression in template", ({ expect }) => {
// 		const code = "{name}";
// 		const node = parse_and_extract<AST.ExpressionTag>(code, "ExpressionTag");
// 		expect(printExpressionTag(node).toString()).toMatchInlineSnapshot(`"{name}"`);
// 	});
//
// 	it("supports dot notation", ({ expect }) => {
// 		const code = "{svelte.is.the.best.framework}";
// 		const node = parse_and_extract<AST.ExpressionTag>(code, "ExpressionTag");
// 		expect(printExpressionTag(node).toString()).toMatchInlineSnapshot(`"{svelte.is.the.best.framework}"`);
// 	});
//
// 	it("supports brackets notation and question mark", ({ expect }) => {
// 		const code = "{svelte[5].release?.date}";
// 		const node = parse_and_extract<AST.ExpressionTag>(code, "ExpressionTag");
// 		expect(printExpressionTag(node).toString()).toMatchInlineSnapshot(`"{svelte[5].release?.date}"`);
// 	});
// });
//
// describe(printHtmlTag.name, () => {
// 	it("prints correctly when used in an example case", ({ expect }) => {
// 		const code = `
// 				<div class="blog-post">
// 					<h1>{post.title}</h1>
// 					{@html post.content}
// 				</div>
// 			`;
// 		const node = parse_and_extract<AST.HtmlTag>(code, "HtmlTag");
// 		expect(printHtmlTag(node).toString()).toMatchInlineSnapshot(`"{@html post.content}"`);
// 	});
// });
//
// describe(printRenderTag.name, () => {
// 	it("prints correctly when used in an example case", ({ expect }) => {
// 		const code = `
// 			{#snippet hello(name)}
// 				<p>hello {name}! {message}!</p>
// 			{/snippet}
//
// 			{@render hello('alice')}
// 		`;
// 		const node = parse_and_extract<AST.RenderTag>(code, "RenderTag");
// 		expect(printRenderTag(node).toString()).toMatchInlineSnapshot(`"{@render hello('alice')}"`);
// 	});
// });
