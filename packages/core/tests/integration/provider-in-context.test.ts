import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { contextMachine } from "../../src/context/context.machine.js";
import { getProcessesForCapability } from "../../src/graph/graph.js";
import { createGraph } from "../../src/graph/graph.js";
import {
	capabilities,
	edges,
	journeys,
	nodes,
	processStages,
	processes,
	providerAssociations,
	providers,
	steps,
	storyRoutes,
	storyWaypoints,
	valueStreams,
} from "../../src/test-fixtures/index.js";

const graph = createGraph(nodes, edges);

function createFullContext() {
	const actor = createActor(contextMachine).start();
	actor.send({
		type: "INITIALIZE",
		graph,
		journeys,
		steps,
		capabilities,
		providers,
		providerAssociations,
		valueStreams,
		processes,
		processStages,
		storyRoutes,
		storyWaypoints,
	});
	return actor;
}

function nav(actor: ReturnType<typeof createActor<typeof contextMachine>>) {
	return actor.getSnapshot().context.nav;
}

describe("Process in Context — end-to-end visibility", () => {
	it("processes are visible through capability context", () => {
		// Verify process for state reconciliation capability
		const capProcesses = getProcessesForCapability("cap-state-reconciliation", processes);
		expect(capProcesses.length).toBeGreaterThanOrEqual(1);
		expect(capProcesses.some((p) => p.label === "Perspective Switch with Shared Context")).toBe(
			true,
		);
		expect(capProcesses[0]?.stageIds.length).toBe(8);
	});

	it("context machine preserves domain/capability across perspective switches", () => {
		const actor = createFullContext();

		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		actor.send({ type: "SELECT_CAPABILITY", capabilityId: "cap-state-reconciliation" });

		// Switch perspective
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-process" });
		expect(nav(actor).activePerspectiveId).toBe("persp-process");

		// Domain and capability preserved
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");
		expect(nav(actor).activeCapabilityId).toBe("cap-state-reconciliation");
	});

	it("full navigation chain: domain → capability → process → perspective switch", () => {
		const actor = createFullContext();

		// Domain
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");

		// Capability
		actor.send({ type: "SELECT_CAPABILITY", capabilityId: "cap-state-reconciliation" });
		expect(nav(actor).activeCapabilityId).toBe("cap-state-reconciliation");

		// Process
		actor.send({ type: "SELECT_PROCESS", processId: "proc-perspective-switch" });
		expect(nav(actor).activeProcessId).toBe("proc-perspective-switch");
		expect(nav(actor).activeFocusTargets.length).toBeGreaterThan(0);

		// Perspective switch preserves everything
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-architecture" });
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");
		expect(nav(actor).activeCapabilityId).toBe("cap-state-reconciliation");
		expect(nav(actor).activeProcessId).toBe("proc-perspective-switch");
	});
});
