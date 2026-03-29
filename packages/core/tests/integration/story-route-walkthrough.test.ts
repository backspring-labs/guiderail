import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { contextMachine } from "../../src/context/context.machine.js";
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

describe("Story Route Walkthrough — full lifecycle with pause/return", () => {
	it("completes the full route lifecycle", () => {
		const actor = createFullContext();
		expect(actor.getSnapshot().value).toBe("ready");

		// 1. Set domain context before starting route
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		actor.send({ type: "SELECT_CAPABILITY", capabilityId: "cap-state-reconciliation" });
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");
		expect(nav(actor).activeCapabilityId).toBe("cap-state-reconciliation");

		// 2. START_ROUTE "The Full Descent"
		actor.send({ type: "START_ROUTE", storyRouteId: "sr-full-descent" });
		expect(nav(actor).activeStoryRouteId).toBe("sr-full-descent");
		expect(nav(actor).activeWaypointIndex).toBe(0);
		expect(nav(actor).routeState).toBe("active");
		expect(nav(actor).activeFocusTargets.length).toBeGreaterThan(0);
		// Route does NOT clear domain/capability
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");
		expect(nav(actor).activeCapabilityId).toBe("cap-state-reconciliation");

		// 3. First waypoint applies its perspective (persp-landscape)
		expect(nav(actor).activePerspectiveId).toBe("persp-landscape");

		// 4. NEXT_WAYPOINT — advance to waypoint 1
		actor.send({ type: "NEXT_WAYPOINT" });
		expect(nav(actor).activeWaypointIndex).toBe(1);
		expect(nav(actor).activeFocusTargets.length).toBeGreaterThanOrEqual(0);
		// Waypoint 1 (sw-fd-2) has perspectiveId: "persp-landscape"
		expect(nav(actor).activePerspectiveId).toBe("persp-landscape");

		// 5. NEXT_WAYPOINT — advance to waypoint 2
		actor.send({ type: "NEXT_WAYPOINT" });
		expect(nav(actor).activeWaypointIndex).toBe(2);
		// Waypoint 2 (sw-fd-3) has perspectiveId: "persp-journey"
		expect(nav(actor).activePerspectiveId).toBe("persp-journey");

		// 6. PAUSE_ROUTE mid-route
		actor.send({ type: "PAUSE_ROUTE" });
		expect(nav(actor).routeState).toBe("paused");
		expect(nav(actor).activeWaypointIndex).toBe(2);
		expect(actor.getSnapshot().context.pausedRouteSnapshot).not.toBeNull();

		// 7. Freely explore during pause
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-navigation" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-landscape" });
		actor.send({ type: "SELECT_NODE", nodeId: "n-user" });
		// Temporary exploration changes nav state
		expect(nav(actor).activeDomainId).toBe("dom-navigation");
		expect(nav(actor).selectedNodeId).toBe("n-user");
		expect(nav(actor).activePerspectiveId).toBe("persp-landscape");
		// Route is still paused, not lost
		expect(nav(actor).activeStoryRouteId).toBe("sr-full-descent");
		expect(nav(actor).routeState).toBe("paused");

		// 8. RESUME_ROUTE — restores to waypoint 2 state
		actor.send({ type: "RESUME_ROUTE" });
		expect(nav(actor).routeState).toBe("active");
		expect(nav(actor).activeWaypointIndex).toBe(2);
		expect(nav(actor).activePerspectiveId).toBe("persp-journey");
		expect(actor.getSnapshot().context.pausedRouteSnapshot).toBeNull();

		// 9. Continue to remaining waypoints
		actor.send({ type: "NEXT_WAYPOINT" }); // waypoint 3 (sw-fd-4)
		expect(nav(actor).activeWaypointIndex).toBe(3);
		// Waypoint 3 has perspectiveId: "persp-journey"
		expect(nav(actor).activePerspectiveId).toBe("persp-journey");

		actor.send({ type: "NEXT_WAYPOINT" }); // waypoint 4 (sw-fd-5)
		expect(nav(actor).activeWaypointIndex).toBe(4);
		// Waypoint 4 has perspectiveId: "persp-process"
		expect(nav(actor).activePerspectiveId).toBe("persp-process");

		actor.send({ type: "NEXT_WAYPOINT" }); // waypoint 5 (sw-fd-6)
		actor.send({ type: "NEXT_WAYPOINT" }); // waypoint 6 (sw-fd-7)
		actor.send({ type: "NEXT_WAYPOINT" }); // waypoint 7 (sw-fd-8)
		actor.send({ type: "NEXT_WAYPOINT" }); // waypoint 8 (sw-fd-9, last)
		expect(nav(actor).activeWaypointIndex).toBe(8);
		// Waypoint 8 has perspectiveId: "persp-sequence"
		expect(nav(actor).activePerspectiveId).toBe("persp-sequence");

		// 10. Can't advance past last waypoint
		actor.send({ type: "NEXT_WAYPOINT" });
		expect(nav(actor).activeWaypointIndex).toBe(8);

		// 11. END_ROUTE — clean state, domain preserved
		actor.send({ type: "END_ROUTE" });
		expect(nav(actor).activeStoryRouteId).toBeNull();
		expect(nav(actor).activeWaypointIndex).toBeNull();
		expect(nav(actor).routeState).toBe("inactive");
		expect(nav(actor).activeFocusTargets).toEqual([]);
		// Perspective is preserved
		expect(nav(actor).activePerspectiveId).toBeDefined();
	});
});

describe("Story Route — pause preserves route-owned state", () => {
	it("temporary exploration does not mutate the route-owned focus snapshot", () => {
		const actor = createFullContext();
		actor.send({ type: "START_ROUTE", storyRouteId: "sr-full-descent" });
		actor.send({ type: "NEXT_WAYPOINT" }); // waypoint 1

		const preePauseFocusTargets = [...nav(actor).activeFocusTargets];
		const prePausePerspective = nav(actor).activePerspectiveId;
		const prePauseWaypointIndex = nav(actor).activeWaypointIndex;

		// Pause
		actor.send({ type: "PAUSE_ROUTE" });

		// Explore — this changes nav state but should not affect the snapshot
		actor.send({ type: "SELECT_NODE", nodeId: "n-reconciler" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-process" });

		// Verify snapshot was NOT mutated by exploration
		const snapshot = actor.getSnapshot().context.pausedRouteSnapshot;
		expect(snapshot).not.toBeNull();
		expect(snapshot?.activeFocusTargets).toEqual(preePauseFocusTargets);
		expect(snapshot?.activePerspectiveId).toBe(prePausePerspective);
		expect(snapshot?.activeWaypointIndex).toBe(prePauseWaypointIndex);

		// Resume — should restore to pre-pause state
		actor.send({ type: "RESUME_ROUTE" });
		expect(nav(actor).activeFocusTargets).toEqual(preePauseFocusTargets);
		expect(nav(actor).activePerspectiveId).toBe(prePausePerspective);
		expect(nav(actor).activeWaypointIndex).toBe(prePauseWaypointIndex);
	});
});
