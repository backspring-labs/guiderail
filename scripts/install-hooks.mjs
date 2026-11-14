// Installs the git hooks defined in lefthook.yml.
//
// pnpm runs this as the root "prepare" script after every install. pnpm does not
// run lefthook's own install script (dependency build scripts are off by
// default), so without this a fresh clone has no hooks.
//
// It never fails an install: outside a git checkout, or in CI, there is nothing
// to do. CI does not rely on hooks; the same checks run in the workflow.

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const say = (line) => process.stdout.write(`${line}\n`);

if (process.env.CI) {
	say("git hooks: skipped in CI");
} else if (!existsSync(join(root, ".git"))) {
	say("git hooks: skipped, not a git checkout");
} else {
	try {
		execFileSync("pnpm", ["exec", "lefthook", "install"], { cwd: root, stdio: "ignore" });
		say("git hooks: installed (pre-commit runs `pnpm check`)");
	} catch {
		say("git hooks: could not be installed. Run `pnpm exec lefthook install` to see why.");
	}
}
