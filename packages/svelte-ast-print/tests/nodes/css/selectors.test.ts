import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { parse_and_extract } from "../../shared.ts";

import { print } from "svelte-ast-print";

describe("Css.AttributeSelector", () => {
	it("print correctly without value", ({ expect }) => {
		const code = `
			<style>
				button[disabled] {
					/**/
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.AttributeSelector>(code, "AttributeSelector");
		expect(print(node)).toMatchInlineSnapshot(`"[disabled]"`);
	});

	it("print correctly with value", ({ expect }) => {
		const code = `
			<style>
				button[aria-disabled="true"] {
					/**/
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.AttributeSelector>(code, "AttributeSelector");
		expect(print(node)).toMatchInlineSnapshot(`"[aria-disabled="true"]"`);
	});

	it("print correctly with value and flags", ({ expect }) => {
		const code = `
			<style>
				div[aria-disabled="false" s] {
					/**/
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.AttributeSelector>(code, "AttributeSelector");
		expect(print(node)).toMatchInlineSnapshot(`"[aria-disabled="false" s]"`);
	});
});

describe("AST.CSS.ClassSelector", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				.button {
					cursor: pointer;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.ClassSelector>(code, "ClassSelector");
		expect(print(node)).toMatchInlineSnapshot(`".button"`);
	});
});

describe("AST.CSS.ComplexSelector", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				:global(div.modal#overlay) {
					opacity: 0;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.ComplexSelector>(code, "ComplexSelector");
		expect(print(node)).toMatchInlineSnapshot(`":global(div.modal#overlay)"`);
	});
});

describe("AST.CSS.IdSelector", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				#app {
					max-width: 100lvh;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.IdSelector>(code, "IdSelector");
		expect(print(node)).toMatchInlineSnapshot(`"#app"`);
	});
});

describe("AST.CSS.NestingSelector", () => {
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
		expect(print(node)).toMatchInlineSnapshot(`"&"`);
	});
});

describe("AST.CSS.Nth", () => {
	it("prints correctly simple number", ({ expect }) => {
		const code = `
			<style>
				p:nth-child(1) {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.Nth>(code, "Nth");
		expect(print(node)).toMatchInlineSnapshot(`":nth-child(1)"`);
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
		expect(print(node)).toMatchInlineSnapshot(`":nth-child(odd)"`);
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
		expect(print(node)).toMatchInlineSnapshot(`":nth-child(-1n + 5)"`);
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
		expect(print(node)).toMatchInlineSnapshot(`":nth-child(even of .noted)"`);
	});
});

describe("AST.CSS.Percentage", () => {
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
		expect(print(node)).toMatchInlineSnapshot(`"50%"`);
	});
});

describe("AST.CSS.PseudoClassSelector", () => {
	it("prints correctly without args", ({ expect }) => {
		const code = `
			<style>
				p:hover {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.PseudoClassSelector>(code, "PseudoClassSelector");
		expect(print(node)).toMatchInlineSnapshot(`":hover"`);
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
		expect(print(node)).toMatchInlineSnapshot(`":not(.error)"`);
	});
});

describe("AST.CSS.PseudoElementSelector", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p::before {
					content: "NOTE: ";
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.PseudoElementSelector>(code, "PseudoElementSelector");
		expect(print(node)).toMatchInlineSnapshot(`"::before"`);
	});
});

describe("AST.CSS.RelativeSelector", () => {
	it("prints correctly without combinator", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.RelativeSelector>(code, "RelativeSelector");
		expect(print(node)).toMatchInlineSnapshot(`"p"`);
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
		expect(print(node)).toMatchInlineSnapshot(`"p"`);
	});
});

describe("AST.CSS.SelectorList", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p ~ .error + * {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.SelectorList>(code, "SelectorList");
		expect(print(node)).toMatchInlineSnapshot(`"p ~.error +*"`);
	});
});

describe("AST.CSS.TypeSelector", () => {
	it("prints correctly", ({ expect }) => {
		const code = `
			<style>
				p {
					color: red;
				}
			</style>
		`;
		const node = parse_and_extract<AST.CSS.TypeSelector>(code, "TypeSelector");
		expect(print(node)).toMatchInlineSnapshot(`"p"`);
	});
});
