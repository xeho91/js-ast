import { parse_and_extract } from "@internals/test/svelte";
import type { AST } from "svelte/compiler";
import * as vitest from "vitest";

import {
	printAnimateDirective,
	printAttribute,
	printAttributeLike,
	printBindDirective,
	printClassDirective,
	printLetDirective,
	printOnDirective,
	printSpreadAttribute,
	printStyleDirective,
	printTransitionDirective,
	printUseDirective,
} from "./attribute.ts";

vitest.describe(printAttributeLike.name, () => {
	vitest.describe(printAttribute.name, () => {
		vitest.it("correctly prints boolean value", ({ expect }) => {
			const code = `
			<input required />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).code).toMatchInlineSnapshot(`"required"`);
		});

		vitest.it("correctly prints empty text expression value", ({ expect }) => {
			const code = `
			<input required="" />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).code).toMatchInlineSnapshot(`"required="""`);
		});

		vitest.it("correctly prints text expression value with text", ({ expect }) => {
			const code = `
			<div aria-label="this is a modal box" />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).code).toMatchInlineSnapshot(`"aria-label="this is a modal box""`);
		});

		vitest.it("correctly prints booleanish expression tag value", ({ expect }) => {
			const code = `
			<button {disabled} />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).code).toMatchInlineSnapshot(`"{disabled}"`);
		});

		vitest.it("correctly prints expression tag value with string template", ({ expect }) => {
			const code = `
			<Button id={\`button-\${id}\`} />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).code).toMatchInlineSnapshot(`"id={\`button-\${id}\`}"`);
		});

		vitest.it("correctly prints expression tag with string", ({ expect }) => {
			const code = `
			<Tab name={"Home"} />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).code).toMatchInlineSnapshot(`"name={"Home"}"`);
		});

		vitest.it("correctly prints string with expression tags inside", ({ expect }) => {
			const code = `
			<Button class="{variant} small" />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).code).toMatchInlineSnapshot(`"class="{variant} small""`);
		});

		vitest.it("correctly prints expression tag with array expression", ({ expect }) => {
			const code = `
			<Select values={[1, 2, 3]} />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).code).toMatchInlineSnapshot(`"values={[1, 2, 3]}"`);
		});

		vitest.it("correctly prints expression tag with object expression", ({ expect }) => {
			const code = `
			<Container values={{ min: 1000, max: 1200, display: "grid" }} />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).code).toMatchInlineSnapshot(
				`"values={{ min: 1000, max: 1200, display: "grid" }}"`,
			);
		});
	});

	vitest.describe(printSpreadAttribute.name, () => {
		vitest.it("works using normal identifier", ({ expect }) => {
			const code = `
			<Widget {...things} />
		`;
			const node = parse_and_extract<AST.SpreadAttribute>(code, "SpreadAttribute");
			expect(printSpreadAttribute(node).code).toMatchInlineSnapshot(`"{...things}"`);
		});

		vitest.it("works using $$props", ({ expect }) => {
			const code = `
			<Widget {...$$props} />
		`;
			const node = parse_and_extract<AST.SpreadAttribute>(code, "SpreadAttribute");
			expect(printSpreadAttribute(node).code).toMatchInlineSnapshot(`"{...$$props}"`);
		});

		vitest.it("works using $$restProps", ({ expect }) => {
			const code = `
			<Widget {...$$restProps} />
		`;
			const node = parse_and_extract<AST.SpreadAttribute>(code, "SpreadAttribute");
			expect(printSpreadAttribute(node).code).toMatchInlineSnapshot(`"{...$$restProps}"`);
		});
	});

	vitest.describe(printAnimateDirective.name, () => {
		vitest.it("works on without params variant", ({ expect }) => {
			const code = `
			{#each list as item, index (item)}
				<li animate:flip>{item}</li>
			{/each}
		`;
			const node = parse_and_extract<AST.AnimateDirective>(code, "AnimateDirective");
			expect(printAnimateDirective(node).code).toMatchInlineSnapshot(`"animate:flip"`);
		});

		vitest.it("works on with params variant", ({ expect }) => {
			const code = `
			{#each list as item, index (item)}
				<li animate:flip={{ delay: 500 }}>{item}</li>
			{/each}
		`;
			const node = parse_and_extract<AST.AnimateDirective>(code, "AnimateDirective");
			expect(printAnimateDirective(node).code).toMatchInlineSnapshot(`"animate:flip={{ delay: 500 }}"`);
		});
	});

	vitest.describe(printBindDirective.name, () => {
		vitest.it("prints correctly when is a shorthand", ({ expect }) => {
			const code = `
			<script lang="ts">
				let value: string;
			</script>

			<input type="text" bind:value />
		`;
			const node = parse_and_extract<AST.BindDirective>(code, "BindDirective");
			expect(printBindDirective(node).code).toMatchInlineSnapshot(`"bind:value"`);
		});

		vitest.it("works on binding input value", ({ expect }) => {
			const code = `
			<input bind:value={name} />
		`;
			const node = parse_and_extract<AST.BindDirective>(code, "BindDirective");
			expect(printBindDirective(node).code).toMatchInlineSnapshot(`"bind:value={name}"`);
		});

		vitest.it("works on binding input checked", ({ expect }) => {
			const code = `
			<input type="checkbox" bind:checked={yes} />
		`;
			const node = parse_and_extract<AST.BindDirective>(code, "BindDirective");
			expect(printBindDirective(node).code).toMatchInlineSnapshot(`"bind:checked={yes}"`);
		});
	});

	vitest.describe(printClassDirective.name, () => {
		vitest.it("works with value", ({ expect }) => {
			const code = `
			<div class:active={isActive}>...</div>
		`;
			const node = parse_and_extract<AST.ClassDirective>(code, "ClassDirective");
			expect(printClassDirective(node).code).toMatchInlineSnapshot(`"class:active={isActive}"`);
		});

		vitest.it("works without value - shorthand", ({ expect }) => {
			const code = `
			<div class:active>...</div>
		`;
			const node = parse_and_extract<AST.ClassDirective>(code, "ClassDirective");
			expect(printClassDirective(node).code).toMatchInlineSnapshot(`"class:active"`);
		});
	});

	vitest.describe(printLetDirective.name, () => {
		vitest.it("works on with value", ({ expect }) => {
			const code = `
			<FancyList {items} let:prop={thing}>
				<div>{thing.text}</div>
			</FancyList>
		`;
			const node = parse_and_extract<AST.LetDirective>(code, "LetDirective");
			expect(printLetDirective(node).code).toMatchInlineSnapshot(`"let:prop={thing}"`);
		});

		vitest.it("works on without value", ({ expect }) => {
			const code = `
			<Story let:args>
				<Button {...args} />
			</Story>
		`;
			const node = parse_and_extract<AST.LetDirective>(code, "LetDirective");
			expect(printLetDirective(node).code).toMatchInlineSnapshot(`"let:args"`);
		});
	});

	vitest.describe(printOnDirective.name, () => {
		vitest.it("works on without modifiers variant", ({ expect }) => {
			const code = `
			<button on:click={() => (count += 1)}>
				count: {count}
			</button>
		`;
			const node = parse_and_extract<AST.OnDirective>(code, "OnDirective");
			expect(printOnDirective(node).code).toMatchInlineSnapshot(`"on:click={() => count += 1}"`);
		});

		vitest.it("works on with modifiers variant", ({ expect }) => {
			const code = `
			<form on:submit|preventDefault={handleSubmit}>
				...
			</form>
		`;
			const node = parse_and_extract<AST.OnDirective>(code, "OnDirective");
			expect(printOnDirective(node).code).toMatchInlineSnapshot(`"on:submit|preventDefault={handleSubmit}"`);
		});
	});

	vitest.describe(printStyleDirective.name, () => {
		vitest.it("works with expression tag value", ({ expect }) => {
			const code = `
			<div style:color={myColor}>...</div>
		`;
			const node = parse_and_extract<AST.StyleDirective>(code, "StyleDirective");
			expect(printStyleDirective(node).code).toMatchInlineSnapshot(`"style:color={myColor}"`);
		});

		vitest.it("works with shorthand", ({ expect }) => {
			const code = `
			<div style:color>...</div>
		`;
			const node = parse_and_extract<AST.StyleDirective>(code, "StyleDirective");
			expect(printStyleDirective(node).code).toMatchInlineSnapshot(`"style:color"`);
		});

		vitest.it("works with text expression", ({ expect }) => {
			const code = `
			<div style:color="red">...</div>
		`;
			const node = parse_and_extract<AST.StyleDirective>(code, "StyleDirective");
			expect(printStyleDirective(node).code).toMatchInlineSnapshot(`"style:color="red""`);
		});

		vitest.it("works with modifiers and text expression", ({ expect }) => {
			const code = `
			<div style:color|important="red">...</div>
		`;
			const node = parse_and_extract<AST.StyleDirective>(code, "StyleDirective");
			expect(printStyleDirective(node).code).toMatchInlineSnapshot(`"style:color|important="red""`);
		});
	});

	vitest.describe(printTransitionDirective.name, () => {
		vitest.it("works when using transition", ({ expect }) => {
			const code = `
			{#if visible}
				<div transition:scale>scales in, scales out</div>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).code).toMatchInlineSnapshot(`"transition:scale"`);
		});

		vitest.it("works when using intro", ({ expect }) => {
			const code = `
			{#if visible}
				<div in:fly>flies in</div>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).code).toMatchInlineSnapshot(`"in:fly"`);
		});

		vitest.it("works when using outro", ({ expect }) => {
			const code = `
			{#if visible}
				<div out:fade>fades out</div>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).code).toMatchInlineSnapshot(`"out:fade"`);
		});

		vitest.it("works when using params", ({ expect }) => {
			const code = `
			{#if visible}
				<p transition:fly={{ y: 200, duration: 2000 }}>
					Flies in and out
				</p>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).code).toMatchInlineSnapshot(
				`"transition:fly={{ y: 200, duration: 2000 }}"`,
			);
		});

		vitest.it("works when using modifiers", ({ expect }) => {
			const code = `
			{#if visible}
				<p transition:fade|global>fades in and out when x or y change</p>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).code).toMatchInlineSnapshot(`"transition:fade|global"`);
		});

		vitest.it("works when using modifiers and with params", ({ expect }) => {
			const code = `
			{#if visible}
				<p transition:fade|local={{ y: 200, duration: 2000 }}>fades in and out when x or y change</p>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).code).toMatchInlineSnapshot(
				`"transition:fade|local={{ y: 200, duration: 2000 }}"`,
			);
		});
	});

	vitest.describe(printUseDirective.name, () => {
		vitest.it("works with parameters", ({ expect }) => {
			const code = `
			<div use:foo={bar} />
		`;
			const node = parse_and_extract<AST.UseDirective>(code, "UseDirective");
			expect(printUseDirective(node).code).toMatchInlineSnapshot(`"use:foo={bar}"`);
		});

		vitest.it("works on without parameters - shorthand", ({ expect }) => {
			const code = `
			<div use:foo />
		`;
			const node = parse_and_extract<AST.UseDirective>(code, "UseDirective");
			expect(printUseDirective(node).code).toMatchInlineSnapshot(`"use:foo"`);
		});
	});
});
