import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * The colour tokens meet WCAG AA contrast (4.5:1 for text), by calculation.
 *
 * The browser suite scans what the demo data happens to render. This test covers
 * what it cannot reach: every text token on every surface, including the states
 * and entity types the demo never shows.
 */

const directory = dirname(fileURLToPath(import.meta.url));
const sheets: Record<string, string> = Object.fromEntries(
	readdirSync(directory)
		.filter((name) => name.endsWith(".css"))
		.map((name) => [`./${name}`, readFileSync(join(directory, name), "utf8")]),
);
const variables = sheets["./variables.css"] ?? "";

const AA_TEXT = 4.5;

function token(name: string): string {
	const match = variables.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6});`));
	if (!match?.[1]) throw new Error(`No hex value for ${name} in variables.css`);
	return match[1];
}

function channels(hex: string): [number, number, number] {
	const value = hex.replace("#", "");
	return [0, 2, 4].map((i) => Number.parseInt(value.slice(i, i + 2), 16)) as [
		number,
		number,
		number,
	];
}

function luminance(hex: string): number {
	const [r, g, b] = channels(hex).map((channel) => {
		const c = channel / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	}) as [number, number, number];
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
	return (hi + 0.05) / (lo + 0.05);
}

/** `overlay` painted at `alpha` over `base`, as a translucent tint renders. */
function tint(overlay: string, alpha: number, base: string): string {
	const top = channels(overlay);
	const under = channels(base);
	const mixed = top.map((c, i) => Math.round(c * alpha + (under[i] ?? 0) * (1 - alpha)));
	return `#${mixed.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

const SURFACES = ["--color-bg", "--color-bg-panel", "--color-bg-secondary", "--color-bg-surface"];

/** Each ink colour, and the hues whose tint it is written on (badges, active rows). */
const INKS: Record<string, string[]> = {
	"--color-ink-blue": ["#3b82f6", "#2563eb", "#60a5fa"],
	"--color-ink-emerald": ["#10b981"],
	"--color-ink-green": ["#22c55e"],
	"--color-ink-violet": ["#8b5cf6"],
	"--color-ink-indigo": ["#6366f1"],
	"--color-ink-purple": ["#a855f7"],
	"--color-ink-pink": ["#f472b6"],
	"--color-ink-sky": ["#0ea5e9"],
	"--color-ink-amber": ["#f59e0b"],
	"--color-ink-red": ["#ef4444"],
};

/** The strongest tint any stylesheet puts behind coloured text. */
const BADGE_TINT = 0.2;

describe("colour tokens meet AA contrast", () => {
	it.each(["--color-text", "--color-text-secondary"])("%s is readable on every surface", (name) => {
		for (const surface of SURFACES) {
			expect(contrast(token(name), token(surface)), `${name} on ${surface}`).toBeGreaterThanOrEqual(
				AA_TEXT,
			);
		}
	});

	it("muted text is readable on the two dark surfaces it is meant for", () => {
		for (const surface of ["--color-bg", "--color-bg-panel"]) {
			expect(
				contrast(token("--color-text-muted"), token(surface)),
				`muted on ${surface}`,
			).toBeGreaterThanOrEqual(AA_TEXT);
		}
	});

	it.each(Object.entries(INKS))(
		"%s is readable on every surface and on a tint of its own hue",
		(name, hues) => {
			const ink = token(name);
			for (const surface of SURFACES) {
				const background = token(surface);
				expect(contrast(ink, background), `${name} on ${surface}`).toBeGreaterThanOrEqual(AA_TEXT);
				for (const hue of hues) {
					expect(
						contrast(ink, tint(hue, BADGE_TINT, background)),
						`${name} on a ${BADGE_TINT * 100}% tint of ${hue} over ${surface}`,
					).toBeGreaterThanOrEqual(AA_TEXT);
				}
			}
		},
	);

	it("text on the bright fills and the provider badges is readable", () => {
		const providerFills = ["scheme", "rail", "wallet", "network", "default"].map((category) =>
			token(`--color-provider-${category}`),
		);
		for (const fill of ["#f59e0b", "#10b981", "#ef4444", ...providerFills]) {
			expect(
				contrast(token("--color-text-on-fill"), fill),
				`on-fill text on ${fill}`,
			).toBeGreaterThanOrEqual(AA_TEXT);
		}
	});
});

describe("stylesheets take text colours from the text and ink tokens", () => {
	const ALLOWED = /^(var\(--color-(text|ink)[a-z-]*\)|white|inherit|currentColor|transparent)$/;

	it.each(Object.keys(sheets).filter((path) => path !== "./variables.css"))(
		"%s sets no text colour from a fill hue or a literal",
		(path) => {
			const offenders = (sheets[path] ?? "")
				.split("\n")
				.map((line, index) => ({ line: line.trim(), number: index + 1 }))
				.filter(({ line }) => /^color:/.test(line))
				.filter(({ line }) => !ALLOWED.test(line.replace(/^color:\s*/, "").replace(/;$/, "")))
				.map(({ line, number }) => `${path}:${number} ${line}`);
			expect(offenders).toEqual([]);
		},
	);

	it("no hue tint used as a background is stronger than the one the inks are checked against", () => {
		const tints = Object.entries(sheets).flatMap(([path, css]) =>
			[...css.matchAll(/background(?:-color)?:\s*rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/g)]
				.map(([, r, g, b, alpha]) => ({ path, rgb: `${r},${g},${b}`, alpha: Number(alpha) }))
				// Black and white overlays are shadows and hover washes, not hue tints.
				.filter(({ rgb }) => rgb !== "0,0,0" && rgb !== "255,255,255"),
		);
		expect(tints.length).toBeGreaterThan(0);
		expect(tints.filter(({ alpha }) => alpha > BADGE_TINT)).toEqual([]);
	});
});
