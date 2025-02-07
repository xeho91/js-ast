import { describe, it } from "vitest";

import type { AST } from "svelte/compiler";

import { parse_and_extract } from "../tests/shared.js";

import { isScript, isScriptInstance, isScriptModule } from "./script.js";

describe(isScript.name, () => {
	it("returns true for script node", ({ expect }) => {
		const code = "<script>let x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isScript(node)).toBe(true);
	});

	it("returns false for non-script node", ({ expect }) => {
		const code = "<div>content</div>";
		const node = parse_and_extract<AST.RegularElement>(code, "RegularElement");
		expect(isScript(node)).toBe(false);
	});
});

describe(isScriptInstance.name, () => {
	it("returns true for instance script", ({ expect }) => {
		const code = "<script>let x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isScriptInstance(node)).toBe(true);
	});

	it("returns false for module script", ({ expect }) => {
		const code = "<script module>export let x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isScriptInstance(node)).toBe(false);
	});

	it("returns false for legacy module script", ({ expect }) => {
		const code = '<script context="module">export let x = 1;</script>';
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isScriptInstance(node)).toBe(false);
	});
});

describe(isScriptModule.name, () => {
	it("returns true for module script", ({ expect }) => {
		const code = "<script module>export let x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isScriptModule(node)).toBe(true);
	});

	it("returns true for legacy module script", ({ expect }) => {
		const code = '<script context="module">export let x = 1;</script>';
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isScriptModule(node)).toBe(true);
	});

	it("returns false for instance script", ({ expect }) => {
		const code = "<script>let x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isScriptModule(node)).toBe(false);
	});
});
