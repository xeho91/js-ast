/**
 * @import { Node as ESTreeNode } from "estree";
 * @import { AST, parse } from "svelte/compiler";
 */

/**
 * @type {Set<AST.AttributeLike['type']>}
 * @internal
 */
const ATTRIBUTE_LIKE_NODE_NAMES = new Set([
	"AnimateDirective",
	"Attribute",
	"BindDirective",
	"ClassDirective",
	"LetDirective",
	"OnDirective",
	"SpreadAttribute",
	"StyleDirective",
	"TransitionDirective",
	"UseDirective",
]);
/**
 * Type check guard to check if provided AST node is {@link AST.AttributeLike}.
 *
 * - Standard attribute _({@link AST.Attribute})_ - {@link https://developer.mozilla.org/en-US/docs/Glossary/Attribute}
 * - Spread attribute _({@link AST.SpreadAttribute})_ - {@link https://svelte.dev/docs/basic-markup#attributes-and-props}
 * - Directive _({@link AST.Directive})_ - can be for:
 *   - component - {@link https://svelte.dev/docs/component-directives}
 *   - element - {@link https://svelte.dev/docs/element-directives}
 *
 * @param {Node} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.AttributeLike}
 * @internal
 */
export const is_attr_like = (node) =>
	ATTRIBUTE_LIKE_NODE_NAMES
		// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
		.has(node.type);

/**
 * @type {Set<AST.Block['type']>}
 * @internal
 */
const BLOCK_NODE_NAMES = new Set([
	//
	"AwaitBlock",
	"EachBlock",
	"IfBlock",
	"KeyBlock",
	"SnippetBlock",
]);
/**
 * Type check guard to check if provided AST node is a logic block {@link Block}.
 *
 * @see {@link https://svelte.dev/docs/logic-blocks}
 *
 * @param {Node} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.Block}
 * @internal
 */
const is_block = (node) =>
	BLOCK_NODE_NAMES
		// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
		.has(node.type);

/**
 * @type {Set<AST.CSS.Node['type']>}
 * @internal
 */
const CSS_AST_NODE_NAMES = new Set([
	"Atrule",
	"AttributeSelector",
	"Block",
	"ClassSelector",
	"Combinator",
	"ComplexSelector",
	"Declaration",
	"IdSelector",
	"NestingSelector",
	"Nth",
	"Percentage",
	"PseudoClassSelector",
	"PseudoElementSelector",
	"RelativeSelector",
	"Rule",
	"SelectorList",
	"StyleSheet",
	"TypeSelector",
]);

/**
 * Type check guard to see if provided AST node is a CSS based {@link AST.CSS.Node}.
 *
 * WARN: Good to know: they're not same _(complaint)_ with `css-tree`!
 *
 * @param {Node} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.CSS.Node}
 * @internal
 */
const is_css = (node) =>
	CSS_AST_NODE_NAMES
		// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
		.has(node.type);

/**
 * @type {Set<AST.ElementLike['type']>}
 * @internal
 */
const ELEMENT_LIKE_NODE_NAMES = new Set([
	"Component",
	"RegularElement",
	"SlotElement",
	"SvelteBody",
	"SvelteBoundary",
	"SvelteComponent",
	"SvelteDocument",
	"SvelteElement",
	"SvelteFragment",
	"SvelteHead",
	"SvelteOptions",
	"SvelteSelf",
	"SvelteWindow",
	"TitleElement",
]);
/**
 * Type check guard to see if provided AST node is "element-like" {@link AST.ElementLike}.
 *
 * Those are:
 *
 * - standard Svelte-based component - {@link AST.Component}
 * - regular element _(HTML based)_ - {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element}
 * - special Svelte elements - {@link https://svelte.dev/docs/special-elements}
 *
 * @param {Node} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.ElementLike}
 * @internal
 */
export const is_element_like = (node) =>
	ELEMENT_LIKE_NODE_NAMES
		// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
		.has(node.type);

/** @typedef {AST.Comment | AST.Text} HTMLNode */

/**
 * @type {Set<HTMLNode['type']>}
 * @internal
 */
const HTML_NODE_NAMES = new Set([
	//
	"Comment",
	"Text",
]);
/**
 * Type check guard to see if provided AST node is standard HTML node {@link HTMLNode}.
 *
 * Those are:
 *
 * - text that is included between HTML tags - {@link AST.Text}
 * - HTML comment - {@link AST.Comment}
 *
 * @param {Node} node
 * @returns {node is HTMLNode}
 * @internal
 */
const is_html = (node) =>
	HTML_NODE_NAMES
		// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
		.has(node.type);

/**
 * @type {Set<AST.Tag['type']>}
 * @internal
 */
const TAG_NODE_NAMES = new Set([
	//
	"ExpressionTag",
	"HtmlTag",
	"ConstTag",
	"DebugTag",
	"RenderTag",
]);
/**
 * Type check guard to see if provided AST node is "tag-like" {@link AST.Tag}.
 *
 * @see {@link https://svelte.dev/docs/special-tags}
 *
 * Not included in the documentation:
 *
 * - expression tag _({@link AST.ExpressionTag})_
 * - render tag _({@link AST.RenderTag})_ - part of Svelte v5
 *
 * @param {Node | AST.SvelteNode} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.Tag}
 * @internal
 */
const is_tag = (node) =>
	TAG_NODE_NAMES
		// @ts-expect-error - WARN: `Set.prototype.has` doesn't allow loose string
		.has(node.type);

/**
 * Type check guard to see if provided AST node is part of node used for templating {@link AST.TemplateNode}.
 *
 * Those are:
 *
 * - root - what you obtain from the results of from using {@link parse}
 * - text that is included between HTML tags - {@link AST.Text}
 * - HTML comment - {@link AST.Comment}
 *
 * @param {Node} node - Supported AST node to narrow down its inferred type
 * @returns {node is AST.TemplateNode}
 * @internal
 */
const is_template = (node) =>
	node.type === "Root" ||
	node.type === "Fragment" ||
	is_attr_like(node) ||
	is_block(node) ||
	is_css(node) ||
	is_element_like(node) ||
	is_html(node) ||
	is_tag(node);

// TODO: Ask Svelte maintainers if `Script` and `SvelteOptions` were omittted from `SvelteNode` intentionally
/**
 * Not all of the nodes are bundled together with {@link AST.SvelteNode}.
 * This type wraps them together as supported ones for printing.
 *
 * @typedef {AST.Script | AST.SvelteOptionsRaw | AST.SvelteNode} SupportedSvelteNode
 * @internal
 */

/**
 * Bundle together Svelte and ESTree specification complaint nodes, so we can support printing both.
 *
 * @typedef {ESTreeNode | SupportedSvelteNode} Node
 * @internal
 */

/**
 * Type check guard to see if provided AST node is unique to Svelte AST only {@link SupportedSvelteNode}.
 *
 * @param {Node} node - ESTree or Svelte AST node
 * @returns {node is SupportedSvelteNode}
 * @internal
 */
export const is_svelte = (node) => node.type === "SvelteOptions" || node.type === "Script" || is_template(node);
