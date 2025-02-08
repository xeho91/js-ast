import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../tests/shared.ts";

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
} from "./attribute.js";

describe(printAttributeLike.name, () => {
	describe(printAttribute.name, () => {
		it("correctly prints boolean value", ({ expect }) => {
			const code = `
			<input required />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).toString()).toMatchInlineSnapshot(`"required"`);
		});

		it("correctly prints empty text expression value", ({ expect }) => {
			const code = `
			<input required="" />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).toString()).toMatchInlineSnapshot(`"required="""`);
		});

		it("correctly prints text expression value with text", ({ expect }) => {
			const code = `
			<div aria-label="this is a modal box" />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).toString()).toMatchInlineSnapshot(`"aria-label="this is a modal box""`);
		});

		it("correctly prints booleanish expression tag value", ({ expect }) => {
			const code = `
			<button {disabled} />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).toString()).toMatchInlineSnapshot(`"{disabled}"`);
		});

		it("correctly prints expression tag value with string template", ({ expect }) => {
			const code = `
			<Button id={\`button-\${id}\`} />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).toString()).toMatchInlineSnapshot(`"id={\`button-\${id}\`}"`);
		});

		it("correctly prints expression tag with string", ({ expect }) => {
			const code = `
			<Tab name={"Home"} />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).toString()).toMatchInlineSnapshot(`"name={"Home"}"`);
		});

		it("correctly prints string with expression tags inside", ({ expect }) => {
			const code = `
			<Button class="{variant} small" />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).toString()).toMatchInlineSnapshot(`"class="{variant} small""`);
		});

		it("correctly prints expression tag with array expression", ({ expect }) => {
			const code = `
			<Select values={[1, 2, 3]} />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).toString()).toMatchInlineSnapshot(`"values={[1, 2, 3]}"`);
		});

		it("correctly prints expression tag with object expression", ({ expect }) => {
			const code = `
			<Container values={{ min: 1000, max: 1200, display: "grid" }} />
		`;
			const node = parse_and_extract<AST.Attribute>(code, "Attribute");
			expect(printAttribute(node).toString()).toMatchInlineSnapshot(
				`"values={{ min: 1000, max: 1200, display: "grid" }}"`,
			);
		});
	});

	describe(printSpreadAttribute.name, () => {
		it("works using normal identifier", ({ expect }) => {
			const code = `
			<Widget {...things} />
		`;
			const node = parse_and_extract<AST.SpreadAttribute>(code, "SpreadAttribute");
			expect(printSpreadAttribute(node).toString()).toMatchInlineSnapshot(`"{...things}"`);
		});

		it("works using $$props", ({ expect }) => {
			const code = `
			<Widget {...$$props} />
		`;
			const node = parse_and_extract<AST.SpreadAttribute>(code, "SpreadAttribute");
			expect(printSpreadAttribute(node).toString()).toMatchInlineSnapshot(`"{...$$props}"`);
		});

		it("works using $$restProps", ({ expect }) => {
			const code = `
			<Widget {...$$restProps} />
		`;
			const node = parse_and_extract<AST.SpreadAttribute>(code, "SpreadAttribute");
			expect(printSpreadAttribute(node).toString()).toMatchInlineSnapshot(`"{...$$restProps}"`);
		});
	});

	describe(printAnimateDirective.name, () => {
		it("works on without params variant", ({ expect }) => {
			const code = `
			{#each list as item, index (item)}
				<li animate:flip>{item}</li>
			{/each}
		`;
			const node = parse_and_extract<AST.AnimateDirective>(code, "AnimateDirective");
			expect(printAnimateDirective(node).toString()).toMatchInlineSnapshot(`"animate:flip"`);
		});

		it("works on with params variant", ({ expect }) => {
			const code = `
			{#each list as item, index (item)}
				<li animate:flip={{ delay: 500 }}>{item}</li>
			{/each}
		`;
			const node = parse_and_extract<AST.AnimateDirective>(code, "AnimateDirective");
			expect(printAnimateDirective(node).toString()).toMatchInlineSnapshot(`"animate:flip={{ delay: 500 }}"`);
		});
	});

	describe(printBindDirective.name, () => {
		it("prints correctly when is a shorthand", ({ expect }) => {
			const code = `
			<script lang="ts">
				let value: string;
			</script>

			<input type="text" bind:value />
		`;
			const node = parse_and_extract<AST.BindDirective>(code, "BindDirective");
			expect(printBindDirective(node).toString()).toMatchInlineSnapshot(`"bind:value"`);
		});

		it("works on binding input value", ({ expect }) => {
			const code = `
			<input bind:value={name} />
		`;
			const node = parse_and_extract<AST.BindDirective>(code, "BindDirective");
			expect(printBindDirective(node).toString()).toMatchInlineSnapshot(`"bind:value={name}"`);
		});

		it("works on binding input checked", ({ expect }) => {
			const code = `
			<input type="checkbox" bind:checked={yes} />
		`;
			const node = parse_and_extract<AST.BindDirective>(code, "BindDirective");
			expect(printBindDirective(node).toString()).toMatchInlineSnapshot(`"bind:checked={yes}"`);
		});
	});

	describe(printClassDirective.name, () => {
		it("works with value", ({ expect }) => {
			const code = `
			<div class:active={isActive}>...</div>
		`;
			const node = parse_and_extract<AST.ClassDirective>(code, "ClassDirective");
			expect(printClassDirective(node).toString()).toMatchInlineSnapshot(`"class:active={isActive}"`);
		});

		it("works without value - shorthand", ({ expect }) => {
			const code = `
			<div class:active>...</div>
		`;
			const node = parse_and_extract<AST.ClassDirective>(code, "ClassDirective");
			expect(printClassDirective(node).toString()).toMatchInlineSnapshot(`"class:active"`);
		});
	});

	describe(printLetDirective.name, () => {
		it("works on with value", ({ expect }) => {
			const code = `
			<FancyList {items} let:prop={thing}>
				<div>{thing.text}</div>
			</FancyList>
		`;
			const node = parse_and_extract<AST.LetDirective>(code, "LetDirective");
			expect(printLetDirective(node).toString()).toMatchInlineSnapshot(`"let:prop={thing}"`);
		});

		it("works on without value", ({ expect }) => {
			const code = `
			<Story let:args>
				<Button {...args} />
			</Story>
		`;
			const node = parse_and_extract<AST.LetDirective>(code, "LetDirective");
			expect(printLetDirective(node).toString()).toMatchInlineSnapshot(`"let:args"`);
		});
	});

	describe(printOnDirective.name, () => {
		it("works on without modifiers variant", ({ expect }) => {
			const code = `
			<button on:click={() => (count += 1)}>
				count: {count}
			</button>
		`;
			const node = parse_and_extract<AST.OnDirective>(code, "OnDirective");
			expect(printOnDirective(node).toString()).toMatchInlineSnapshot(`"on:click={() => count += 1}"`);
		});

		it("works on with modifiers variant", ({ expect }) => {
			const code = `
			<form on:submit|preventDefault={handleSubmit}>
				...
			</form>
		`;
			const node = parse_and_extract<AST.OnDirective>(code, "OnDirective");
			expect(printOnDirective(node).toString()).toMatchInlineSnapshot(
				`"on:submit|preventDefault={handleSubmit}"`,
			);
		});
	});

	describe(printStyleDirective.name, () => {
		it("works with expression tag value", ({ expect }) => {
			const code = `
			<div style:color={myColor}>...</div>
		`;
			const node = parse_and_extract<AST.StyleDirective>(code, "StyleDirective");
			expect(printStyleDirective(node).toString()).toMatchInlineSnapshot(`"style:color={myColor}"`);
		});

		it("works with shorthand", ({ expect }) => {
			const code = `
			<div style:color>...</div>
		`;
			const node = parse_and_extract<AST.StyleDirective>(code, "StyleDirective");
			expect(printStyleDirective(node).toString()).toMatchInlineSnapshot(`"style:color"`);
		});

		it("works with text expression", ({ expect }) => {
			const code = `
			<div style:color="red">...</div>
		`;
			const node = parse_and_extract<AST.StyleDirective>(code, "StyleDirective");
			expect(printStyleDirective(node).toString()).toMatchInlineSnapshot(`"style:color="red""`);
		});

		it("works with modifiers and text expression", ({ expect }) => {
			const code = `
			<div style:color|important="red">...</div>
		`;
			const node = parse_and_extract<AST.StyleDirective>(code, "StyleDirective");
			expect(printStyleDirective(node).toString()).toMatchInlineSnapshot(`"style:color|important="red""`);
		});
	});

	describe(printTransitionDirective.name, () => {
		it("works when using transition", ({ expect }) => {
			const code = `
			{#if visible}
				<div transition:scale>scales in, scales out</div>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).toString()).toMatchInlineSnapshot(`"transition:scale"`);
		});

		it("works when using intro", ({ expect }) => {
			const code = `
			{#if visible}
				<div in:fly>flies in</div>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).toString()).toMatchInlineSnapshot(`"in:fly"`);
		});

		it("works when using outro", ({ expect }) => {
			const code = `
			{#if visible}
				<div out:fade>fades out</div>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).toString()).toMatchInlineSnapshot(`"out:fade"`);
		});

		it("works when using params", ({ expect }) => {
			const code = `
			{#if visible}
				<p transition:fly={{ y: 200, duration: 2000 }}>
					Flies in and out
				</p>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).toString()).toMatchInlineSnapshot(
				`"transition:fly={{ y: 200, duration: 2000 }}"`,
			);
		});

		it("works when using modifiers", ({ expect }) => {
			const code = `
			{#if visible}
				<p transition:fade|global>fades in and out when x or y change</p>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).toString()).toMatchInlineSnapshot(`"transition:fade|global"`);
		});

		it("works when using modifiers and with params", ({ expect }) => {
			const code = `
			{#if visible}
				<p transition:fade|local={{ y: 200, duration: 2000 }}>fades in and out when x or y change</p>
			{/if}
		`;
			const node = parse_and_extract<AST.TransitionDirective>(code, "TransitionDirective");
			expect(printTransitionDirective(node).toString()).toMatchInlineSnapshot(
				`"transition:fade|local={{ y: 200, duration: 2000 }}"`,
			);
		});
	});

	describe(printUseDirective.name, () => {
		it("works with parameters", ({ expect }) => {
			const code = `
			<div use:foo={bar} />
		`;
			const node = parse_and_extract<AST.UseDirective>(code, "UseDirective");
			expect(printUseDirective(node).toString()).toMatchInlineSnapshot(`"use:foo={bar}"`);
		});

		it("works on without parameters - shorthand", ({ expect }) => {
			const code = `
			<div use:foo />
		`;
			const node = parse_and_extract<AST.UseDirective>(code, "UseDirective");
			expect(printUseDirective(node).toString()).toMatchInlineSnapshot(`"use:foo"`);
		});
	});
});
