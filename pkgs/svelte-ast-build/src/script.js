/**
 * Related to {@link AST.Script}.
 * @module
 */

import { is_base_node } from "./_shared";

/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * Reusable constant for `<script>` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SCRIPT = "Script";
/**
 * @param {unknown} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.Script}
 * @__NO_SIDE_EFFECTS__
 */
export function isScript(node) {
	return is_base_node(node) && node.type === TYPE_SCRIPT;
}

/**
 * @param {unknown} node - Supported AST node to narrow down its inferred type
 * @returns {node is Omit<AST.Script, "context"> & { context: "default" }}
 * @__NO_SIDE_EFFECTS__
 */
export function isInstanceScript(node) {
	return isScript(node) && node.context === "default";
}

/**
 * @param {unknown} node - Supported AST node to narrow down its inferred type
 * @returns {node is Omit<AST.Script, "context"> & { context: "module" }}
 * @__NO_SIDE_EFFECTS__
 */
export function isModuleScript(node) {
	return isScript(node) && node.context === "module";
}

/**
 * Determine if the `<script>` tag has attribute `lang="ts|typescript"`
 * @param {AST.Script} node - `<script>` AST node
 * @returns {boolean}
 * @__NO_SIDE_EFFECTS__
 */
export function isScriptTS(node) {
	return node.attributes.some((a) => {
		if (a.name !== "lang") return;
		if (a.value === true || !Array.isArray(a.value) || a.value[0].type !== "Text") return;
		return new Set(["ts", "typescript"]).has(a.value[0].data);
	});
}
