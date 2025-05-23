import { parse_and_extract } from "@internals/test/svelte";
import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import {
	printComponent,
	printElementLike,
	printRegularElement,
	printSlotElement,
	printSvelteBody,
	printSvelteBoundary,
	printSvelteComponent,
	printSvelteDocument,
	printSvelteElement,
	printSvelteFragment,
	printSvelteHead,
	printSvelteOptions,
	printSvelteSelf,
	printSvelteWindow,
	printTitleElement,
} from "./element-like.ts";

describe(printElementLike, () => {
	describe(printComponent, () => {
		it("works on example component without children", ({ expect }) => {
			const code = `
			<Slider
				bind:value
				min={0}
				--rail-color="black"
				--track-color="rgb(0, 0, 255)"
			/>
		`;
			const node = parse_and_extract<AST.Component>(code, "Component");
			expect(printComponent(node).code).toMatchInlineSnapshot(
				`"<Slider bind:value min={0} --rail-color="black" --track-color="rgb(0, 0, 255)" />"`,
			);
		});

		it("works on example component with children", ({ expect }) => {
			const code = `
			<Navbar let:hidden let:toggle>
				<NavBrand href="/">
					<img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
					<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
				</NavBrand>

				<NavHamburger on:click={toggle} />

				<NavUl {hidden}>
					<NavLi href="/">Home</NavLi>
					<NavLi class="cursor-pointer">
						Mega menu<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
					</NavLi>

					<MegaMenu items={menu} let:item>
						<a href={item.href} class="hover:text-primary-600 dark:hover:text-primary-500">{item.name}</a>
					</MegaMenu>

					<NavLi href="/services">Services</NavLi>
					<NavLi href="/services">Products</NavLi>
					<NavLi href="/services">Contact</NavLi>
				</NavUl>
			</Navbar>
		`;
			const node = parse_and_extract<AST.Component>(code, "Component");
			expect(printComponent(node).code).toMatchInlineSnapshot(`
			"<Navbar let:hidden let:toggle>
				<NavBrand href="/">
					<img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
					<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
				</NavBrand>
				<NavHamburger on:click={toggle} />
				<NavUl {hidden}>
					<NavLi href="/">Home</NavLi>
					<NavLi class="cursor-pointer">
						Mega menu<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
					</NavLi>
					<MegaMenu items={menu} let:item>
						<a href={item.href} class="hover:text-primary-600 dark:hover:text-primary-500">{item.name}</a>
					</MegaMenu>
					<NavLi href="/services">Services</NavLi>
					<NavLi href="/services">Products</NavLi>
					<NavLi href="/services">Contact</NavLi>
				</NavUl>
			</Navbar>"
		`);
		});
	});

	describe(printRegularElement, () => {
		it("works on example component without children", ({ expect }) => {
			const code = `
			<input
				bind:value min={0}
				style:--rail-color="black"
				style:--track-color="rgb(0, 0, 255)"
			/>
		`;
			const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
			expect(printRegularElement(node).code).toMatchInlineSnapshot(
				`"<input bind:value min={0} style:--rail-color="black" style:--track-color="rgb(0, 0, 255)" />"`,
			);
		});

		it("works on example component with children", ({ expect }) => {
			const code = `
			<button on:click={increment}>Clicked {count} {count === 1 ? 'time' : 'times'}</button>
		`;
			const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
			expect(printRegularElement(node).code).toMatchInlineSnapshot(`
			"<button on:click={increment}>Clicked {count} {count === 1 ? 'time' : 'times'}</button>"
		`);
		});

		it("prints class attribute with string containing expression tags correctly", ({ expect }) => {
			const code = `
			<span class="{name} primary">test</span>
		`;
			const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
			expect(printRegularElement(node).code).toMatchInlineSnapshot(`"<span class="{name} primary">test</span>"`);
		});
	});

	describe(printSlotElement, () => {
		it("works on example component without children", ({ expect }) => {
			const code = `
			<slot name="description" />
		`;
			const node = parse_and_extract<AST.SlotElement>(code, "SlotElement");
			expect(printSlotElement(node).code).toMatchInlineSnapshot(`"<slot name="description" />"`);
		});

		it("works on example component with children", ({ expect }) => {
			const code = `
			<div>
				<slot name="header">No header was provided</slot>
				<p>Some content between header and footer</p>
			</div>
		`;
			const node = parse_and_extract<AST.SlotElement>(code, "SlotElement");
			expect(printSlotElement(node).code).toMatchInlineSnapshot(
				`"<slot name="header">No header was provided</slot>"`,
			);
		});
	});

	describe(printSvelteBody, () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
			<svelte:body on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave} use:someAction />
		`;
			const node = parse_and_extract<AST.SvelteBody>(code, "SvelteBody");
			expect(printSvelteBody(node).code).toMatchInlineSnapshot(
				`"<svelte:body on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave} use:someAction />"`,
			);
		});
	});

	describe(printSvelteBoundary, () => {
		it("works on basic example", ({ expect }) => {
			const code = `
			 <svelte:boundary>
				<FlakyComponent />
				{#snippet failed(error, reset)}
					<button onclick={reset}>oops! try again</button>
				{/snippet}
			 </svelte:boundary>
		`;
			const node = parse_and_extract<AST.SvelteBoundary>(code, "SvelteBoundary");
			expect(printSvelteBoundary(node).code).toMatchInlineSnapshot(
				`
			"<svelte:boundary>
				<FlakyComponent />
				{#snippet failed(error, reset)}
					<button onclick={reset}>oops! try again</button>
				{/snippet}
			</svelte:boundary>"
		`,
			);
		});
	});

	describe(printSvelteComponent, () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
			<svelte:component this={currentSelection.component} foo={bar} />
		`;
			const node = parse_and_extract<AST.SvelteComponent>(code, "SvelteComponent");
			expect(printSvelteComponent(node).code).toMatchInlineSnapshot(`"<svelte:component foo={bar} />"`);
		});
	});

	describe(printSvelteDocument, () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
				<svelte:document on:visibilitychange={handleVisibilityChange} use:someAction />
			`;
			const node = parse_and_extract<AST.SvelteDocument>(code, "SvelteDocument");
			expect(printSvelteDocument(node).code).toMatchInlineSnapshot(
				`"<svelte:document on:visibilitychange={handleVisibilityChange} use:someAction />"`,
			);
		});
	});

	describe(printSvelteElement, () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
			<svelte:element this={tag} on:click={handler}>Foo</svelte:element>
		`;
			const node = parse_and_extract<AST.SvelteElement>(code, "SvelteElement");
			expect(printSvelteElement(node).code).toMatchInlineSnapshot(
				`"<svelte:element this={tag} on:click={handler}>Foo</svelte:element>"`,
			);
		});
	});

	describe(printSvelteFragment, () => {
		it("works when is valid (has children)", ({ expect }) => {
			const code = `
			<svelte:fragment slot="footer">
				<p>All rights reserved.</p>
				<p>Copyright (c) 2019 Svelte Industries</p>
			</svelte:fragment>
		`;
			const node = parse_and_extract<AST.SvelteFragment>(code, "SvelteFragment");
			expect(printSvelteFragment(node).code).toMatchInlineSnapshot(`
			"<svelte:fragment slot="footer">
				<p>All rights reserved.</p>
				<p>Copyright (c) 2019 Svelte Industries</p>
			</svelte:fragment>"
		`);
		});
	});

	describe(printSvelteHead, () => {
		it("works when is valid (has children)", ({ expect }) => {
			const code = `
			<svelte:head>
				<title>Hello world!</title>
				<meta name="description" content="This is where the description goes for SEO" />
			</svelte:head>
		`;
			const node = parse_and_extract<AST.SvelteHead>(code, "SvelteHead");
			expect(printSvelteHead(node).code).toMatchInlineSnapshot(`
			"<svelte:head>
				<title>Hello world!</title>
				<meta name="description" content="This is where the description goes for SEO" />
			</svelte:head>"
		`);
		});
	});

	describe(printSvelteOptions, () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
			<svelte:options
				customElement={{
					tag: 'custom-element',
					shadow: 'none',
					props: {
						name: { reflect: true, type: 'Number', attribute: 'element-index' }
					},
					extend: (customElementConstructor) => {
						// Extend the class so we can let it participate in HTML forms
						return class extends customElementConstructor {
							static formAssociated = true;

							constructor() {
								super();
								this.attachedInternals = this.attachInternals();
							}

							// Add the function here, not below in the component so that
							// it's always available, not just when the inner Svelte component
							// is mounted
							randomIndex() {
								this.elementIndex = Math.random();
							}
						};
					}
				}}
			/>
		`;
			const node = parse_and_extract<AST.Root>(code, "Root");
			expect(node.options).toBeDefined();
			if (node.options) {
				expect(printSvelteOptions(node.options).code).toMatchInlineSnapshot(`
					"<svelte:options customElement={{
							tag: 'custom-element',
							shadow: 'none',
							props: {
								name: {
									reflect: true,
									type: 'Number',
									attribute: 'element-index'
								}
							},
							extend: (customElementConstructor) => {
								// Extend the class so we can let it participate in HTML forms
								return class extends customElementConstructor {
									static formAssociated = true;

									constructor() {
										super();
										this.attachedInternals = this.attachInternals();
									}

									// Add the function here, not below in the component so that
									// it's always available, not just when the inner Svelte component
									// is mounted
									randomIndex() {
										this.elementIndex = Math.random();
									}
								};
							}
						}} />"
				`);
			}
		});
	});

	describe(printSvelteSelf, () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
			{#if count > 0}
				<p>counting down... {count}</p>
				<svelte:self count={count - 1} />
			{:else}
				<p>lift-off!</p>
			{/if}
		`;
			const node = parse_and_extract<AST.SvelteSelf>(code, "SvelteSelf");
			expect(printSvelteSelf(node).code).toMatchInlineSnapshot(`"<svelte:self count={count - 1} />"`);
		});
	});

	describe(printSvelteWindow, () => {
		it("works when is valid (has no children)", ({ expect }) => {
			const code = `
			<script>
				/** @param {KeyboardEvent} event */
				function handleKeydown(event) {
					alert(\`pressed the \${event.key} key\`);
				}
			</script>

			<svelte:window on:keydown={handleKeydown} />
		`;
			const node = parse_and_extract<AST.SvelteWindow>(code, "SvelteWindow");
			expect(printSvelteWindow(node).code).toMatchInlineSnapshot(
				`"<svelte:window on:keydown={handleKeydown} />"`,
			);
		});
	});

	describe(printTitleElement, () => {
		it("works when is valid (has children)", ({ expect }) => {
			const code = `
			<script>
				const reason = "vibes";
			</script>

			<svelte:head>
				<title>Svelte is optimized for {reason}</title>
			</svelte:head>
		`;
			const node = parse_and_extract<AST.TitleElement>(code, "TitleElement");
			expect(printTitleElement(node).code).toMatchInlineSnapshot(
				`"<title>Svelte is optimized for {reason}</title>"`,
			);
		});
	});
});
