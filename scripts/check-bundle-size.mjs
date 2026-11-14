// Reports the size of the web app's production build and fails if it has grown
// past its budget. Run after `pnpm build`:  pnpm check:bundle
//
// "Initial" JavaScript is what index.html loads before the app can start.
// Everything else is loaded on demand. Budgets are in apps/web/bundle-budget.json
// and are explained in docs/performance.md.

import { appendFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "apps", "web", "dist");
const budget = JSON.parse(readFileSync(join(root, "apps", "web", "bundle-budget.json"), "utf8"));
const log = (line) => process.stdout.write(`${line}\n`);

if (!existsSync(join(dist, "index.html"))) {
	log("apps/web/dist is missing. Run `pnpm build` first.");
	process.exit(1);
}

const html = readFileSync(join(dist, "index.html"), "utf8");
const initialFiles = new Set(
	[...html.matchAll(/(?:src|href)="\/?(assets\/[^"]+\.js)"/g)].map((m) =>
		m[1].replace("assets/", ""),
	),
);

const measure = (file) => {
	const bytes = readFileSync(join(dist, "assets", file));
	return { file, raw: bytes.length, gzip: gzipSync(bytes, { level: 9 }).length };
};
const assets = readdirSync(join(dist, "assets"));
const js = assets.filter((f) => f.endsWith(".js")).map(measure);
const css = assets.filter((f) => f.endsWith(".css")).map(measure);

const sum = (items, key) => items.reduce((total, item) => total + item[key], 0);
const initial = js.filter((f) => initialFiles.has(f.file));
const lazy = js.filter((f) => !initialFiles.has(f.file));

const measured = {
	initialJsGzip: sum(initial, "gzip"),
	lazyJsGzip: sum(lazy, "gzip"),
	cssGzip: sum(css, "gzip"),
};

const kb = (bytes) => `${(bytes / 1000).toFixed(1)} kB`;
const rows = [
	["Initial JavaScript", sum(initial, "raw"), measured.initialJsGzip, budget.initialJsGzip],
	["On-demand JavaScript", sum(lazy, "raw"), measured.lazyJsGzip, budget.lazyJsGzip],
	["CSS", sum(css, "raw"), measured.cssGzip, budget.cssGzip],
];

const lines = [
	"### Web bundle size",
	"",
	"| | Minified | Gzip | Budget (gzip) | |",
	"|---|---|---|---|---|",
	...rows.map(
		([name, raw, gzip, limit]) =>
			`| ${name} | ${kb(raw)} | ${kb(gzip)} | ${kb(limit)} | ${gzip <= limit ? "within" : "**OVER**"} |`,
	),
	"",
	`Initial files: ${initial.map((f) => f.file).join(", ") || "(none found)"}`,
	`On-demand files: ${lazy.map((f) => f.file).join(", ") || "(none)"}`,
];
for (const line of lines) log(line);
if (process.env.GITHUB_STEP_SUMMARY) {
	appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join("\n")}\n`);
}

const over = rows.filter(([, , gzip, limit]) => gzip > limit);
if (initial.length === 0) {
	log("\nNo initial JavaScript was found in index.html; the build layout has changed.");
	process.exit(1);
}
if (over.length > 0) {
	log(`\nOver budget: ${over.map(([name]) => name).join(", ")}.`);
	log(
		"Reduce the size, or raise the budget in apps/web/bundle-budget.json and say why in the pull request.",
	);
	process.exit(1);
}
log("\nBundle size is within budget.");
