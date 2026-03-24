import { describe, expect, it } from "vitest";
import {
	emptyContentBundle,
	mergeContentBundles,
	parseContentBundle,
} from "../../src/content/file-loader.js";

describe("parseContentBundle", () => {
	it("parses valid domains", () => {
		const raw = {
			domains: [
				{ id: "d-1", label: "Test Domain", tags: [] },
				{ id: "d-2", label: "Another Domain" },
			],
		};
		const result = parseContentBundle(raw, "test.json");
		expect(result.bundle.domains.length).toBe(2);
		expect(result.errors.length).toBe(0);
		expect(result.provenance.sourcePath).toBe("test.json");
		expect(result.provenance.entityCounts.domains).toBe(2);
	});

	it("parses valid nodes with parentNodeId", () => {
		const raw = {
			nodes: [
				{ id: "n-1", type: "service", label: "Service A" },
				{ id: "n-2", type: "service", label: "Component B", parentNodeId: "n-1" },
			],
		};
		const result = parseContentBundle(raw, "nodes.json");
		expect(result.bundle.nodes.length).toBe(2);
		expect(result.bundle.nodes[1]?.parentNodeId).toBe("n-1");
		expect(result.errors.length).toBe(0);
	});

	it("collects errors for invalid entities without throwing", () => {
		const raw = {
			domains: [{ id: "d-1", label: "Valid" }, { BAD: "data" }, { id: "d-3", label: "Also Valid" }],
		};
		const result = parseContentBundle(raw, "mixed.json");
		expect(result.bundle.domains.length).toBe(2);
		expect(result.errors.length).toBe(1);
		expect(result.errors[0]?.entityType).toBe("domains");
		expect(result.errors[0]?.index).toBe(1);
	});

	it("handles missing entity arrays gracefully", () => {
		const raw = { domains: [{ id: "d-1", label: "Only Domains" }] };
		const result = parseContentBundle(raw, "partial.json");
		expect(result.bundle.domains.length).toBe(1);
		expect(result.bundle.nodes.length).toBe(0);
		expect(result.bundle.edges.length).toBe(0);
		expect(result.bundle.capabilities.length).toBe(0);
		expect(result.errors.length).toBe(0);
	});

	it("parses all entity types", () => {
		const raw = {
			domains: [{ id: "d-1", label: "D" }],
			capabilities: [{ id: "c-1", domainId: "d-1", label: "C", nodeIds: [] }],
			nodes: [{ id: "n-1", type: "service", label: "N" }],
			edges: [{ id: "e-1", sourceNodeId: "n-1", targetNodeId: "n-1", type: "api_call" }],
			perspectives: [{ id: "p-1", type: "landscape", label: "L" }],
			providers: [{ id: "prov-1", label: "P", category: "test" }],
			controlPoints: [
				{
					id: "cp-1",
					label: "CP",
					processStageId: "ps-1",
					severity: "info",
					controlType: "detective",
					status: "active",
				},
			],
			interfaces: [{ id: "i-1", nodeId: "n-1", label: "I" }],
			messages: [
				{
					id: "m-1",
					sequenceNumber: 0,
					sourceInterfaceId: "i-1",
					targetInterfaceId: "i-1",
					type: "request",
					label: "M",
				},
			],
		};
		const result = parseContentBundle(raw, "full.json");
		expect(result.bundle.domains.length).toBe(1);
		expect(result.bundle.capabilities.length).toBe(1);
		expect(result.bundle.nodes.length).toBe(1);
		expect(result.bundle.edges.length).toBe(1);
		expect(result.bundle.perspectives.length).toBe(1);
		expect(result.bundle.providers.length).toBe(1);
		expect(result.bundle.controlPoints.length).toBe(1);
		expect(result.bundle.interfaces.length).toBe(1);
		expect(result.bundle.messages.length).toBe(1);
		expect(result.errors.length).toBe(0);
	});

	it("populates provenance metadata", () => {
		const raw = { domains: [{ id: "d-1", label: "D" }] };
		const result = parseContentBundle(raw, "/content/domains.json");
		expect(result.provenance.sourceType).toBe("content_file");
		expect(result.provenance.sourcePath).toBe("/content/domains.json");
		expect(result.provenance.loadedAt).toBeTruthy();
		expect(result.provenance.entityCounts.domains).toBe(1);
	});
});

describe("emptyContentBundle", () => {
	it("returns bundle with all empty arrays", () => {
		const bundle = emptyContentBundle();
		expect(bundle.domains.length).toBe(0);
		expect(bundle.nodes.length).toBe(0);
		expect(bundle.edges.length).toBe(0);
		expect(bundle.capabilities.length).toBe(0);
		expect(bundle.interfaces.length).toBe(0);
		expect(bundle.messages.length).toBe(0);
		expect(bundle.controlPoints.length).toBe(0);
	});
});

describe("mergeContentBundles", () => {
	it("merges two bundles by appending arrays", () => {
		const a = emptyContentBundle();
		a.domains = [{ id: "d-1", label: "A", tags: [], metadata: {} }];

		const b = emptyContentBundle();
		b.domains = [{ id: "d-2", label: "B", tags: [], metadata: {} }];

		const merged = mergeContentBundles(a, b);
		expect(merged.domains.length).toBe(2);
		expect(merged.domains[0]?.id).toBe("d-1");
		expect(merged.domains[1]?.id).toBe("d-2");
	});
});
