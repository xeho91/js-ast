/**
 * @import { AST as SV } from "svelte/compiler";
 *
 * @import { Result } from "../_internal/shared.js";
 * @import { PrintOptions } from "../_internal/option.js";
 */

/**
 * Printers related to Svelte **template**-related AST nodes only.
 * @module svelte-ast-print/template
 */

import { isBlock, isElementLike, isExpressionTag } from "svelte-ast-build";

import * as char from "../_internal/char.js";
import { HTMLClosingTag, HTMLOpeningTag } from "../_internal/html.js";
import { print_js } from "../_internal/js.js";
import { State } from "../_internal/shared.js";
import { is_attr_exp_shorthand, print_directive } from "../_internal/template/attribute.js";
import { ClosingBlock, MidBlock, OpeningBlock, get_if_block_alternate } from "../_internal/template/block.js";
import {
	print_maybe_self_closing_el,
	print_non_self_closing_el,
	print_self_closing_el,
} from "../_internal/template/element.js";
import { CurlyBrackets, DoubleQuotes, RoundBrackets } from "../_internal/wrapper.js";
import { printCSSStyleSheet } from "../css/mod.js";
import { printHTML, printText } from "../html/mod.js";
import { printScript } from "../js/mod.js";

/**
 * @param {SV.Root} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Root>}
 * @__NO_SIDE_EFFECTS__
 */
export function printRoot(n, opts = {}) {
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
		if (!is_last && (n[curr_name] || n[prev_name]) && n[next_name]) {
			st.break();
			st.break();
		}
	}
	return st.result;
}

/**
 * @param {SV.TemplateNode} n
 * @param {Partial<PrintOptions>} [opts]
 * @returns {Result<SV.TemplateNode>}
 * @__NO_SIDE_EFFECTS__
 */
export function printTemplate(n, opts = {}) {
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
		case "Text": return printHTML(n, opts);
		case "Root": return printRoot(n, opts);
	}
}

/**
 * @param {SV.Fragment} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Fragment>}
 * @__NO_SIDE_EFFECTS__
 */
export function printFragment(n, opts = {}) {
	const st = State.get(n, opts);
	/** @type {SV.Fragment["nodes"]} */
	const cleaned = [];
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
	// console.log({ cleaned });
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
			case "Text": st.add(printHTML(ch, opts)); break;
		}
	}
	return st.result;
}

/**
 * @param {SV.AttributeLike} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.AttributeLike>}
 * @__NO_SIDE_EFFECTS__
 */
export function printAttributeLike(n, opts = {}) {
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
 * @param {SV.Attribute} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Attribute>}
 * @__NO_SIDE_EFFECTS__
 */
export function printAttribute(n, opts = {}) {
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
 * @param {SV.SpreadAttribute} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SpreadAttribute>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSpreadAttribute(n, opts = {}) {
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
 * @param {SV.AnimateDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.AnimateDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printAnimateDirective(n, opts = {}) {
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
 * @param {SV.BindDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.BindDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printBindDirective(n, opts = {}) {
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
 * @param {SV.ClassDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.ClassDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printClassDirective(n, opts = {}) {
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
 * @param {SV.LetDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.LetDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printLetDirective(n, opts = {}) {
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
 * @param {SV.OnDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.OnDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printOnDirective(n, opts = {}) {
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
 * @param {SV.StyleDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.StyleDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printStyleDirective(n, opts = {}) {
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
 * @param {SV.TransitionDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.TransitionDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printTransitionDirective(n, opts = {}) {
	/** @type {"in" | "out" | "transition"} */
	let name;
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
 * @param {SV.UseDirective} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.UseDirective>}
 * @__NO_SIDE_EFFECTS__
 */
export function printUseDirective(n, opts = {}) {
	return print_directive("use", n, opts);
}

/**
 * @param {SV.Block} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Block>}
 * @__NO_SIDE_EFFECTS__
 */
export function printBlock(n, opts = {}) {
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
 * @param {SV.AwaitBlock} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.AwaitBlock>}
 * @__NO_SIDE_EFFECTS__
 */
export function printAwaitBlock(n, opts = {}) {
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
 * @param {SV.EachBlock} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.EachBlock>}
 * @__NO_SIDE_EFFECTS__
 */
export function printEachBlock(n, opts = {}) {
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
 * @param {SV.IfBlock} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.IfBlock>}
 * @__NO_SIDE_EFFECTS__
 */
export function printIfBlock(n, opts = {}) {
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
 * @param {SV.KeyBlock} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.KeyBlock>}
 * @__NO_SIDE_EFFECTS__
 */
export function printKeyBlock(n, opts = {}) {
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
 * @param {SV.SnippetBlock} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SnippetBlock>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSnippetBlock(n, opts = {}) {
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
 * @param {SV.ElementLike} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.ElementLike>}
 * @__NO_SIDE_EFFECTS__
 */
export function printElementLike(n, opts = {}) {
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
 * @param {SV.Component} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Component>}
 * @__NO_SIDE_EFFECTS__
 */
export function printComponent(n, opts = {}) {
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
 * @param {SV.RegularElement} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.RegularElement>}
 * @__NO_SIDE_EFFECTS__
 */
export function printRegularElement(n, opts = {}) {
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
 * @param {SV.SlotElement} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SlotElement>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSlotElement(n, opts = {}) {
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
 * @param {SV.SvelteBody} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteBody>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteBody(n, opts = {}) {
	return print_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-boundary}
 *
 * @param {SV.SvelteBoundary} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteBoundary>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteBoundary(n, opts = {}) {
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
 * @param {SV.SvelteComponent} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteComponent>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteComponent(n, opts = {}) {
	return print_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-document}
 *
 * @param {SV.SvelteDocument} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteDocument>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteDocument(n, opts = {}) {
	return print_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-element}
 *
 * @param {SV.SvelteElement} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteElement>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteElement(n, opts = {}) {
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
 * @param {SV.SvelteFragment} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteFragment>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteFragment(n, opts = {}) {
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
 * @param {SV.SvelteHead} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteHead>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteHead(n, opts = {}) {
	return print_non_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
		frag_printer: printFragment,
	});
}

/**
 * @typedef {SV.SvelteOptionsRaw & Omit<SV.SvelteOptions, "attributes" | "start" | "end"> & { attributes: SV.SvelteOptions["attributes"], options: SV.SvelteOptions }} FixedSvelteOptions
 * TODO: Get rid of this once Svelte maintainers can provide a better solution
 */

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-options}
 *
 * @example
 * ```svelte
 * <svelte:options option={value} />
 * ```
 *
 * WARN: This one is different, because it can be extracted only from {@link SV.Root}
 *
 * @param {SV.SvelteOptions | SV.SvelteOptionsRaw | FixedSvelteOptions} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<FixedSvelteOptions>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteOptions(n, opts = {}) {
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
 * @param {SV.SvelteSelf} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteSelf>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteSelf(n, opts = {}) {
	return print_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
	});
}

/**
 * @see {@link https://svelte.dev/docs/svelte/svelte-window}
 *
 * @param {SV.SvelteWindow} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.SvelteWindow>}
 * @__NO_SIDE_EFFECTS__
 */
export function printSvelteWindow(n, opts = {}) {
	return print_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
	});
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title}
 *
 * @param {SV.TitleElement} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.TitleElement>}
 * @__NO_SIDE_EFFECTS__
 */
export function printTitleElement(n, opts = {}) {
	return print_non_self_closing_el({
		n,
		opts,
		attr_printer: printAttributeLike,
		frag_printer: printFragment,
	});
}

/**
 * @param {SV.Tag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.Tag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printTag(n, opts = {}) {
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
 * @param {SV.ConstTag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.ConstTag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printConstTag(n, opts = {}) {
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
 * @param {SV.DebugTag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.DebugTag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printDebugTag(n, opts = {}) {
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
 * @param {SV.ExpressionTag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.ExpressionTag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printExpressionTag(n, opts = {}) {
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
 * @param {SV.HtmlTag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.HtmlTag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printHtmlTag(n, opts = {}) {
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
 * @param {SV.RenderTag} n
 * @param {Partial<PrintOptions>} [opts]
 * @return {Result<SV.RenderTag>}
 * @__NO_SIDE_EFFECTS__
 */
export function printRenderTag(n, opts = {}) {
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
