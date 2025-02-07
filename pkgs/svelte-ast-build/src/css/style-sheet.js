/**
 * Related to {@link AST.CSS.StyleSheet}.
 * @module
 */

/**
 * @import * as JS from "estree";
 * @import { AST } from "svelte/compiler";
 */

/**
 * Reusable constant for `<style>` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_STYLE_SHEET = "StyleSheet";

/**
 * @param {AST.BaseNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.CSS.StyleSheet}
 * @__NO_SIDE_EFFECTS__
 */
export function isStyleSheet(node) {
	return node.type === TYPE_STYLE_SHEET;
}

/**
 * @typedef {"less" | "postcss" | "pcss" | "sass" | "scss" | "stylus" | "sugarss"} StyleSheetLang List of known CSS languages supported by preprocessors.
 */

/**
 * A snippet to check if the
 * @param {AST.CSS.StyleSheet} node - AST node for `<style>` tag
 * @param {StyleSheetLang & (string & {})} lang - value from the `lang="<value>"` attribute
 * @returns {boolean}
 * @__NO_SIDE_EFFECTS__
 */
export function hasStyleSheetLang(node, lang) {
	/**
	 * @type {AST.Attribute | undefined}
	 * WARN: `node.attributes` is any.
	 * Ref: https://github.com/sveltejs/svelte/blob/c4d4349d0a89c9588e06c8ccc142ef2063582f55/packages/svelte/src/compiler/types/css.d.ts#L11
	 */
	const attr = node.attributes.find((/** @type {AST.Attribute} */ a) => a.name === "lang");
	return Boolean(attr && get_lang_value(attr) === lang);
}

/**
 * @internal
 * @param {AST.Attribute} node
 * @returns {AST.Text['data'] | undefined}
 * @__NO_SIDE_EFFECTS__
 */
function get_lang_value(node) {
	if (!Array.isArray(node.value) || node.value[0].type !== "Text") return;
	return node.value[0].data;
}
