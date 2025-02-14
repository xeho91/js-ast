/**
 * Printers related to Svelte **template**-related AST nodes only.
 * @module svelte-ast-print/template
 */

import { isBlock, isElementLike, isExpressionTag } from "svelte-ast-analyze/template";
import type { AST as SV } from "svelte/compiler";

import * as char from "../_internal/char.js";
import { HTMLClosingTag, HTMLOpeningTag } from "../_internal/html.js";
import { print_js } from "../_internal/js.js";
import type { PrintOptions } from "../_internal/option.js";
import { type Result, State } from "../_internal/shared.js";
import { is_attr_exp_shorthand, print_directive } from "../_internal/template/attribute.js";
import { ClosingBlock, MidBlock, OpeningBlock, get_if_block_alternate } from "../_internal/template/block.js";
import {
	print_maybe_self_closing_el,
	print_non_self_closing_el,
	print_self_closing_el,
} from "../_internal/template/element.js";
import { CurlyBrackets, DoubleQuotes, RoundBrackets } from "../_internal/wrapper.js";
import { printCSSStyleSheet } from "../css/mod.js";
import { printHTMLNode, printText } from "../html/mod.js";
import { printScript } from "../js/mod.js";

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printRoot(n: SV.Root, opts: Partial<PrintOptions> = {}): Result<SV.Root> {
	const st = State.get(n, opts);
	for (const [idx, curr_name] of st.opts.order.entries()) {
		switch (curr_name) {
			case "options": {
				if (n.options) st.add(printSvelteOptions(n.options, opts));
				break;
			}
			case "instance": {
				if (n.instance) st.add(printScript(n.instance, opts));
				break;
			}
			case "module": {
				if (n.module) st.add(printScript(n.module, opts));
				break;
			}
			case "fragment": {
				st.add(printFragment(n.fragment, opts));
				break;
			}
			case "css": {
				if (n.css) st.add(printCSSStyleSheet(n.css, opts));
				break;
			}
		}
		const is_last = st.opts.order.at(-1) === curr_name;
		const prev_name = st.opts.order[idx - 1];
		const next_name = st.opts.order[idx + 1];
		// NOTE: This adds line break (x2) between each part of the root
		if (!is_last && (n[curr_name] || (prev_name && n[prev_name])) && next_name && n[next_name]) {
			st.break();
			st.break();
		}
	}
	return st.result;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printTemplateNode(n: SV.TemplateNode, opts: Partial<PrintOptions> = {}): Result<SV.TemplateNode> {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "Attribute":
		case "SpreadAttribute":
		case "AnimateDirective":
		case "BindDirective":
		case "ClassDirective":
		case "LetDirective":
		case "OnDirective":
		case "StyleDirective":
		case "TransitionDirective":
		case "UseDirective": return printAttributeLike(n, opts);
		case "AwaitBlock":
		case "KeyBlock":
		case "EachBlock":
		case "IfBlock":
		case "SnippetBlock": return printBlock(n, opts);
		case "Component":
		case "RegularElement":
		case "SlotElement":
		case "SvelteBody":
		case "SvelteBoundary":
		case "SvelteComponent":
		case "SvelteDocument":
		case "SvelteElement":
		case "SvelteFragment":
		case "SvelteHead":
		case "SvelteOptions":
		case "SvelteSelf":
		case "SvelteWindow":
		case "TitleElement": return printElementLike(n, opts);
		case "ConstTag":
		case "DebugTag":
		case "ExpressionTag":
		case "HtmlTag":
		case "RenderTag": return printTag(n, opts);
		case "Comment":
		case "Text": return printHTMLNode(n, opts);
		case "Root": return printRoot(n, opts);
	}
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printFragment(n: SV.Fragment, opts: Partial<PrintOptions> = {}): Result<SV.Fragment> {
	const st = State.get(n, opts);
	/** @type {SV.Fragment["nodes"]} */
	const cleaned: SV.Fragment["nodes"] = [];
	for (const ch of n.nodes) {
		if (ch.type === "Text") {
			if (ch.raw === " ") {
				cleaned.push(ch);
				continue;
			}
			if (!(/^(?: {1,}|\t|\n)*$/.test(ch.raw) || /^(?: {2,}|\t|\n)*$/.test(ch.raw))) {
				// biome-ignore format: Prettier
				// prettier-ignore
				ch.raw = ch.raw
					.replace(/^[\n\t]+/, "")
					.replace(/[\n\t]+$/, "");
				cleaned.push(ch);
			}
			continue;
		}
		cleaned.push(ch);
	}
	for (const [idx, ch] of cleaned.entries()) {
		const prev = cleaned[idx - 1];
		if (isBlock(prev) || prev?.type === "Comment" || isElementLike(prev)) {
			st.break();
		}
		// biome-ignore format: Prettier
		// prettier-ignore
		switch (ch.type) {
			case "AwaitBlock":
			case "KeyBlock":
			case "EachBlock":
			case "IfBlock":
			case "SnippetBlock": st.add(printBlock(ch, opts)); break;
			case "Component":
			case "RegularElement":
			case "SlotElement":
			case "SvelteBody":
			case "SvelteBoundary":
			case "SvelteComponent":
			case "SvelteDocument":
			case "SvelteElement":
			case "SvelteFragment":
			case "SvelteHead":
			case "SvelteOptions":
			case "SvelteSelf":
			case "SvelteWindow":
			case "TitleElement": st.add(printElementLike(ch, opts)); break;
			case "ConstTag":
			case "DebugTag":
			case "ExpressionTag":
			case "HtmlTag":
			case "RenderTag": st.add(printTag(ch, opts));break;
			case "Comment":
			case "Text": st.add(printHTMLNode(ch, opts)); break;
		}
	}
	return st.result;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printAttributeLike(n: SV.AttributeLike, opts: Partial<PrintOptions> = {}): Result<SV.AttributeLike> {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch(n.type) {
		case "Attribute": return printAttribute(n, opts);
		case "SpreadAttribute":return printSpreadAttribute(n, opts);
		case "AnimateDirective": return printAnimateDirective(n, opts);
		case "BindDirective": return printBindDirective(n, opts);
		case "ClassDirective": return printClassDirective(n, opts);
		case "LetDirective": return printLetDirective(n, opts);
		case "OnDirective": return printOnDirective(n, opts);
		case "StyleDirective": return printStyleDirective(n, opts);
		case "TransitionDirective": return printTransitionDirective(n, opts);
		case "UseDirective": return printUseDirective(n, opts);
	}
}

/**
 * @see {@link https://svelte.dev/docs/svelte/basic-markup#Element-attributes}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printAttribute(n: SV.Attribute, opts: Partial<PrintOptions> = {}): Result<SV.Attribute> {
	const st = State.get(n, opts);
	if (n.value === true) {
		st.add(n.name);
		return st.result;
	}
	if (isExpressionTag(n.value)) {
		if (is_attr_exp_shorthand(n, n.value.expression)) st.add(printExpressionTag(n.value, opts));
		else st.add(n.name, char.ASSIGN, printExpressionTag(n.value, opts));
		return st.result;
	}
	st.add(n.name, char.ASSIGN);
	const quotes = new DoubleQuotes("inline");
	for (const v of n.value) {
		if (isExpressionTag(v)) quotes.insert(printExpressionTag(v, opts));
		else quotes.insert(printText(v, opts));
	}
	st.add(quotes);
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/basic-markup#Component-props}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSpreadAttribute(
	n: SV.SpreadAttribute,
	opts: Partial<PrintOptions> = {},
): Result<SV.SpreadAttribute> {
	const st = State.get(n, opts);
	st.add(new CurlyBrackets("inline", "...", print_js(n.expression, st.opts)));
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/animate}
 *
 * @example with expression
 * ```svelte
 * animate:name={expression}
 * ```
 *
 * @example shorthand - when variable - expression as identifier - name is same
 * ```svelte
 * animate:name
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printAnimateDirective(
	n: SV.AnimateDirective,
	opts: Partial<PrintOptions> = {},
): Result<SV.AnimateDirective> {
	return print_directive("animate", n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/bind}
 *
 * @example with expression
 * ```svelte
 * bind:name={variable}
 * ```
 *
 * @example shorthand - when variable - expression as identifier - name is same
 * ```svelte
 * bind:name
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printBindDirective(n: SV.BindDirective, opts: Partial<PrintOptions> = {}): Result<SV.BindDirective> {
	return print_directive("bind", n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/class}
 *
 * @example with expression
 * ```svelte
 * class:name={expression}
 * ```
 *
 * @example shorthand - when variable - expression as identifier - name is same
 * ```svelte
 * class:name
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printClassDirective(n: SV.ClassDirective, opts: Partial<PrintOptions> = {}): Result<SV.ClassDirective> {
	return print_directive("class", n, opts);
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-slots#Passing-data-to-slotted-content}
 *
 * @example with expression
 * ```svelte
 * let:name={expression}
 * ```
 *
 * @example shorthand - when variable - expression as identifier - name is same
 * ```svelte
 * let:name
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printLetDirective(n: SV.LetDirective, opts: Partial<PrintOptions> = {}): Result<SV.LetDirective> {
	return print_directive("let", n, opts);
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-on}
 *
 * @example without modifiers
 * ```svelte
 * on:name={expression}
 * ```
 *
 * @example with modifiers
 * ```svelte
 * on:name|modifiers={handler}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printOnDirective(n: SV.OnDirective, opts: Partial<PrintOptions> = {}): Result<SV.OnDirective> {
	return print_directive("on", n, opts);
}

/**
 * @see {@link https://svelte.dev/docs/svelte/style}
 *
 * @example with expression tag
 * ```svelte
 * style:name={value}
 * ```
 *
 * @example with text expression
 * ```svelte
 * style:name="text"
 * ```
 *
 * @example without expression
 * ```svelte
 * style:name
 * ```
 *
 * @example with modifiers
 * ```svelte
 * style:name|modifiers="text"
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printStyleDirective(n: SV.StyleDirective, opts: Partial<PrintOptions> = {}): Result<SV.StyleDirective> {
	const st = State.get(n, opts);
	st.add("style", char.COLON, n.name);
	if (n.modifiers.length > 0) st.add(char.PIPE, n.modifiers.join(char.PIPE));
	if (n.value === true || (isExpressionTag(n.value) && is_attr_exp_shorthand(n, n.value.expression))) {
		return st.result;
	}
	if (isExpressionTag(n.value)) {
		st.add(char.ASSIGN, printExpressionTag(n.value, opts));
		return st.result;
	}
	st.add(char.ASSIGN);
	const quotes = new DoubleQuotes("inline");
	for (const v of n.value) {
		if (isExpressionTag(v)) quotes.insert(printExpressionTag(v, opts));
		else quotes.insert(printText(v, opts));
	}
	st.add(quotes);
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/transition}
 * @see {@link https://svelte.dev/docs/svelte/in-and-out}
 *
 * @example without expression
 * ```svelte
 * transition|in|out:name
 * ```
 *
 * @example with expression
 * ```svelte
 * transition|in|out:name={expression}
 * ```
 *
 * @example with global modifier and without expression
 * ```svelte
 * transition|in|out:name|global
 * ```
 *
 * @example with global modifier and with expression
 * ```svelte
 * transition|in|out:name|global={expression}
 * ```
 *
 * @example with local modifier and without expression
 * ```svelte
 * transition|in|out:name|local
 * ```
 *
 * @example with local modifier and with expression
 * ```svelte
 * transition|in|out:name|local={expression}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printTransitionDirective(
	n: SV.TransitionDirective,
	opts: Partial<PrintOptions> = {},
): Result<SV.TransitionDirective> {
	/** @type {"in" | "out" | "transition"} */
	let name: "in" | "out" | "transition";
	if (n.intro && !n.outro) name = "in";
	else if (!n.intro && n.outro) name = "out";
	else name = "transition";
	return print_directive(name, n, opts);
}

/**
 * @example with expression
 * ```svelte
 * use:name={expression}
 * ```
 *
 * @example shorthand - when variable - expression as identifier - name is same
 * ```svelte
 * use:name
 * ```
 * @see {@link https://svelte.dev/docs/svelte/use}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printUseDirective(n: SV.UseDirective, opts: Partial<PrintOptions> = {}): Result<SV.UseDirective> {
	return print_directive("use", n, opts);
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printBlock(n: SV.Block, opts: Partial<PrintOptions> = {}): Result<SV.Block> {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "AwaitBlock": return printAwaitBlock(n, opts);
		case "EachBlock": return printEachBlock(n, opts);
		case "IfBlock": return printIfBlock(n, opts);
		case "KeyBlock": return printKeyBlock(n, opts);
		case "SnippetBlock": return printSnippetBlock(n, opts);
	}
}

/**
 * @see {@link https://svelte.dev/docs/svelte/await}
 *
 * @example standard
 * ```svelte
 * {#await expression}...{:then name}...{:catch name}...{/await}
 * ```
 *
 * @example without catch
 * ```svelte
 * {#if expression}...{:else if expression}...{/if}
 * ```
 *
 * @example without pending body
 * ```svelte
 * {#await expression then name}...{/await}
 * ```
 *
 * @example with catch body only
 * ```svelte
 * {#await expression catch name}...{/await}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printAwaitBlock(n: SV.AwaitBlock, opts: Partial<PrintOptions> = {}): Result<SV.AwaitBlock> {
	const name = "await";
	const st = State.get(n, opts);
	const opening = new OpeningBlock(
		//
		"inline",
		name,
		char.SPACE,
		print_js(n.expression, st.opts),
	);
	if (n.then && !n.pending) opening.insert(char.SPACE, "then", n.value && [char.SPACE, print_js(n.value, st.opts)]);
	if (n.catch && !n.pending) opening.insert(char.SPACE, "catch", n.error && [char.SPACE, print_js(n.error, st.opts)]);
	st.add(opening);
	if (n.pending) {
		st.break(+1);
		st.add(printFragment(n.pending, opts));
		st.break(-1);
	}
	if (n.then) {
		if (n.value && n.pending) {
			st.add(new MidBlock("inline", "then", n.value && [char.SPACE, print_js(n.value, st.opts)]));
		}
		st.break(+1);
		st.add(printFragment(n.then, opts));
		st.break(-1);
	}
	if (n.catch) {
		if (n.error && n.pending) {
			st.add(new MidBlock("inline", "catch", n.error && [char.SPACE, print_js(n.error, st.opts)]));
		}
		st.break(+1);
		st.add(printFragment(n.catch, opts));
		st.break(-1);
	}
	st.add(new ClosingBlock("inline", name));
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/each}
 *
 * @example simple
 * ```svelte
 * {#each expression as name}...{/each}
 * ```
 *
 * @example without `as` item
 * ```svelte
 * {#each expression}...{/each}
 * ```
 *
 * @example without `as` item, but with index
 * ```svelte
 * {#each expression, index}...{/each}
 * ```
 *
 * @example with index
 * ```svelte
 * {#each expression as name, index}...{/each}
 * ```
 *
 * @example keyed
 * ```svelte
 * {#each expression as name (key)}...{/each}
 * ```
 *
 * @example with index and keyed
 * ```svelte
 * {#each expression as name, index (key)}...{/each}
 * ```
 *
 * @example with else clause for when list is empty
 * ```svelte
 * {#each expression as name}...{:else}...{/each}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printEachBlock(n: SV.EachBlock, opts: Partial<PrintOptions> = {}): Result<SV.EachBlock> {
	const name = "each";
	const st = State.get(n, opts);
	st.add(
		new OpeningBlock(
			//
			"inline",
			name,
			char.SPACE,
			print_js(n.expression, st.opts),
			n.context && [char.SPACE, "as", char.SPACE, print_js(n.context, st.opts)],
			n.index && [char.COMMA, char.SPACE, n.index],
			n.key && [char.SPACE, new RoundBrackets("inline", print_js(n.key, st.opts))],
		),
	);
	st.break(+1);
	st.add(printFragment(n.body, opts));
	st.break(-1);
	if (n.fallback) {
		st.add(new MidBlock("inline", "else"));
		st.break(+1);
		st.add(printFragment(n.fallback, opts));
		st.break(-1);
	}
	st.add(new ClosingBlock("inline", name));
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/if}
 *
 * @example simple
 * ```svelte
 * {#if expression}...{/if}
 * ```
 *
 * @example with else if
 * ```svelte
 * {#if expression}...{:else if expression}...{/if}
 * ```
 *
 * @example with else
 * ```svelte
 * {#if expression}...{:else}...{/if}
 * ```
 *
 * @example with else if and else
 * ```svelte
 * {#if expression}...{:else if expression}...{:else}...{/if}
 * ```
 *
 * @example with multiple else if and else
 * ```svelte
 * {#if expression}...{:else if expression}...{:else if expression}...{:else}...{/if}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printIfBlock(n: SV.IfBlock, opts: Partial<PrintOptions> = {}): Result<SV.IfBlock> {
	const name = "if";
	const st = State.get(n, opts);
	if (!n.elseif) {
		st.add(new OpeningBlock("inline", name, char.SPACE, print_js(n.test, st.opts)));
	} else {
		st.add(new MidBlock("inline", "else if", char.SPACE, print_js(n.test, st.opts)));
	}
	st.break(+1);
	st.add(printFragment(n.consequent, opts));
	st.break(-1);
	const alternate_if_block = get_if_block_alternate(n.alternate);
	if (n.alternate) {
		if (alternate_if_block) st.add(printIfBlock(alternate_if_block, opts));
		else {
			st.add(new MidBlock("inline", "else"));
			st.break(+1);
			st.add(printFragment(n.alternate, opts));
			st.break(-1);
		}
	}
	if (!alternate_if_block) st.add(new ClosingBlock("inline", name));
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/key}
 *
 * @example pattern
 * ```svelte
 * {#key expression}...{/key}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printKeyBlock(n: SV.KeyBlock, opts: Partial<PrintOptions> = {}): Result<SV.KeyBlock> {
	const name = "key";
	const st = State.get(n, opts);
	st.add(new OpeningBlock("inline", name, char.SPACE, print_js(n.expression, st.opts)));
	st.break(+1);
	st.add(printFragment(n.fragment, opts));
	st.break(-1);
	st.add(new ClosingBlock("inline", name));
	return st.result;
}

/**
 *
 * @see {@link https://svelte.dev/docs/svelte/snippet}
 *
 * @example pattern
 * ```svelte
 * {#snippet expression(parameters)}...{/snippet}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSnippetBlock(n: SV.SnippetBlock, opts: Partial<PrintOptions> = {}): Result<SV.SnippetBlock> {
	const name = "snippet";
	const st = State.get(n, opts);
	const opening = new OpeningBlock(
		//
		"inline",
		name,
		char.SPACE,
		print_js(n.expression, st.opts),
	);
	const params_bracket = new RoundBrackets("inline");
	for (const [idx, p] of n.parameters.entries()) {
		if (idx > 0) params_bracket.insert(char.COMMA, char.SPACE);
		params_bracket.insert(print_js(p, st.opts));
	}
	opening.insert(params_bracket);
	st.add(opening);
	st.break(+1);
	st.add(printFragment(n.body, opts));
	st.break(-1);
	st.add(new ClosingBlock("inline", name));
	return st.result;
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printElementLike(n: SV.ElementLike, opts: Partial<PrintOptions> = {}): Result<SV.ElementLike> {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "Component": return printComponent(n, opts);
		case "RegularElement": return printRegularElement(n, opts);
		case "SlotElement": return printSlotElement(n, opts);
		case "SvelteBody": return printSvelteBody(n, opts);
		case "SvelteBoundary":return printSvelteBoundary(n, opts);
		case "SvelteComponent": return printSvelteComponent(n, opts);
		case "SvelteDocument": return printSvelteDocument(n, opts);
		case "SvelteElement": return printSvelteElement(n, opts);
		case "SvelteFragment":return printSvelteFragment(n, opts);
		case "SvelteHead": return printSvelteHead(n, opts);
		case "SvelteOptions": return printSvelteOptions(n, opts);
		case "SvelteSelf": return printSvelteSelf(n, opts);
		case "SvelteWindow": return printSvelteWindow(n, opts);
		case "TitleElement": return printTitleElement(n, opts);
	}
}

/**
 * @see {@link https://svelte.dev/docs/svelte-components}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printComponent(n: SV.Component, opts: Partial<PrintOptions> = {}): Result<SV.Component> {
	return print_maybe_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
		frag_printer: printFragment,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte-components}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printRegularElement(n: SV.RegularElement, opts: Partial<PrintOptions> = {}): Result<SV.RegularElement> {
	return print_maybe_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
		frag_printer: printFragment,
	});
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-slot}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSlotElement(n: SV.SlotElement, opts: Partial<PrintOptions> = {}): Result<SV.SlotElement> {
	return print_maybe_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
		frag_printer: printFragment,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-body}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteBody(n: SV.SvelteBody, opts: Partial<PrintOptions> = {}): Result<SV.SvelteBody> {
	return print_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-boundary}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteBoundary(n: SV.SvelteBoundary, opts: Partial<PrintOptions> = {}): Result<SV.SvelteBoundary> {
	return print_non_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
		frag_printer: printFragment,
	});
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-svelte-component}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteComponent(
	n: SV.SvelteComponent,
	opts: Partial<PrintOptions> = {},
): Result<SV.SvelteComponent> {
	return print_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-document}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteDocument(n: SV.SvelteDocument, opts: Partial<PrintOptions> = {}): Result<SV.SvelteDocument> {
	return print_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-element}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteElement(n: SV.SvelteElement, opts: Partial<PrintOptions> = {}): Result<SV.SvelteElement> {
	const st = State.get(n, opts);
	const opening = new HTMLOpeningTag("inline", n.name);
	n.attributes.unshift({
		type: "Attribute",
		name: "this",
		// @ts-expect-error: We ignore `start` and `end`
		value: {
			type: "ExpressionTag",
			expression: n.tag,
		},
	});
	for (const a of n.attributes) opening.insert(char.SPACE, printAttributeLike(a));
	st.add(opening);
	st.add(printFragment(n.fragment, opts));
	st.add(new HTMLClosingTag("inline", n.name));
	return st.result;
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-svelte-fragment}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteFragment(n: SV.SvelteFragment, opts: Partial<PrintOptions> = {}): Result<SV.SvelteFragment> {
	return print_non_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
		frag_printer: printFragment,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-head}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteHead(n: SV.SvelteHead, opts: Partial<PrintOptions> = {}): Result<SV.SvelteHead> {
	return print_non_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
		frag_printer: printFragment,
	});
}

/**
 * TODO: Get rid of this once Svelte maintainers can provide a better solution
 */
type FixedSvelteOptions = SV.SvelteOptionsRaw &
	Omit<SV.SvelteOptions, "attributes" | "start" | "end"> & {
		attributes: SV.SvelteOptions["attributes"];
		options: SV.SvelteOptions;
	};

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-options}
 *
 * @example
 * ```svelte
 * <svelte:options option={value} />
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 * WARN: This one is different, because it can be extracted only from {@link SV.Root}
 */
export function printSvelteOptions(
	n: SV.SvelteOptions | SV.SvelteOptionsRaw | FixedSvelteOptions,
	opts: Partial<PrintOptions> = {},
): Result<FixedSvelteOptions> {
	// @ts-expect-error
	let { attributes, customElement, options, start, end, ...rest } = n;
	if (!attributes) attributes = options.attributes;
	// @ts-expect-error
	return print_self_closing_el({
		// @ts-expect-error
		n: {
			type: "SvelteOptions",
			name: "svelte:options",
			attributes,
			// @ts-expect-error
			start: start || n.options?.start,
			// @ts-expect-error
			end: end || n.options?.end,
			...rest,
		},
		opts,
		attr_printer: printAttributeLike,
	});
}

/**
 * @deprecacted Will be removed from Svelte `v6` {@link https://svelte.dev/docs/svelte/legacy-svelte-self}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteSelf(n: SV.SvelteSelf, opts: Partial<PrintOptions> = {}): Result<SV.SvelteSelf> {
	return print_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-window}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteWindow(n: SV.SvelteWindow, opts: Partial<PrintOptions> = {}): Result<SV.SvelteWindow> {
	return print_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
	});
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title}
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printTitleElement(n: SV.TitleElement, opts: Partial<PrintOptions> = {}): Result<SV.TitleElement> {
	return print_non_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
		frag_printer: printFragment,
	});
}

/**
 * @__NO_SIDE_EFFECTS__
 */
export function printTag(n: SV.Tag, opts: Partial<PrintOptions> = {}): Result<SV.Tag> {
	// biome-ignore format: Prettier
	// prettier-ignore
	switch (n.type) {
		case "ConstTag": return printConstTag(n, opts);
		case "DebugTag": return printDebugTag(n, opts);
		case "ExpressionTag": return printExpressionTag(n, opts);
		case "HtmlTag": return printHtmlTag(n, opts);
		case "RenderTag": return printRenderTag(n, opts);
	}
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@const}
 *
 * @example pattern
 * ```svelte
 * {@const assignment}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printConstTag(n: SV.ConstTag, opts: Partial<PrintOptions> = {}): Result<SV.ConstTag> {
	const st = State.get(n, opts);
	st.add(
		new CurlyBrackets(
			"inline",
			char.AT,
			// NOTE: This is an unique case, because we need to remove a semicolon at the end.
			print_js(n.declaration, st.opts).slice(0, -1),
		),
	);
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@debug}
 *
 * @example pattern
 * ```svelte
 * {@debug identifiers}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printDebugTag(n: SV.DebugTag, opts: Partial<PrintOptions> = {}): Result<SV.DebugTag> {
	const st = State.get(n, opts);
	const brackets = new CurlyBrackets("inline", char.AT, "debug", char.SPACE);
	for (const [idx, i] of n.identifiers.entries()) {
		if (idx > 0) brackets.insert(char.COMMA, char.SPACE);
		brackets.insert(print_js(i, st.opts));
	}
	st.add(brackets);
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/basic-markup#Text-expressions}
 *
 * @example pattern
 * ```svelte
 * {expression}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printExpressionTag(n: SV.ExpressionTag, opts: Partial<PrintOptions> = {}): Result<SV.ExpressionTag> {
	const st = State.get(n, opts);
	st.add(new CurlyBrackets("inline", print_js(n.expression, st.opts)));
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@html}
 *
 * @example pattern
 * ```svelte
 * {@html expression}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printHtmlTag(n: SV.HtmlTag, opts: Partial<PrintOptions> = {}): Result<SV.HtmlTag> {
	const st = State.get(n, opts);
	st.add(
		new CurlyBrackets(
			//
			"inline",
			char.AT,
			"html",
			char.SPACE,
			print_js(n.expression, st.opts),
		),
	);
	return st.result;
}

/**
 * @see {@link https://svelte.dev/docs/svelte/@render}
 *
 * @example pattern
 * ```svelte
 * {@render expression}
 * ```
 *
 * @__NO_SIDE_EFFECTS__
 */
export function printRenderTag(n: SV.RenderTag, opts: Partial<PrintOptions> = {}): Result<SV.RenderTag> {
	const st = State.get(n, opts);
	st.add(
		new CurlyBrackets(
			//
			"inline",
			char.AT,
			"render",
			char.SPACE,
			print_js(n.expression, st.opts),
		),
	);
	return st.result;
}
