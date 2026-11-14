// Enforces the dependency boundaries the architecture relies on.
//
//   web -> core only, and only through core's built entry points.
//   The kernel imports no UI, and does not depend on the demo corpus or fixtures.
//
// Run:  pnpm check:boundaries

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const log = (line) => process.stdout.write(`${line}\n`);

function sourceFiles(dir) {
	const files = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) files.push(...sourceFiles(path));
		else if (/\.(ts|tsx|mts)$/.test(entry.name)) files.push(path);
	}
	return files;
}

/** Every module specifier a file imports or re-exports, statically or dynamically. */
function specifiers(source) {
	const found = [];
	const patterns = [
		/\bfrom\s+["']([^"']+)["']/g,
		/\bimport\s+["']([^"']+)["']/g,
		/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
	];
	for (const pattern of patterns) {
		for (const match of source.matchAll(pattern)) found.push(match[1]);
	}
	return found;
}

const coreSrc = join(root, "packages", "core", "src");
const webSrc = join(root, "apps", "web", "src");
const inDir = (file, dir) => !relative(dir, file).startsWith("..");

const rules = [
	{
		name: "The kernel imports no UI library and nothing from the web app",
		files: sourceFiles(coreSrc),
		forbidden: (spec) =>
			/^(react|react-dom|@xyflow\/|zustand|@xstate\/react)/.test(spec) ||
			spec.startsWith("@guiderail/web") ||
			spec.includes("apps/web"),
	},
	{
		name: "Kernel source does not import the demo corpus or test fixtures",
		files: sourceFiles(coreSrc).filter(
			(f) => !inDir(f, join(coreSrc, "demo")) && !inDir(f, join(coreSrc, "test-fixtures")),
		),
		forbidden: (spec) => /(^|\/)(demo|test-fixtures)(\/|$)/.test(spec),
	},
	{
		name: "The demo corpus does not import test fixtures",
		files: sourceFiles(join(coreSrc, "demo")),
		forbidden: (spec) => spec.includes("test-fixtures"),
	},
	{
		name: "The web app imports core only through its built entry points",
		files: sourceFiles(webSrc),
		forbidden: (spec) =>
			spec.includes("packages/core") ||
			spec.startsWith("@seed") ||
			/^@guiderail\/core\/(src|dist)(\/|$)/.test(spec) ||
			spec.includes("test-fixtures"),
	},
];

let violations = 0;
for (const rule of rules) {
	const broken = [];
	for (const file of rule.files) {
		for (const spec of specifiers(readFileSync(file, "utf8"))) {
			if (rule.forbidden(spec)) broken.push(`${relative(root, file)} imports "${spec}"`);
		}
	}
	log(`${broken.length === 0 ? "  ok  " : "  FAIL"} ${rule.name} (${rule.files.length} files)`);
	for (const line of broken) log(`         ${line}`);
	violations += broken.length;
}

if (violations > 0) {
	log(`\n${violations} boundary violation(s).`);
	process.exit(1);
}
log("\nBoundary checks passed.");
