import type { ReactNode } from "react";
import { createElement } from "react";

/**
 * Minimal markdown-to-React-elements converter for orientation content.
 * Supports: **bold**, bullet lists, numbered lists, > blockquotes, paragraphs.
 */
export function renderMarkdown(input: string): ReactNode[] {
	const lines = input.split("\n");
	const elements: ReactNode[] = [];
	let listItems: ReactNode[] = [];
	let listType: "ul" | "ol" | null = null;
	let key = 0;

	const flush = () => {
		if (listType && listItems.length > 0) {
			elements.push(createElement(listType, { key: key++ }, ...listItems));
			listItems = [];
			listType = null;
		}
	};

	for (const raw of lines) {
		const line = raw.trimEnd();

		if (line.trim() === "") {
			flush();
			continue;
		}

		if (line.startsWith("> ")) {
			flush();
			elements.push(createElement("blockquote", { key: key++ }, applyInline(line.slice(2), key++)));
			continue;
		}

		if (line.startsWith("- ")) {
			if (listType !== "ul") {
				flush();
				listType = "ul";
			}
			listItems.push(createElement("li", { key: key++ }, applyInline(line.slice(2), key++)));
			continue;
		}

		const olMatch = line.match(/^(\d+)\.\s/);
		if (olMatch) {
			if (listType !== "ol") {
				flush();
				listType = "ol";
			}
			listItems.push(
				createElement("li", { key: key++ }, applyInline(line.slice(olMatch[0].length), key++)),
			);
			continue;
		}

		flush();
		elements.push(createElement("p", { key: key++ }, applyInline(line, key++)));
	}

	flush();
	return elements;
}

function applyInline(text: string, baseKey: number): ReactNode {
	const parts = text.split(/(\*\*.+?\*\*)/g);
	if (parts.length === 1) return text;

	return parts.map((part, i) => {
		if (part.startsWith("**") && part.endsWith("**")) {
			return createElement("strong", { key: `${baseKey}-${i}` }, part.slice(2, -2));
		}
		return part;
	});
}
