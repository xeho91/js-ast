import { parse_and_extract } from "@internals/test/svelte";
import type { AST } from "svelte/compiler";
import { describe, it } from "vitest";

import { isInstanceScript, isModuleScript, isScript, isScriptTypeScript } from "./mod.ts";

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

describe(isInstanceScript.name, () => {
	it("returns true for instance script", ({ expect }) => {
		const code = "<script>let x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isInstanceScript(node)).toBe(true);
	});

	it("returns false for module script", ({ expect }) => {
		const code = "<script module>export let x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isInstanceScript(node)).toBe(false);
	});

	it("returns false for legacy module script", ({ expect }) => {
		const code = '<script context="module">export let x = 1;</script>';
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isInstanceScript(node)).toBe(false);
	});
});

describe(isModuleScript.name, () => {
	it("returns true for module script", ({ expect }) => {
		const code = "<script module>export let x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isModuleScript(node)).toBe(true);
	});

	it("returns true for legacy module script", ({ expect }) => {
		const code = '<script context="module">export let x = 1;</script>';
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isModuleScript(node)).toBe(true);
	});

	it("returns false for instance script", ({ expect }) => {
		const code = "<script>let x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isModuleScript(node)).toBe(false);
	});
});

describe(isScriptTypeScript.name, () => {
	it('returns true script with `lang="ts"`', ({ expect }) => {
		const code = `
<script lang="ts">
	let x: number;
	let y: number;
</script>
		`;
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isScriptTypeScript(node)).toBe(true);
	});

	it('returns true script with `lang="typescript"`', ({ expect }) => {
		const code = `
<script lang="ts">
	let a: boolean;
	let b: boolean;
</script>
		`;
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isScriptTypeScript(node)).toBe(true);
	});

	it("returns false for script without `lang` attribute", ({ expect }) => {
		const code = "<script>let x = 1;</script>";
		const node = parse_and_extract<AST.Script>(code, "Script");
		expect(isScriptTypeScript(node)).toBe(false);
	});
});
