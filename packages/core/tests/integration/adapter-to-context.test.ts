import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { contextMachine } from "../../src/context/context.machine.js";
import { createGraph } from "../../src/graph/graph.js";
import { MockContentRepoAdapter } from "../../src/test-fixtures/mock-content-adapter.js";
import { MockNormalizer } from "../../src/test-fixtures/mock-normalizer.js";
import {
	capabilities,
	domains,
	edges,
	journeys,
	nodes,
	steps,
} from "../../src/test-fixtures/seed-banking.js";

function nav(actor: ReturnType<typeof createActor<typeof contextMachine>>) {
	return actor.getSnapshot().context.nav;
}

describe("End-to-end: adapter → normalizer → graph → context", () => {
	it("completes the full pipeline from source connection to navigable context", async () => {
		// 1. Connect to source via adapter
		const adapter = new MockContentRepoAdapter();
		const connection = await adapter.connect("/mock/banking-corpus");
		expect(connection.sourceId).toBe("mock-source-1");
		expect(connection.revision).toBe("mock-rev-001");

		// 2. Read artifacts from adapter
		const artifacts = await adapter.listArtifacts();
		expect(artifacts.length).toBeGreaterThan(0);

		const domainManifests = await adapter.listDomains();
		expect(domainManifests.length).toBe(7);

		const capabilityManifests = await adapter.listCapabilities();
		expect(capabilityManifests.length).toBe(20);

		const entityManifests = await adapter.listEntities();
		expect(entityManifests.length).toBe(24);

		const researchManifests = await adapter.listResearch();
		expect(researchManifests.length).toBeGreaterThan(0);

		// 3. Normalize raw data through normalizer
		const normalizer = new MockNormalizer(connection.sourceId);

		const normalizedDomains = normalizer.normalizeDomains(domains);
		expect(normalizedDomains.length).toBe(7);

		const normalizedCapabilities = normalizer.normalizeCapabilities(capabilities);
		expect(normalizedCapabilities.length).toBe(20);

		const normalizedNodes = normalizer.normalizeNodes(nodes);
		expect(normalizedNodes.length).toBe(24);

		const normalizedEdges = normalizer.normalizeEdges(edges);
		expect(normalizedEdges.length).toBe(25);

		const normalizedJourneys = normalizer.normalizeJourneys(journeys);
		expect(normalizedJourneys.length).toBe(3);

		// 4. Verify provenance can be resolved
		const prov = normalizer.resolveProvenance(
			{ id: normalizedDomains[0]?.id ?? "" },
			"domains/core-kernel.yaml",
			"root",
		);
		expect(prov.sourceId).toBe("mock-source-1");
		expect(prov.sourceFile).toBe("domains/core-kernel.yaml");
		expect(prov.confidence).toBe("high");

		// 5. Create graph from normalized entities
		const graph = createGraph(normalizedNodes, normalizedEdges);
		expect(graph.nodes.size).toBe(24);
		expect(graph.edges.size).toBe(25);

		// 6. Initialize context machine with the graph
		const actor = createActor(contextMachine).start();
		actor.send({
			type: "INITIALIZE",
			graph,
			journeys: normalizedJourneys,
			steps,
			capabilities: normalizedCapabilities,
		});
		expect(actor.getSnapshot().value).toBe("ready");

		// 7. Navigate: domain → capability → journey
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");

		actor.send({ type: "SELECT_CAPABILITY", capabilityId: "cap-context-machine" });
		expect(nav(actor).activeCapabilityId).toBe("cap-context-machine");

		actor.send({ type: "SELECT_JOURNEY", journeyId: "j-full-descent" });
		expect(nav(actor).activeJourneyId).toBe("j-full-descent");
		expect(nav(actor).activeStepIndex).toBe(0);

		// 8. Step through and verify context sync
		actor.send({ type: "STEP_FORWARD" });
		expect(nav(actor).activeStepIndex).toBe(1);

		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-architecture" });
		expect(nav(actor).activePerspectiveId).toBe("persp-architecture");
		expect(nav(actor).activeStepIndex).toBe(1);
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");

		// 9. Disconnect
		await adapter.disconnect();
	});
});
