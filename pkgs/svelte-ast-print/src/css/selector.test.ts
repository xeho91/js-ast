import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../../tests/shared.ts";

import {
	printCSSAttributeSelector,
	printCSSClassSelector,
	printCSSComplexSelector,
	printCSSIdSelector,
	printCSSNestingSelector,
	printCSSNth,
	printCSSPercentage,
	printCSSPseudoClassSelector,
	printCSSPseudoElementSelector,
	printCSSRelativeSelector,
	printCSSSelectorList,
	printCSSTypeSelector,
} from "./mod.js";

describe(printCSSAttributeSelector.name, () => {
	it("prints correctly without value", ({ expect }) => {
		const code = `
			<style>
				button[disabled] {
					/**/
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.AttributeSelector>(code, "AttributeSelector");
		expect(printCSSAttributeSelector(node).toString()).toMatchInlineSnapshot(`"[disabled]"`);
	});

	it("prints correctly with value", ({ expect }) => {
		const code = `
			<style>
				button[aria-disabled="true"] {
					/**/
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.AttributeSelector>(code, "AttributeSelector");
		expect(printCSSAttributeSelector(node).toString()).toMatchInlineSnapshot(`"[aria-disabled="true"]"`);
	});

	it("prints correctly with value and flags", ({ expect }) => {
		const code = `
			<style>
				div[aria-disabled="false" s] {
					/**/
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.AttributeSelector>(code, "AttributeSelector");
		expect(printCSSAttributeSelector(node).toString()).toMatchInlineSnapshot(`"[aria-disabled="false" s]"`);
	});
});

describe(printCSSClassSelector.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				.button {
					cursor: pointer;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.ClassSelector>(code, "ClassSelector");
		expect(printCSSClassSelector(node).toString()).toMatchInlineSnapshot(`".button"`);
	});
});

describe(printCSSComplexSelector.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				:global(div.modal#overlay) {
					opacity: 0;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.ComplexSelector>(code, "ComplexSelector");
		expect(printCSSComplexSelector(node).toString()).toMatchInlineSnapshot(`":global(div.modal#overlay)"`);
	});
});

describe(printCSSIdSelector.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				#app {
					max-width: 100lvh;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.IdSelector>(code, "IdSelector");
		expect(printCSSIdSelector(node).toString()).toMatchInlineSnapshot(`"#app"`);
	});
});

describe(printCSSNestingSelector.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p {
					& span {
						color: orange;
					}
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.NestingSelector>(code, "NestingSelector");
		expect(printCSSNestingSelector(node).toString()).toMatchInlineSnapshot(`"&"`);
	});
});

describe(printCSSNth.name, () => {
	it("prints correctly simple number", ({ expect }) => {
		const code = `
			<style>
				p:nth-child(1) {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.Nth>(code, "Nth");
		expect(printCSSNth(node).toString()).toMatchInlineSnapshot(`":nth-child(1)"`);
	});

	it("prints correctly text value", ({ expect }) => {
		const code = `
			<style>
				p:nth-child(odd) {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.Nth>(code, "Nth");
		expect(printCSSNth(node).toString()).toMatchInlineSnapshot(`":nth-child(odd)"`);
	});

	it("prints correctly math-like value", ({ expect }) => {
		const code = `
			<style>
				p:nth-child(-1n + 5) {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.Nth>(code, "Nth");
		expect(printCSSNth(node).toString()).toMatchInlineSnapshot(`":nth-child(-1n + 5)"`);
	});

	// FIXME: This is a bug in Svelte, because parser treats it as class selector(?)
	it.fails("prints correctly advanced value", ({ expect }) => {
		const code = `
			<style>
				p:nth-child(even of .noted) {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.Nth>(code, "Nth");
		expect(printCSSNth(node).toString()).toMatchInlineSnapshot(`":nth-child(even of .noted)"`);
	});
});

describe(printCSSPercentage.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				@keyframes fadeIn {
					50% {
						opacity: 0;
					}
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.Percentage>(code, "Percentage");
		expect(printCSSPercentage(node).toString()).toMatchInlineSnapshot(`"50%"`);
	});
});

describe(printCSSPseudoClassSelector.name, () => {
	it("prints correctly without args", ({ expect }) => {
		const code = `
			<style>
				p:hover {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.PseudoClassSelector>(code, "PseudoClassSelector");
		expect(printCSSPseudoClassSelector(node).toString()).toMatchInlineSnapshot(`":hover"`);
	});

	it("prints correctly with args", ({ expect }) => {
		const code = `
			<style>
				p:not(.error) {
					color: blue;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.PseudoClassSelector>(code, "PseudoClassSelector");
		expect(printCSSPseudoClassSelector(node).toString()).toMatchInlineSnapshot(`":not(.error)"`);
	});
});

describe(printCSSPseudoElementSelector.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p::before {
					content: "NOTE: ";
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.PseudoElementSelector>(code, "PseudoElementSelector");
		expect(printCSSPseudoElementSelector(node).toString()).toMatchInlineSnapshot(`"::before"`);
	});
});

describe(printCSSRelativeSelector.name, () => {
	it("prints correctly without combinator", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.RelativeSelector>(code, "RelativeSelector");
		expect(printCSSRelativeSelector(node).toString()).toMatchInlineSnapshot(`"p"`);
	});

	it("prints correctly with combinators", ({ expect }) => {
		const code = `
			<style>
				p ~ .error + * {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.RelativeSelector>(code, "RelativeSelector");
		expect(printCSSRelativeSelector(node).toString()).toMatchInlineSnapshot(`"p"`);
	});
});

describe(printCSSTypeSelector.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.TypeSelector>(code, "TypeSelector");
		expect(printCSSTypeSelector(node).toString()).toMatchInlineSnapshot(`"p"`);
	});
});

describe(printCSSSelectorList.name, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p ~ .error + * {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.SelectorList>(code, "SelectorList");
		expect(printCSSSelectorList(node).toString()).toMatchInlineSnapshot(`"p ~ .error + *"`);
	});
});
