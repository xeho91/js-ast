/**
 * Related to {@link AST.Script}.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";

/**
 * Reusable constant for `<script>` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SCRIPT = "Script";
/**
 * @__NO_SIDE_EFFECTS__
 */
export const SCRIPT = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_SCRIPT),
});
/**
 * @__NO_SIDE_EFFECTS__
 */
export function isScript(input: unknown): input is AST.Script {
	return v.is(SCRIPT, input);
}

/**
 * @param input - AST node to narrow down its inferred type
 * @__NO_SIDE_EFFECTS__
 */
export function isInstanceScript(input: unknown): input is Omit<AST.Script, "context"> & { context: "default" } {
	return isScript(input) && input.context === "default";
}

/**
 * @param input - AST node to narrow down its inferred type
 * @__NO_SIDE_EFFECTS__
 */
export function isModuleScript(input: unknown): input is Omit<AST.Script, "context"> & { context: "module" } {
	return isScript(input) && input.context === "module";
}

/**
 * Get the `lang="<value>"` from a `<script>` AST node tag.
 * @__NO_SIDE_EFFECTS__
 */
export function getScriptLang(node: AST.Script): AST.Attribute | undefined {
	/**
	 * WARN: `node.attributes` is any.
	 * Ref: https://github.com/sveltejs/svelte/blob/c4d4349d0a89c9588e06c8ccc142ef2063582f55/packages/svelte/src/compiler/types/css.d.ts#L11
	 */
	return node.attributes.find((a: AST.AttributeLike) => "name" in a && a.name === "lang");
}

export type ScriptLang = "ts" | "typescript";

/**
 * A snippet to check if <style> has a specific `lang="<name>"` attribute.
 * @param node - AST node for `<style>` tag
 * @param lang - value from the `lang="<value>"` attribute
 * @__NO_SIDE_EFFECTS__
 */
export function hasScriptLang(node: AST.Script, lang: ScriptLang & (string & {})): boolean {
	const attr = getScriptLang(node);
	if (!attr) return false;
	if (!Array.isArray(attr.value) || attr.value[0]?.type !== "Text") return false;
	return attr.value[0].data === lang;
}

/**
 * Determine if the `<script>` tag has attribute `lang="ts|typescript"`
 * @param node - `<script>` AST node
 * @__NO_SIDE_EFFECTS__
 */
export function isScriptTypeScript(node: AST.Script): boolean {
	const attr = getScriptLang(node);
	if (!attr) return false;
	if (!Array.isArray(attr.value) || attr.value[0]?.type !== "Text") return false;
	// @ts-expect-error `Set.prototype.has` doesn't accept loose string
	return new Set<ScriptLang>(["ts", "typescript"]).has(attr.value[0].data);
}
