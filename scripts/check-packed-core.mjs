// Verifies @guiderail/core the way a consumer would receive it.
//
// 1. Packs the built package.
// 2. Checks the tarball: licence, README, every export target present, nothing internal.
// 3. Installs the tarball into a throwaway project OUTSIDE this workspace, so nothing
//    can resolve through workspace links or source aliases.
// 4. Imports every public entry point at runtime, and typechecks every one with tsc.
//
// Run after `pnpm build`:  pnpm check:package

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const coreDir = join(root, "packages", "core");
const manifest = JSON.parse(readFileSync(join(coreDir, "package.json"), "utf8"));
const rootManifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const log = (line) => process.stdout.write(`${line}\n`);
const run = (cmd, args, cwd) =>
	execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

const failures = [];
const check = (ok, message) => {
	log(`${ok ? "  ok  " : "  FAIL"} ${message}`);
	if (!ok) failures.push(message);
};

if (!existsSync(join(coreDir, "dist", "index.js"))) {
	log("packages/core/dist is missing. Run `pnpm build` first.");
	process.exit(1);
}

const packDir = mkdtempSync(join(tmpdir(), "guiderail-pack-"));
const consumerDir = mkdtempSync(join(tmpdir(), "guiderail-consumer-"));

try {
	// --- 1. Pack -------------------------------------------------------------
	run("pnpm", ["pack", "--pack-destination", packDir], coreDir);
	const tarball = join(packDir, `guiderail-core-${manifest.version}.tgz`);
	check(existsSync(tarball), `packed ${manifest.name}@${manifest.version}`);

	// --- 2. Tarball contents ---------------------------------------------------
	const files = new Set(
		run("tar", ["-tzf", tarball], packDir)
			.split("\n")
			.filter(Boolean)
			.map((f) => f.replace(/^package\//, "")),
	);
	log(`\nTarball: ${files.size} files`);
	check(files.has("LICENSE"), "contains LICENSE");
	check(files.has("README.md"), "contains README.md");
	check(files.has("package.json"), "contains package.json");

	const internal = [...files].filter(
		(f) => f.startsWith("src/") || f.startsWith("tests/") || f.includes("test-fixtures"),
	);
	check(
		internal.length === 0,
		`contains no source, tests or fixtures${internal[0] ? ` (found ${internal[0]})` : ""}`,
	);

	const entries = Object.entries(manifest.exports);
	for (const [subpath, targets] of entries) {
		for (const kind of ["import", "types"]) {
			const target = targets[kind]?.replace(/^\.\//, "");
			check(
				target != null && files.has(target),
				`export "${subpath}" ${kind} target exists: ${target ?? "(not declared)"}`,
			);
		}
	}

	// --- 3. Install outside the workspace --------------------------------------
	const specifiers = entries.map(([subpath]) =>
		subpath === "." ? manifest.name : `${manifest.name}/${subpath.replace(/^\.\//, "")}`,
	);
	writeFileSync(
		join(consumerDir, "package.json"),
		JSON.stringify({ name: "guiderail-consumer-check", private: true, type: "module" }, null, 2),
	);
	const typescript = `typescript@${rootManifest.devDependencies.typescript}`;
	run(
		"npm",
		["install", "--no-audit", "--no-fund", "--ignore-scripts", tarball, typescript],
		consumerDir,
	);
	log(`\nInstalled into ${consumerDir}`);

	// --- 4a. Runtime import of every entry point -------------------------------
	writeFileSync(
		join(consumerDir, "smoke.mjs"),
		[
			`const specifiers = ${JSON.stringify(specifiers)};`,
			"for (const s of specifiers) {",
			"  const m = await import(s);",
			'  if (typeof m !== "object" || m === null) throw new Error(`${s} did not load as a module`);',
			"  console.log(`${s}: ${Object.keys(m).length} exports`);",
			"}",
			`const { createGraph, contextMachine } = await import(${JSON.stringify(manifest.name)});`,
			'if (typeof createGraph !== "function") throw new Error("createGraph is not exported from the root");',
			'if (contextMachine == null) throw new Error("contextMachine is not exported from the root");',
			"const graph = createGraph([], []);",
			'if (graph.nodes.size !== 0) throw new Error("createGraph did not return an empty graph");',
		].join("\n"),
	);
	try {
		const out = run("node", ["smoke.mjs"], consumerDir);
		for (const line of out.trim().split("\n")) log(`  ${line}`);
		check(true, `every entry point imports at runtime (${specifiers.length})`);
	} catch (error) {
		check(
			false,
			`runtime import failed: ${String(error.stderr ?? error.message)
				.trim()
				.split("\n")
				.slice(0, 6)
				.join(" | ")}`,
		);
	}

	// --- 4b. Types of every entry point ----------------------------------------
	writeFileSync(
		join(consumerDir, "types.ts"),
		[
			...specifiers.map((s, i) => `import type * as M${i} from ${JSON.stringify(s)};`),
			`export type All = [${specifiers.map((_, i) => `typeof M${i}`).join(", ")}];`,
			`import { createGraph, type Node, type NavigationContext } from ${JSON.stringify(manifest.name)};`,
			'const node: Node = { id: "n", type: "service", label: "N", tags: [], metadata: {}, layoutByPerspective: {} };',
			"export const size: number = createGraph([node], []).nodes.size;",
			'export const perspective: NavigationContext["activePerspectiveId"] = "p";',
		].join("\n"),
	);
	writeFileSync(
		join(consumerDir, "tsconfig.json"),
		JSON.stringify(
			{
				compilerOptions: {
					module: "NodeNext",
					moduleResolution: "NodeNext",
					target: "ES2022",
					strict: true,
					noEmit: true,
					skipLibCheck: false,
				},
				files: ["types.ts"],
			},
			null,
			2,
		),
	);
	try {
		run(join(consumerDir, "node_modules", ".bin", "tsc"), ["-p", "tsconfig.json"], consumerDir);
		check(true, `every entry point typechecks without skipLibCheck (${specifiers.length})`);
	} catch (error) {
		check(
			false,
			`typecheck failed: ${String(error.stdout ?? error.message)
				.trim()
				.split("\n")
				.slice(0, 8)
				.join(" | ")}`,
		);
	}
} finally {
	rmSync(packDir, { recursive: true, force: true });
	rmSync(consumerDir, { recursive: true, force: true });
}

if (failures.length > 0) {
	log(`\n${failures.length} package check(s) failed.`);
	process.exit(1);
}
log("\nPackage checks passed.");
