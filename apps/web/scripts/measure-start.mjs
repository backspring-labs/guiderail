// Measures how long the built app takes to become usable, and how much
// JavaScript it loads to get there. See docs/performance.md.
//
// Usage, from apps/web after `pnpm build`:
//   node scripts/measure-start.mjs [runs]
//
// It serves dist/ with `vite preview`, then for each run opens a fresh browser
// context (cold cache) and records:
//   - ready: ms from navigation start until the active perspective tab is on screen
//   - js:    bytes of JavaScript fetched by then (uncompressed, as served)
// once at full speed and once with the CPU slowed 4x.

import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const runs = Number(process.argv[2] ?? 15);
const PORT = 4179;
const url = `http://localhost:${PORT}/`;

const server = spawn("pnpm", ["exec", "vite", "preview", "--port", String(PORT), "--strictPort"], {
	stdio: "ignore",
});

async function waitForServer() {
	for (let i = 0; i < 100; i++) {
		try {
			if ((await fetch(url)).ok) return;
		} catch {}
		await new Promise((r) => setTimeout(r, 100));
	}
	throw new Error("preview server did not start");
}

const median = (values) => {
	const sorted = [...values].sort((a, b) => a - b);
	return sorted[Math.floor(sorted.length / 2)];
};

async function measure(browser, cpuSlowdown) {
	const ready = [];
	let js = 0;
	let requests = 0;
	for (let i = 0; i < runs; i++) {
		const context = await browser.newContext();
		const page = await context.newPage();
		if (cpuSlowdown > 1) {
			const cdp = await context.newCDPSession(page);
			await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuSlowdown });
		}
		await page.goto(url, { waitUntil: "commit" });
		await page.waitForSelector(".perspective-switcher__tab--active");
		const sample = await page.evaluate(() => {
			const scripts = performance
				.getEntriesByType("resource")
				.filter((r) => r.name.endsWith(".js"));
			return {
				ready: performance.now(),
				js: scripts.reduce((sum, r) => sum + r.decodedBodySize, 0),
				requests: scripts.length,
			};
		});
		ready.push(sample.ready);
		js = sample.js;
		requests = sample.requests;
		await context.close();
	}
	return {
		cpuSlowdown,
		readyMedianMs: Math.round(median(ready)),
		readyMinMs: Math.round(Math.min(...ready)),
		readyMaxMs: Math.round(Math.max(...ready)),
		jsBytes: js,
		jsRequests: requests,
	};
}

try {
	await waitForServer();
	const browser = await chromium.launch();
	const results = [await measure(browser, 1), await measure(browser, 4)];
	await browser.close();
	process.stdout.write(
		`${JSON.stringify({ runs, browser: `chromium ${browser.version()}`, node: process.version, results }, null, 2)}\n`,
	);
} finally {
	server.kill();
}
