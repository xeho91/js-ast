import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../../tests/shared.ts";

import { isElementLike } from "./element.ts";

describe(isElementLike.name, () => {
	it("returns true for regular HTML element", ({ expect }) => {
		const code = "<div></div>";
		const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
		expect(isElementLike(node)).toBe(true);
	});

	it("returns true for Svelte component", ({ expect }) => {
		const code = "<Component></Component>";
		const node = parse_and_extract<AST.Component>(code, "Component");
		expect(isElementLike(node)).toBe(true);
	});

	it("returns true for slot element", ({ expect }) => {
		const code = "<slot></slot>";
		const node = parse_and_extract<AST.SlotElement>(code, "SlotElement");
		expect(isElementLike(node)).toBe(true);
	});

	it("returns false for non-element node", ({ expect }) => {
		const code = "{#if true}content{/if}";
		const node = parse_and_extract<AST.IfBlock>(code, "IfBlock");
		expect(isElementLike(node)).toBe(false);
	});
});
