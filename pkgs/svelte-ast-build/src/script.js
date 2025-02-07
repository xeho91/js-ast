/**
 * Related to {@link AST.Script}.
 * @module
 */

/**
 * @import { AST } from "svelte/compiler";
 */

/**
 * Reusable constant for `<script>` AST node type.
 * @__NO_SIDE_EFFECTS__
 */
export const TYPE_SCRIPT = "Script";
/**
 * @param {AST.BaseNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.Script}
 * @__NO_SIDE_EFFECTS__
 */
export function isScript(node) {
	return node.type === TYPE_SCRIPT;
}

/**
 * @param {AST.BaseNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is Omit<AST.Script, "context"> & { context: "default" }}
 * @__NO_SIDE_EFFECTS__
 */
export function isScriptInstance(node) {
	return isScript(node) && node.context === "default";
}

/**
 * @param {AST.BaseNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is Omit<AST.Script, "context"> & { context: "module" }}
 * @__NO_SIDE_EFFECTS__
 */
export function isScriptModule(node) {
	return isScript(node) && node.context === "module";
}
