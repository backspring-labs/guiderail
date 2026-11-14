import { describe, expect, it } from "vitest";
import {
	CONTENT_COLLECTIONS,
	CONTENT_COLLECTION_NAMES,
	type ContentBundle,
	emptyContentBundle,
	mergeContentBundles,
	orderBySequence,
	parseContentBundle,
	validateContentBundle,
} from "../../src/content/index.js";
import { demoContent } from "../../src/demo/index.js";
import * as entities from "../../src/entities/index.js";

/**
 * Regression cases for docs/architecture/data-integrity.md. Each describe block
 * is one section of that contract. Inputs are the smallest that show the outcome.
 */

const domain = (id: string) => ({ id, label: id });
const node = (id: string, extra: Record<string, unknown> = {}) => ({
	id,
	type: "service",
	label: id,
	...extra,
});
const edge = (id: string, sourceNodeId: string, targetNodeId: string) => ({
	id,
	sourceNodeId,
	targetNodeId,
	type: "calls",
});
const codes = (issues: Array<{ code: string }>) => issues.map((i) => i.code);

describe("1. partial datasets", () => {
	it("accepts an empty object: every collection loads empty with no diagnostic", () => {
		const result = parseContentBundle({}, "empty.json");
		expect(result.errors).toEqual([]);
		expect(result.warnings).toEqual([]);
		for (const name of CONTENT_COLLECTION_NAMES) {
			expect(result.bundle[name]).toEqual([]);
		}
	});

	it("accepts a dataset with one collection and omits the rest silently", () => {
		const result = parseContentBundle({ domains: [domain("d1")] }, "partial.json");
		expect(result.errors).toEqual([]);
		expect(result.warnings).toEqual([]);
		expect(result.bundle.domains.map((d) => d.id)).toEqual(["d1"]);
	});

	it("accepts a present, empty collection", () => {
		const result = parseContentBundle({ nodes: [] }, "empty-nodes.json");
		expect(result.errors).toEqual([]);
		expect(result.bundle.nodes).toEqual([]);
	});

	it.each([
		["an object", { a: 1 }],
		["a string", "nodes"],
		["null", null],
		["a number", 3],
	])("reports a collection that is %s instead of an array", (_, value) => {
		const result = parseContentBundle({ nodes: value }, "bad.json");
		expect(result.errors).toHaveLength(1);
		expect(result.errors[0]).toMatchObject({ code: "not_an_array", entityType: "nodes" });
		expect(result.bundle.nodes).toEqual([]);
	});

	it("reports an unknown top-level key as a warning and loads the rest", () => {
		const result = parseContentBundle(
			{ domains: [domain("d1")], domians: [domain("d2")] },
			"typo.json",
		);
		expect(result.errors).toEqual([]);
		expect(result.warnings).toHaveLength(1);
		expect(result.warnings[0]).toMatchObject({ code: "unknown_section", entityType: "domians" });
		expect(result.bundle.domains).toHaveLength(1);
	});

	it.each([
		["an array", []],
		["null", null],
		["a string", "content"],
	])("reports a root that is %s instead of an object, without throwing", (_, root) => {
		const result = parseContentBundle(root, "root.json");
		expect(codes(result.errors)).toEqual(["not_an_array"]);
		expect(result.errors[0]?.entityType).toBe("(root)");
	});
});

describe("2. malformed entities", () => {
	it("drops the invalid entity, keeps its neighbours, and says which one", () => {
		const result = parseContentBundle(
			{ domains: [domain("d1"), { id: "d2" }, domain("d3")] },
			"mixed.json",
		);
		expect(result.bundle.domains.map((d) => d.id)).toEqual(["d1", "d3"]);
		expect(result.errors).toHaveLength(1);
		expect(result.errors[0]).toMatchObject({
			code: "invalid_entity",
			entityType: "domains",
			index: 1,
			id: "d2",
		});
	});

	it("reports an entity with no readable id by position only", () => {
		const result = parseContentBundle({ domains: [42] }, "junk.json");
		expect(result.errors[0]).toMatchObject({ code: "invalid_entity", index: 0 });
		expect(result.errors[0]?.id).toBeUndefined();
	});
});

describe("3. identity", () => {
	it("keeps the first entity with an id and reports the later one", () => {
		const result = parseContentBundle(
			{ nodes: [node("n1", { label: "first" }), node("n1", { label: "second" })] },
			"dup.json",
		);
		expect(result.bundle.nodes).toHaveLength(1);
		expect(result.bundle.nodes[0]?.label).toBe("first");
		expect(result.errors).toHaveLength(1);
		expect(result.errors[0]).toMatchObject({
			code: "duplicate_id",
			entityType: "nodes",
			index: 1,
			id: "n1",
		});
	});

	it("allows the same id in different collections", () => {
		const result = parseContentBundle(
			{ nodes: [node("x")], bpmnNodes: [node("x")], domains: [domain("x")] },
			"shared.json",
		);
		expect(result.errors).toEqual([]);
	});

	it("merge keeps the first bundle's entity and reports the collision", () => {
		const a = parseContentBundle({ nodes: [node("n1", { label: "from a" })] }, "a.json").bundle;
		const b = parseContentBundle(
			{ nodes: [node("n1", { label: "from b" }), node("n2")] },
			"b.json",
		).bundle;

		const merged = mergeContentBundles(a, b);
		expect(merged.bundle.nodes.map((n) => `${n.id}:${n.label}`)).toEqual(["n1:from a", "n2:n2"]);
		expect(merged.errors).toHaveLength(1);
		expect(merged.errors[0]).toMatchObject({ code: "duplicate_id", entityType: "nodes", id: "n1" });
	});

	it("validateContentBundle reports duplicates in a bundle assembled in code", () => {
		const bundle = emptyContentBundle();
		const parsed = parseContentBundle({ nodes: [node("n1")] }, "x.json").bundle.nodes;
		bundle.nodes = [...parsed, ...parsed];
		expect(codes(validateContentBundle(bundle).errors)).toEqual(["duplicate_id"]);
	});
});

describe("4. references", () => {
	it("reports a dangling reference and keeps the entity", () => {
		const result = parseContentBundle(
			{ nodes: [node("a")], edges: [edge("e1", "a", "ghost")] },
			"dangling.json",
		);
		expect(result.bundle.edges.map((e) => e.id)).toEqual(["e1"]);
		expect(result.errors).toHaveLength(1);
		expect(result.errors[0]).toMatchObject({
			code: "dangling_reference",
			entityType: "edges",
			index: 0,
			id: "e1",
		});
		expect(result.errors[0]?.message).toContain("targetNodeId");
		expect(result.errors[0]?.message).toContain("ghost");
	});

	it("does not check references into a collection the dataset omits", () => {
		// No "nodes" key at all: the edges may point at nodes supplied elsewhere.
		const result = parseContentBundle({ edges: [edge("e1", "a", "b")] }, "edges-only.json");
		expect(result.errors).toEqual([]);
	});

	it("checks references into a collection that is present but empty", () => {
		const result = parseContentBundle({ nodes: [], edges: [edge("e1", "a", "b")] }, "x.json");
		expect(codes(result.errors)).toEqual(["dangling_reference", "dangling_reference"]);
	});

	it("validateContentBundle checks every reference, as for a complete dataset", () => {
		const parsed = parseContentBundle({ edges: [edge("e1", "a", "b")] }, "edges-only.json");
		expect(codes(validateContentBundle(parsed.bundle).errors)).toEqual([
			"dangling_reference",
			"dangling_reference",
		]);
	});

	it("resolves a reference to an entity dropped as a duplicate, not to a missing one", () => {
		const result = parseContentBundle(
			{ nodes: [node("a"), node("a"), node("b")], edges: [edge("e1", "a", "b")] },
			"x.json",
		);
		expect(codes(result.errors)).toEqual(["duplicate_id"]);
	});

	it("reports a reference to an entity that was dropped as invalid", () => {
		const result = parseContentBundle(
			{ nodes: [node("a"), { id: "b" }], edges: [edge("e1", "a", "b")] },
			"x.json",
		);
		expect(codes(result.errors).sort()).toEqual(["dangling_reference", "invalid_entity"]);
	});

	it("keeps BPMN nodes and terrain nodes as separate id spaces", () => {
		const result = parseContentBundle(
			{ nodes: [node("a"), node("b")], bpmnNodes: [], bpmnEdges: [edge("be1", "a", "b")] },
			"x.json",
		);
		expect(codes(result.errors)).toEqual(["dangling_reference", "dangling_reference"]);
		expect(result.errors[0]?.message).toContain("bpmnNodes");
	});

	it("checks typed focus targets and ignores types with no single target collection", () => {
		const step = (id: string, focusTargets: unknown[]) => ({
			id,
			journeyId: "j1",
			sequenceNumber: 0,
			capabilityId: "c1",
			title: id,
			focusTargets,
		});
		const result = parseContentBundle(
			{
				nodes: [node("a")],
				steps: [
					step("s1", [
						{ type: "node", targetId: "a" },
						{ type: "node", targetId: "ghost" },
						{ type: "scene_element", targetId: "anything" },
					]),
				],
			},
			"x.json",
		);
		expect(result.errors).toHaveLength(1);
		expect(result.errors[0]?.message).toContain("focusTargets[1]");
	});
});

describe("5. ordered navigation", () => {
	const item = (id: string, sequenceNumber: number) => ({ id, sequenceNumber });

	it("orders by sequenceNumber whatever the input order", () => {
		const ordered = orderBySequence([item("c", 30), item("a", 10), item("b", 20)]);
		expect(ordered.map((i) => i.id)).toEqual(["a", "b", "c"]);
	});

	it("gives positions 0..n-1 to non-contiguous numbers that do not start at 0", () => {
		const ordered = orderBySequence([item("x", 7), item("y", 100), item("z", 12)]);
		expect(ordered.map((i, position) => `${position}:${i.id}`)).toEqual(["0:x", "1:z", "2:y"]);
	});

	it("keeps input order for tied numbers", () => {
		const ordered = orderBySequence([item("first", 1), item("second", 1), item("zero", 0)]);
		expect(ordered.map((i) => i.id)).toEqual(["zero", "first", "second"]);
	});

	it("does not reorder the caller's array", () => {
		const input = [item("b", 2), item("a", 1)];
		orderBySequence(input);
		expect(input.map((i) => i.id)).toEqual(["b", "a"]);
	});

	it("accepts non-contiguous sequence numbers without a diagnostic", () => {
		const waypoint = (id: string, sequenceNumber: number) => ({
			id,
			storyRouteId: "r1",
			sequenceNumber,
			title: id,
			keyMessage: id,
		});
		const result = parseContentBundle(
			{ storyWaypoints: [waypoint("w1", 10), waypoint("w2", 20), waypoint("w3", 35)] },
			"gaps.json",
		);
		expect(result.errors).toEqual([]);
		expect(result.warnings).toEqual([]);
	});

	it("warns when two items in one group share a number, and not across groups", () => {
		const waypoint = (id: string, storyRouteId: string, sequenceNumber: number) => ({
			id,
			storyRouteId,
			sequenceNumber,
			title: id,
			keyMessage: id,
		});
		const result = parseContentBundle(
			{
				storyWaypoints: [waypoint("w1", "r1", 0), waypoint("w2", "r1", 0), waypoint("w3", "r2", 0)],
			},
			"ties.json",
		);
		expect(result.errors).toEqual([]);
		expect(result.warnings).toHaveLength(1);
		expect(result.warnings[0]).toMatchObject({
			code: "duplicate_sequence_number",
			entityType: "storyWaypoints",
			id: "w2",
		});
	});
});

describe("collection registry", () => {
	// Schemas that are not loadable collections, with the reason. A new entity
	// schema must be added to CONTENT_COLLECTIONS or listed here, or this fails.
	const NOT_A_COLLECTION: Record<string, string> = {
		AccessClassificationSchema: "enum",
		AnnotationTargetTypeSchema: "enum",
		AnnotationTypeSchema: "enum",
		ControlSeveritySchema: "enum",
		ControlStatusSchema: "enum",
		ControlTypeSchema: "enum",
		EvidenceRefTypeSchema: "enum",
		FocusTargetTypeSchema: "enum",
		IndexStatusSchema: "enum",
		InterfaceProtocolSchema: "enum",
		LayoutStrategySchema: "enum",
		MessageTypeSchema: "enum",
		PerspectiveTypeSchema: "enum",
		ProcessCanvasModeSchema: "enum",
		ProviderAssociationTargetTypeSchema: "enum",
		SourceTypeSchema: "enum",
		StepTypeSchema: "enum",
		FocusTargetSchema: "embedded in steps and waypoints",
		StepTransitionSchema: "embedded in steps",
		CanvasModeSchema: "UI navigation value, not content",
		SessionSchema: "runtime state, not content",
		SourceSchema: "source registration, not content",
		TerrainIndexSchema: "generated index, not content",
		WorkspaceSchema: "runtime container, not content",
	};

	it("accounts for every entity schema: a collection, or excluded with a reason", () => {
		const registered = new Set<unknown>(Object.values(CONTENT_COLLECTIONS));
		const unaccounted = Object.entries(entities)
			.filter(([name]) => name.endsWith("Schema"))
			.filter(([name, schema]) => !registered.has(schema) && !(name in NOT_A_COLLECTION))
			.map(([name]) => name);
		expect(unaccounted).toEqual([]);
	});

	it("has no stale exclusions", () => {
		const exported = new Set(Object.keys(entities));
		expect(Object.keys(NOT_A_COLLECTION).filter((name) => !exported.has(name))).toEqual([]);
	});

	it("emptyContentBundle has exactly the registered collections", () => {
		expect(Object.keys(emptyContentBundle()).sort()).toEqual([...CONTENT_COLLECTION_NAMES].sort());
	});
});

describe("the demo corpus", () => {
	const bundle: ContentBundle = demoContent;

	it("supplies exactly the collections the registry knows", () => {
		expect(Object.keys(bundle).sort()).toEqual([...CONTENT_COLLECTION_NAMES].sort());
		for (const name of CONTENT_COLLECTION_NAMES) {
			expect(Array.isArray(bundle[name])).toBe(true);
		}
	});

	it("satisfies the contract: no duplicate ids, dangling references or ambiguous order", () => {
		const { errors, warnings } = validateContentBundle(bundle);
		expect(errors.map((e) => `${e.code}: ${e.message}`)).toEqual([]);
		expect(warnings.map((w) => `${w.code}: ${w.message}`)).toEqual([]);
	});

	it("round-trips through the parser unchanged in size", () => {
		const result = parseContentBundle(JSON.parse(JSON.stringify(bundle)), "demo.json");
		expect(result.errors.map((e) => `${e.code}: ${e.message}`)).toEqual([]);
		for (const name of CONTENT_COLLECTION_NAMES) {
			expect(result.bundle[name]).toHaveLength(bundle[name].length);
		}
	});
});
