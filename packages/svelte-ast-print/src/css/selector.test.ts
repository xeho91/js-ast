import { parse_and_extract } from "@internals/test/svelte";
import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

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
	printCSSSimpleSelector,
	printCSSTypeSelector,
} from "./selector.ts";

describe(printCSSSimpleSelector, () => {
	describe(printCSSAttributeSelector, () => {
		it("prints correctly without value", ({ expect }) => {
			const code = `
			<style>
				button[disabled] {
					/**/
				}
			</style>
		`;
			const node = parse_and_extract<AST.CSS.AttributeSelector>(code, "AttributeSelector");
			expect(printCSSAttributeSelector(node).code).toMatchInlineSnapshot(`"[disabled]"`);
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
			expect(printCSSAttributeSelector(node).code).toMatchInlineSnapshot(`"[aria-disabled="true"]"`);
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
			expect(printCSSAttributeSelector(node).code).toMatchInlineSnapshot(`"[aria-disabled="false" s]"`);
		});
	});

	describe(printCSSClassSelector, () => {
		it("prints correctly", ({ expect }) => {
			const code = `
			<style>
				.button {
					cursor: pointer;
				}
			</style>
		`;
			const node = parse_and_extract<AST.CSS.ClassSelector>(code, "ClassSelector");
			expect(printCSSClassSelector(node).code).toMatchInlineSnapshot(`".button"`);
		});
	});

	describe(printCSSIdSelector, () => {
		it("prints correctly", ({ expect }) => {
			const code = `
			<style>
				#app {
					max-width: 100lvh;
				}
			</style>
		`;
			const node = parse_and_extract<AST.CSS.IdSelector>(code, "IdSelector");
			expect(printCSSIdSelector(node).code).toMatchInlineSnapshot(`"#app"`);
		});
	});

	describe(printCSSNestingSelector, () => {
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
			expect(printCSSNestingSelector(node).code).toMatchInlineSnapshot(`"&"`);
		});
	});

	describe(printCSSPseudoClassSelector, () => {
		it("prints correctly without args", ({ expect }) => {
			const code = `
			<style>
				p:hover {
					color: red;
				}
			</style>
		`;
			const node = parse_and_extract<AST.CSS.PseudoClassSelector>(code, "PseudoClassSelector");
			expect(printCSSPseudoClassSelector(node).code).toMatchInlineSnapshot(`":hover"`);
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
			expect(printCSSPseudoClassSelector(node).code).toMatchInlineSnapshot(`":not(.error)"`);
		});
	});

	describe(printCSSPseudoElementSelector, () => {
		it("prints correctly", ({ expect }) => {
			const code = `
			<style>
				p::before {
					content: "NOTE: ";
				}
			</style>
		`;
			const node = parse_and_extract<AST.CSS.PseudoElementSelector>(code, "PseudoElementSelector");
			expect(printCSSPseudoElementSelector(node).code).toMatchInlineSnapshot(`"::before"`);
		});
	});

	describe(printCSSTypeSelector, () => {
		it("prints correctly", ({ expect }) => {
			const code = `
			<style>
				p {
					color: red;
				}
			</style>
		`;
			const node = parse_and_extract<AST.CSS.TypeSelector>(code, "TypeSelector");
			expect(printCSSTypeSelector(node).code).toMatchInlineSnapshot(`"p"`);
		});
	});

	describe(printCSSNth, () => {
		it("prints correctly simple number", ({ expect }) => {
			const code = `
			<style>
				p:nth-child(1) {
					color: red;
				}
			</style>
		`;
			const node = parse_and_extract<AST.CSS.Nth>(code, "Nth");
			expect(printCSSNth(node).code).toMatchInlineSnapshot(`":nth-child(1)"`);
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
			expect(printCSSNth(node).code).toMatchInlineSnapshot(`":nth-child(odd)"`);
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
			expect(printCSSNth(node).code).toMatchInlineSnapshot(`":nth-child(-1n + 5)"`);
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
			expect(printCSSNth(node).code).toMatchInlineSnapshot(`":nth-child(even of .noted)"`);
		});
	});

	describe(printCSSPercentage, () => {
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
			expect(printCSSPercentage(node).code).toMatchInlineSnapshot(`"50%"`);
		});
	});
});

describe(printCSSRelativeSelector, () => {
	it("prints correctly without combinator", ({ expect }) => {
		const code = `
			<style>
				> p {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.RelativeSelector>(code, "RelativeSelector");
		expect(printCSSRelativeSelector(node).code).toMatchInlineSnapshot(`"> p"`);
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
		expect(printCSSRelativeSelector(node).code).toMatchInlineSnapshot(`"p"`);
	});
});

describe(printCSSComplexSelector, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				:global(div.modal#overlay) {
					opacity: 0;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.ComplexSelector>(code, "ComplexSelector");
		expect(printCSSComplexSelector(node).code).toMatchInlineSnapshot(`":global(div.modal#overlay)"`);
	});
});

describe(printCSSSelectorList, () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p ~ .error + * {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.SelectorList>(code, "SelectorList");
		expect(printCSSSelectorList(node).code).toMatchInlineSnapshot(`"p ~ .error + *"`);
	});
});
