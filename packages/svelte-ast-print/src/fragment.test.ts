import { parse_and_extract } from "@internals/test/svelte";
import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { printFragment } from "./fragment.ts";

describe(printFragment, () => {
	it("it prints correctly fragment code", ({ expect }) => {
		const code = `
<h1 {@attach tooltip(content)}>Shopping list</h1>

<ul>
	{#each items as item}
		<li>{item.name} x {item.qty}</li>
	{/each}
</ul>

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

<div class="mb-6">
	<Label for="large-input" class="block mb-2">Large input</Label>
	<Input id="large-input" size="lg" placeholder="Large input" />
</div>

{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}

{#await promise}
	<!-- promise is pending -->
	<p>waiting for the promise to resolve...</p>
{:then value}
	<!-- promise was fulfilled or not a Promise -->
	<p>The value is {value}</p>
{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}

{#key value}
	<div transition:fade>{value}</div>
{/key}
		`;
		const node = parse_and_extract<AST.Fragment>(code, "Fragment");
		expect(printFragment(node).code).toMatchInlineSnapshot(`
			"
			<h1 {@attach tooltip(content)}>Shopping list</h1>

			<ul>
				{#each items as item}
					<li>{item.name} x {item.qty}</li>
				{/each}
			</ul>

			<canvas width={32} height={32} {@attach (canvas) => {
				const context = canvas.getContext('2d');

				$effect(() => {
					context.fillStyle = color;
					context.fillRect(0, 0, canvas.width, canvas.height);
				});
			}}></canvas>

			<div class="mb-6">
				<Label for="large-input" class="block mb-2">Large input</Label>
				<Input id="large-input" size="lg" placeholder="Large input" />
			</div>

			{#if porridge.temperature > 100}
				<p>too hot!</p>
			{:else if 80 > porridge.temperature}
				<p>too cold!</p>
			{:else}
				<p>just right!</p>
			{/if}

			{#await promise}
				<!-- promise is pending -->
				<p>waiting for the promise to resolve...</p>
			{:then value}
				<!-- promise was fulfilled or not a Promise -->
				<p>The value is {value}</p>
			{:catch error}
				<!-- promise was rejected -->
				<p>Something went wrong: {error.message}</p>
			{/await}

			{#key value}
				<div transition:fade>{value}</div>
			{/key}"
		`);
	});

	it("it prints correctly fragment code with typescript syntax", ({ expect }) => {
		const code = `
<script lang="ts">
	//
</script>

{#snippet template({ children, ...args }: Args<typeof Story>, context: StoryContext<typeof Story>)}
	<Button {...args}>{children}</Button>
{/snippet}
		`;
		const node = parse_and_extract<AST.Fragment>(code, "Fragment");
		expect(printFragment(node).code).toMatchInlineSnapshot(`
			"


			{#snippet template({ children, ...args }: Args<typeof Story>, context: StoryContext<typeof Story>)}
				<Button {...args}>{children}</Button>
			{/snippet}"
		`);
	});
});
