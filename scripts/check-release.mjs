// Verifies that a commit is fit to be released as a given version, so that a
// tag is only ever cut from a commit that passed the required checks.
//
//   node scripts/check-release.mjs 0.8.0          before tagging, on your machine
//   node scripts/check-release.mjs --tag v0.8.0   in CI, on a pushed tag
//
// See docs/releasing.md.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const log = (line) => process.stdout.write(`${line}\n`);
const run = (cmd, args) =>
	execFileSync(cmd, args, {
		cwd: root,
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
	}).trim();

const args = process.argv.slice(2);
const tagMode = args[0] === "--tag";
const input = tagMode ? args[1] : args[0];
if (!input) {
	log("Usage: node scripts/check-release.mjs <version>   or   --tag v<version>");
	process.exit(2);
}
const version = input.replace(/^v/, "");
const tag = `v${version}`;

const failures = [];
const check = (ok, message) => {
	log(`${ok ? "  ok  " : "  FAIL"} ${message}`);
	if (!ok) failures.push(message);
};

// --- The version is well formed and both packages carry it -----------------
// Nothing below runs on a malformed version: it is used in git and gh commands.
if (!/^\d+\.\d+\.\d+$/.test(version)) {
	log(`  FAIL "${version}" is not a plain MAJOR.MINOR.PATCH version`);
	process.exit(1);
}
log(`  ok   "${version}" is a plain MAJOR.MINOR.PATCH version`);
for (const manifest of ["packages/core/package.json", "apps/web/package.json"]) {
	const actual = JSON.parse(readFileSync(join(root, manifest), "utf8")).version;
	check(
		actual === version,
		`${manifest} is at ${version}${actual === version ? "" : ` (it is at ${actual})`}`,
	);
}

// --- The changelog has notes for it -----------------------------------------
const changelogPath = join(root, "CHANGELOG.md");
const changelog = existsSync(changelogPath) ? readFileSync(changelogPath, "utf8") : "";
// The heading is found by comparing text, not by building a pattern from input.
const lines = changelog.split("\n");
const headingPrefix = `## [${version}] - `;
const start = lines.findIndex(
	(line) =>
		line.startsWith(headingPrefix) && /^\d{4}-\d{2}-\d{2}$/.test(line.slice(headingPrefix.length)),
);
let notes = "";
if (start >= 0) {
	const rest = lines.slice(start + 1);
	const next = rest.findIndex((line) => line.startsWith("## ["));
	notes = (next >= 0 ? rest.slice(0, next) : rest).join("\n").trim();
}
check(start >= 0, `CHANGELOG.md has a dated section "## [${version}] - YYYY-MM-DD"`);
check(notes.length > 0, "that section is not empty");

// --- The commit is the one on main ------------------------------------------
const commit = run("git", ["rev-parse", tagMode ? `${tag}^{commit}` : "HEAD"]);
run("git", ["fetch", "--quiet", "origin", "main"]);
const onMain = (() => {
	try {
		run("git", ["merge-base", "--is-ancestor", commit, "origin/main"]);
		return true;
	} catch {
		return false;
	}
})();
check(onMain, `commit ${commit.slice(0, 7)} is on main`);

if (!tagMode) {
	check(
		run("git", ["status", "--porcelain", "--untracked-files=no"]) === "",
		"the working tree has no uncommitted changes",
	);
	check(commit === run("git", ["rev-parse", "origin/main"]), "HEAD is the tip of origin/main");
	const existing = run("git", ["tag", "--list", tag]);
	check(existing === "", `tag ${tag} does not exist yet`);
}

// --- That commit passed the required checks ---------------------------------
let gate = "not found";
try {
	const repo = run("gh", ["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"]);
	gate =
		run("gh", [
			"api",
			`repos/${repo}/commits/${commit}/check-runs`,
			"--jq",
			'[.check_runs[] | select(.name == "CI gate" and .app.slug == "github-actions")] | sort_by(.completed_at) | last | .conclusion',
		]) || "not found";
} catch (error) {
	gate = `could not be read (${String(error.message).split("\n")[0]})`;
}
check(gate === "success", `the "CI gate" check on ${commit.slice(0, 7)} is ${gate}`);

if (failures.length > 0) {
	log(`\nNot releasable: ${failures.length} check(s) failed.`);
	process.exit(1);
}

log(`\n${tag} is releasable from ${commit}.`);
if (!tagMode) {
	const notesFile = join(tmpdir(), `guiderail-${tag}-notes.md`);
	writeFileSync(notesFile, `${notes}\n`);
	log("\nTo release it:");
	log(`  git tag -a ${tag} ${commit} -m "GuideRail ${version}"`);
	log(`  git push origin ${tag}`);
	log(
		`  gh release create ${tag} --verify-tag --title "GuideRail ${version}" --notes-file ${notesFile}`,
	);
}
