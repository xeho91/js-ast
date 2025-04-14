/**
 * Related to {@link AST.CSS.StyleSheet}.
 * @module
 */

import type { AST } from "svelte/compiler";
import * as v from "valibot";

import { BASE_NODE } from "../base.ts";

/**
 * Reusable constant for `<style>` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_CSS_STYLE_SHEET = "StyleSheet";
/**
 * @__NO_SIDE_EFFECTS__
 */
export const CSS_STYLE_SHEET = v.object({
	...v.omit(BASE_NODE, ["type"]).entries,
	type: v.literal(TYPE_CSS_STYLE_SHEET),
});
/**
 * @param input - Supported AST node to narrow down its inferred type
 * @__NO_SIDE_EFFECTS__
 */
export function isCSSStyleSheet(input: unknown): input is AST.CSS.StyleSheet {
	return v.is(CSS_STYLE_SHEET, input);
}

/**
 * List of known CSS languages supported by preprocessors.
 */
export type CSSStyleSheetLang = "less" | "postcss" | "pcss" | "sass" | "scss" | "stylus" | "sugarss";

/**
 * Get the `lang="<value>"` from a `<style>` AST node tag.
 * @__NO_SIDE_EFFECTS__
 */
export function getCSSStyleSheetLang(node: AST.CSS.StyleSheet): AST.Attribute | undefined {
	/**
	 * WARN: `node.attributes` is any.
	 * Ref: https://github.com/sveltejs/svelte/blob/c4d4349d0a89c9588e06c8ccc142ef2063582f55/packages/svelte/src/compiler/types/css.d.ts#L11
	 */
	return node.attributes.find((a: AST.AttributeLike) => "name" in a && a.name === "lang");
}

/**
 * A snippet to check if <style> has a specific `lang="<name>"` attribute.
 * @param node - AST node for `<style>` tag
 * @param lang - value from the `lang="<value>"` attribute
 * @__NO_SIDE_EFFECTS__
 */
export function hasCSSStyleSheetLang(node: AST.CSS.StyleSheet, lang: CSSStyleSheetLang & (string & {})): boolean {
	const attr = getCSSStyleSheetLang(node);
	if (!attr) return false;
	if (!Array.isArray(attr.value) || attr.value[0]?.type !== "Text") return false;
	return attr.value[0].data === lang;
}
