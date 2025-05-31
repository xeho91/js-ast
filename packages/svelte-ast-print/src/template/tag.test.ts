import { parse_and_extract } from "@internals/test/svelte";
import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import {
	printAttachTag,
	printConstTag,
	printDebugTag,
	printExpressionTag,
	printHtmlTag,
	printRenderTag,
	printTag,
} from "./tag.ts";

describe(printTag, () => {
	it("print correctly `@attach` tag", ({ expect }) => {
		const code = "<canvas {@attach tooltip(content)}></canvas>";
		const node = parse_and_extract<AST.AttachTag>(code, "AttachTag");
		expect(printTag(node).code).toMatchInlineSnapshot(`"{@attach tooltip(content)}"`);
	});

	it("print correctly `@const` tag", ({ expect }) => {
		const code = "{@const area = box.width * box.height}";
		const node = parse_and_extract<AST.ConstTag>(code, "ConstTag");
		expect(printTag(node).code).toMatchInlineSnapshot(`"{@const area = box.width * box.height}"`);
	});

	it("print correctly  `@debug` tag", ({ expect }) => {
		const code = "{@debug user}";
		const node = parse_and_extract<AST.DebugTag>(code, "DebugTag");
		expect(printTag(node).code).toMatchInlineSnapshot(`"{@debug user}"`);
	});

	it("print correctly `{expression}` tag", ({ expect }) => {
		const code = "{name}";
		const node = parse_and_extract<AST.ExpressionTag>(code, "ExpressionTag");
		expect(printTag(node).code).toMatchInlineSnapshot(`"{name}"`);
	});

	it("print correctly  `@html` tag", ({ expect }) => {
		const code = "{@html '<h1>Svelte 🧡</h1>'}";
		const node = parse_and_extract<AST.HtmlTag>(code, "HtmlTag");
		expect(printTag(node).code).toMatchInlineSnapshot(`"{@html '<h1>Svelte 🧡</h1>'}"`);
	});

	it("print correctly  `@render` tag", ({ expect }) => {
		const code = "{@render children()}";
		const node = parse_and_extract<AST.RenderTag>(code, "RenderTag");
		expect(printTag(node).code).toMatchInlineSnapshot(`"{@render children()}"`);
	});
});

describe(printAttachTag, () => {
	it("prints correctly when is a reference", ({ expect }) => {
		const code = `
			<div {@attach myAttachment}>...</div>
		`;
		const node = parse_and_extract<AST.AttachTag>(code, "AttachTag");
		expect(printAttachTag(node).code).toMatchInlineSnapshot(`"{@attach myAttachment}"`);
	});

	it("prints correctly when is function call", ({ expect }) => {
		const code = `
			<button {@attach tooltip(content)}>
				Hover me
			</button>
		`;
		const node = parse_and_extract<AST.AttachTag>(code, "AttachTag");
		expect(printAttachTag(node).code).toMatchInlineSnapshot(`"{@attach tooltip(content)}"`);
	});

	it("prints correctly when is an inline attachment", ({ expect }) => {
		const code = `
			<canvas
				width={32}
				height={32}
				{@attach (canvas) => {
					const context = canvas.getContext('2d');

					$effect(() => {
						context.fillStyle = color;
						context.fillRect(0, 0, canvas.width, canvas.height);
					});
				}}
			></canvas>
		`;
		const node = parse_and_extract<AST.AttachTag>(code, "AttachTag");
		expect(printAttachTag(node).code).toMatchInlineSnapshot(
			`
			"{@attach (canvas) => {
				const context = canvas.getContext('2d');

				$effect(() => {
					context.fillStyle = color;
					context.fillRect(0, 0, canvas.width, canvas.height);
				});
			}}"
		`,
		);
	});
});

describe(printConstTag, () => {
	it("prints correctly when used as direct child of allowed tags ", ({ expect }) => {
		const code = `
			{#each boxes as box}
				{@const area = box.width * box.height}
				{box.width} * {box.height} = {area}
			{/each}
		`;
		const node = parse_and_extract<AST.ConstTag>(code, "ConstTag");
		expect(printConstTag(node).code).toMatchInlineSnapshot(`"{@const area = box.width * box.height}"`);
	});
});

describe(printDebugTag, () => {
	it("prints correctly when used as direct child of allowed tags ", ({ expect }) => {
		const code = `
			<script>
				let user = {
					firstname: 'Ada',
					lastname: 'Lovelace'
				};
			</script>

			{@debug user}

			<h1>Hello {user.firstname}!</h1>
		`;
		const node = parse_and_extract<AST.DebugTag>(code, "DebugTag");
		expect(printDebugTag(node).code).toMatchInlineSnapshot(`"{@debug user}"`);
	});
});

describe(printExpressionTag, () => {
	it("correctly prints an reactive and simple Svelte expression in template", ({ expect }) => {
		const code = "{name}";
		const node = parse_and_extract<AST.ExpressionTag>(code, "ExpressionTag");
		expect(printExpressionTag(node).code).toMatchInlineSnapshot(`"{name}"`);
	});

	it("supports dot notation", ({ expect }) => {
		const code = "{svelte.is.the.best.framework}";
		const node = parse_and_extract<AST.ExpressionTag>(code, "ExpressionTag");
		expect(printExpressionTag(node).code).toMatchInlineSnapshot(`"{svelte.is.the.best.framework}"`);
	});

	it("supports brackets notation and question mark", ({ expect }) => {
		const code = "{svelte[5].release?.date}";
		const node = parse_and_extract<AST.ExpressionTag>(code, "ExpressionTag");
		expect(printExpressionTag(node).code).toMatchInlineSnapshot(`"{svelte[5].release?.date}"`);
	});
});

describe(printHtmlTag, () => {
	it("prints correctly when used in an example case", ({ expect }) => {
		const code = `
				<div class="blog-post">
					<h1>{post.title}</h1>
					{@html post.content}
				</div>
			`;
		const node = parse_and_extract<AST.HtmlTag>(code, "HtmlTag");
		expect(printHtmlTag(node).code).toMatchInlineSnapshot(`"{@html post.content}"`);
	});
});

describe(printRenderTag, () => {
	it("prints correctly when used in an example case", ({ expect }) => {
		const code = `
			{#snippet hello(name)}
				<p>hello {name}! {message}!</p>
			{/snippet}

			{@render hello('alice')}
		`;
		const node = parse_and_extract<AST.RenderTag>(code, "RenderTag");
		expect(printRenderTag(node).code).toMatchInlineSnapshot(`"{@render hello('alice')}"`);
	});
});
