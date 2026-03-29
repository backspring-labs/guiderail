import { EdgeSchema } from "../entities/edge.js";
import type { Edge } from "../entities/edge.js";
import { NodeSchema } from "../entities/node.js";
import type { Node } from "../entities/node.js";

// --- Nodes ---

export const nodes: Node[] = [
	// === @guiderail/core modules (type: service) ===
	{
		id: "n-context-machine",
		type: "service",
		label: "Context Machine",
		description: "XState state machine — 35 events, single authority for all navigation state",
		tags: ["core", "state", "xstate"],
		metadata: {
			sourceFile: "packages/core/src/context/context.machine.ts",
			package: "@guiderail/core",
		},
		layoutByPerspective: {
			"persp-architecture": { x: 400, y: 0 },
			"persp-system": { x: 400, y: 0 },
		},
	},
	{
		id: "n-reconciler",
		type: "service",
		label: "Reconciler",
		description:
			"19 pure functions that transform NavigationContext — enforces shared context contract",
		tags: ["core", "reconciler", "pure-functions"],
		metadata: { sourceFile: "packages/core/src/context/reconciler.ts", package: "@guiderail/core" },
		layoutByPerspective: {
			"persp-architecture": { x: 400, y: 150 },
			"persp-system": { x: 400, y: 150 },
		},
	},
	{
		id: "n-navigation-context",
		type: "service",
		label: "Navigation Context",
		description: "Zod-validated navigation state schema — 18 fields, the shared context contract",
		tags: ["core", "context", "zod"],
		metadata: {
			sourceFile: "packages/core/src/context/navigation-context.ts",
			package: "@guiderail/core",
		},
		layoutByPerspective: {
			"persp-architecture": { x: 400, y: 300 },
			"persp-system": { x: 400, y: 300 },
		},
	},
	{
		id: "n-entities",
		type: "service",
		label: "Entity Schemas",
		description:
			"20+ Zod schemas defining the canonical model — Domain, Node, Step, Sequence, etc.",
		tags: ["core", "entities", "zod"],
		metadata: { sourceFile: "packages/core/src/entities/", package: "@guiderail/core" },
		layoutByPerspective: {
			"persp-architecture": { x: 700, y: 0 },
			"persp-system": { x: 700, y: 0 },
		},
	},
	{
		id: "n-graph",
		type: "service",
		label: "Terrain Graph",
		description: "TerrainGraph with node/edge maps for topology traversal and queries",
		tags: ["core", "graph"],
		metadata: { sourceFile: "packages/core/src/graph/graph.ts", package: "@guiderail/core" },
		layoutByPerspective: {
			"persp-architecture": { x: 700, y: 150 },
			"persp-system": { x: 700, y: 150 },
		},
	},
	{
		id: "n-file-loader",
		type: "service",
		label: "File Loader",
		description: "parseContentBundle — Zod validation, error collection, content provenance",
		tags: ["core", "content", "loader"],
		metadata: {
			sourceFile: "packages/core/src/content/file-loader.ts",
			package: "@guiderail/core",
		},
		layoutByPerspective: {
			"persp-architecture": { x: 700, y: 300 },
			"persp-system": { x: 700, y: 300 },
		},
	},

	// === @guiderail/web modules (type: service) ===
	{
		id: "n-app-shell",
		type: "service",
		label: "App Shell",
		description: "Orchestration hub — wires kernel to UI, routes events, manages layout",
		tags: ["web", "orchestration"],
		metadata: {
			sourceFile: "apps/web/src/components/layout/AppShell.tsx",
			package: "@guiderail/web",
		},
		layoutByPerspective: {
			"persp-architecture": { x: 0, y: 0 },
			"persp-system": { x: 0, y: 0 },
		},
	},
	{
		id: "n-use-context-machine",
		type: "service",
		label: "useContextMachine",
		description: "KernelContext provider and useNavigation hook — React bridge to XState",
		tags: ["web", "hook", "xstate"],
		metadata: {
			sourceFile: "apps/web/src/hooks/use-context-machine.ts",
			package: "@guiderail/web",
		},
		layoutByPerspective: {
			"persp-architecture": { x: 200, y: 0 },
			"persp-system": { x: 200, y: 0 },
		},
	},
	{
		id: "n-use-perspective-provider",
		type: "service",
		label: "Perspective Provider",
		description: "Routes kernel state to perspective-specific layout engines on every state change",
		tags: ["web", "hook", "rendering"],
		metadata: {
			sourceFile: "apps/web/src/hooks/use-perspective-provider.ts",
			package: "@guiderail/web",
		},
		layoutByPerspective: {
			"persp-architecture": { x: 200, y: 150 },
			"persp-system": { x: 200, y: 150 },
		},
	},
	{
		id: "n-left-panel",
		type: "service",
		label: "Left Panel",
		description: "7-section contextual navigator scoped to primary selection with cascading filter",
		tags: ["web", "navigation", "panel"],
		metadata: {
			sourceFile: "apps/web/src/components/navigation/LeftPanel.tsx",
			package: "@guiderail/web",
		},
		layoutByPerspective: {
			"persp-architecture": { x: 0, y: 150 },
			"persp-system": { x: 0, y: 150 },
		},
	},
	{
		id: "n-context-bar",
		type: "service",
		label: "Context Bar",
		description:
			"Breadcrumb trail + canvas mode switcher — displays domain > capability > journey path",
		tags: ["web", "navigation", "breadcrumb"],
		metadata: {
			sourceFile: "apps/web/src/components/layout/ContextBar.tsx",
			package: "@guiderail/web",
		},
		layoutByPerspective: {
			"persp-architecture": { x: 0, y: 300 },
			"persp-system": { x: 0, y: 300 },
		},
	},
	{
		id: "n-story-route-bar",
		type: "service",
		label: "Story Route Bar",
		description: "Guided route playback UI — displays waypoint key message and navigation controls",
		tags: ["web", "routes", "playback"],
		metadata: {
			sourceFile: "apps/web/src/components/route/StoryRouteBar.tsx",
			package: "@guiderail/web",
		},
		layoutByPerspective: {
			"persp-architecture": { x: 0, y: 450 },
			"persp-system": { x: 0, y: 450 },
		},
	},
	{
		id: "n-stepper-control",
		type: "service",
		label: "Stepper Control",
		description:
			"Transport controls + arrow keys for sequential content on Journey, Process, Sequence, Orientation",
		tags: ["web", "stepper", "transport"],
		metadata: {
			sourceFile: "apps/web/src/components/layout/StepperControl.tsx",
			package: "@guiderail/web",
		},
		layoutByPerspective: {
			"persp-architecture": { x: 0, y: 600 },
			"persp-system": { x: 0, y: 600 },
		},
	},
	{
		id: "n-search-palette",
		type: "service",
		label: "Search Palette",
		description: "Cmd+K fuzzy search across all entity types for rapid navigation",
		tags: ["web", "search", "navigation"],
		metadata: {
			sourceFile: "apps/web/src/components/navigation/SearchPalette.tsx",
			package: "@guiderail/web",
		},
		layoutByPerspective: {
			"persp-architecture": { x: 0, y: 750 },
			"persp-system": { x: 0, y: 750 },
		},
	},
	{
		id: "n-bpmn-layout",
		type: "service",
		label: "BPMN Layout",
		description: "Process canvas layout — swim lane positioning with topological ordering",
		tags: ["web", "layout", "bpmn"],
		metadata: { sourceFile: "apps/web/src/lib/bpmn-layout.ts", package: "@guiderail/web" },
		layoutByPerspective: {
			"persp-architecture": { x: 200, y: 300 },
			"persp-system": { x: 200, y: 300 },
		},
	},
	{
		id: "n-journey-layout",
		type: "service",
		label: "Journey Layout",
		description: "Journey canvas layout — step flow with branching transitions",
		tags: ["web", "layout", "journey"],
		metadata: { sourceFile: "apps/web/src/lib/journey-layout.ts", package: "@guiderail/web" },
		layoutByPerspective: {
			"persp-architecture": { x: 200, y: 450 },
			"persp-system": { x: 200, y: 450 },
		},
	},
	{
		id: "n-landscape-layout",
		type: "service",
		label: "Landscape Layout",
		description: "Landscape canvas layout — 3-column domain grid with capability tiles",
		tags: ["web", "layout", "landscape"],
		metadata: { sourceFile: "apps/web/src/lib/landscape-layout.ts", package: "@guiderail/web" },
		layoutByPerspective: {
			"persp-architecture": { x: 200, y: 600 },
			"persp-system": { x: 200, y: 600 },
		},
	},
	{
		id: "n-sequence-layout",
		type: "service",
		label: "Sequence Layout",
		description:
			"Sequence canvas layout — lifeline diagram with interface headers and message arrows",
		tags: ["web", "layout", "sequence"],
		metadata: { sourceFile: "apps/web/src/lib/sequence-layout.ts", package: "@guiderail/web" },
		layoutByPerspective: {
			"persp-architecture": { x: 200, y: 750 },
			"persp-system": { x: 200, y: 750 },
		},
	},
	{
		id: "n-ui-store",
		type: "service",
		label: "UI Store",
		description: "Zustand store — UI-only state: panel visibility, toggle state, hover",
		tags: ["web", "zustand", "state"],
		metadata: { sourceFile: "apps/web/src/hooks/ui-store.ts", package: "@guiderail/web" },
		layoutByPerspective: {
			"persp-architecture": { x: 0, y: 900 },
			"persp-system": { x: 0, y: 900 },
		},
	},

	// === System nodes (runtime participants, type: system) ===
	{
		id: "n-xstate-actor",
		type: "system",
		label: "XState Actor",
		description:
			"Single authority for nav state — processes all 35 events via createActorContext(contextMachine)",
		tags: ["runtime", "xstate", "actor"],
		metadata: { runtimeIdentity: "KernelContext via createActorContext(contextMachine)" },
		layoutByPerspective: {
			"persp-architecture": { x: 1000, y: 0 },
			"persp-system": { x: 600, y: 0 },
		},
	},
	{
		id: "n-zustand-store",
		type: "system",
		label: "Zustand Store",
		description: "UI-only state — panel visibility, animation flags, hover state",
		tags: ["runtime", "zustand", "store"],
		metadata: { runtimeIdentity: "useUIStore in ui-store.ts" },
		layoutByPerspective: {
			"persp-architecture": { x: 1000, y: 150 },
			"persp-system": { x: 600, y: 150 },
		},
	},
	{
		id: "n-react-flow-instance",
		type: "system",
		label: "React Flow Instance",
		description: "Canvas renderer — nodes, edges, viewport, zoom, pan for all graph perspectives",
		tags: ["runtime", "react-flow", "canvas"],
		metadata: { runtimeIdentity: "<ReactFlow> in AppShell.tsx" },
		layoutByPerspective: {
			"persp-architecture": { x: 1000, y: 300 },
			"persp-system": { x: 600, y: 300 },
		},
	},
	{
		id: "n-vite-dev-server",
		type: "system",
		label: "Vite Dev Server",
		description: "HMR, module bundling, path resolution including @seed alias",
		tags: ["runtime", "vite", "tooling"],
		metadata: { runtimeIdentity: "vite.config.ts" },
		layoutByPerspective: {
			"persp-architecture": { x: 1000, y: 450 },
			"persp-system": { x: 600, y: 450 },
		},
	},

	// === Actor nodes (type: actor) ===
	{
		id: "n-user",
		type: "actor",
		label: "User",
		description:
			"The person using GuideRail — navigates perspectives, selects entities, follows guided routes",
		tags: ["external", "user"],
		layoutByPerspective: {
			"persp-architecture": { x: -200, y: 0 },
			"persp-system": { x: -200, y: 0 },
		},
	},
].map((d) => NodeSchema.parse(d));

// --- Edges ---

export const edges: Edge[] = [
	// === Web → Core dependency boundary ===
	{
		id: "e-web-core",
		sourceNodeId: "n-app-shell",
		targetNodeId: "n-use-context-machine",
		type: "dependency",
		label: "uses hook",
	},
	{
		id: "e-context-hook-machine",
		sourceNodeId: "n-use-context-machine",
		targetNodeId: "n-context-machine",
		type: "dependency",
		label: "wraps",
	},

	// === AppShell → navigation hooks ===
	{
		id: "e-shell-provider",
		sourceNodeId: "n-app-shell",
		targetNodeId: "n-use-perspective-provider",
		type: "dependency",
		label: "uses hook",
	},
	{
		id: "e-shell-left-panel",
		sourceNodeId: "n-app-shell",
		targetNodeId: "n-left-panel",
		type: "dependency",
		label: "renders",
	},
	{
		id: "e-shell-context-bar",
		sourceNodeId: "n-app-shell",
		targetNodeId: "n-context-bar",
		type: "dependency",
		label: "renders",
	},
	{
		id: "e-shell-story-route-bar",
		sourceNodeId: "n-app-shell",
		targetNodeId: "n-story-route-bar",
		type: "dependency",
		label: "renders",
	},
	{
		id: "e-shell-stepper",
		sourceNodeId: "n-app-shell",
		targetNodeId: "n-stepper-control",
		type: "dependency",
		label: "renders",
	},
	{
		id: "e-shell-search",
		sourceNodeId: "n-app-shell",
		targetNodeId: "n-search-palette",
		type: "dependency",
		label: "renders",
	},

	// === Context Machine → Reconciler → NavigationContext ===
	{
		id: "e-machine-reconciler",
		sourceNodeId: "n-context-machine",
		targetNodeId: "n-reconciler",
		type: "dependency",
		label: "calls",
	},
	{
		id: "e-reconciler-nav-context",
		sourceNodeId: "n-reconciler",
		targetNodeId: "n-navigation-context",
		type: "dependency",
		label: "transforms",
	},

	// === Perspective Provider → Layout engines ===
	{
		id: "e-provider-bpmn",
		sourceNodeId: "n-use-perspective-provider",
		targetNodeId: "n-bpmn-layout",
		type: "dependency",
		label: "routes to",
	},
	{
		id: "e-provider-journey",
		sourceNodeId: "n-use-perspective-provider",
		targetNodeId: "n-journey-layout",
		type: "dependency",
		label: "routes to",
	},
	{
		id: "e-provider-landscape",
		sourceNodeId: "n-use-perspective-provider",
		targetNodeId: "n-landscape-layout",
		type: "dependency",
		label: "routes to",
	},
	{
		id: "e-provider-sequence",
		sourceNodeId: "n-use-perspective-provider",
		targetNodeId: "n-sequence-layout",
		type: "dependency",
		label: "routes to",
	},

	// === Layout engines → React Flow ===
	{
		id: "e-bpmn-reactflow",
		sourceNodeId: "n-bpmn-layout",
		targetNodeId: "n-react-flow-instance",
		type: "dependency",
		label: "produces nodes for",
	},
	{
		id: "e-journey-reactflow",
		sourceNodeId: "n-journey-layout",
		targetNodeId: "n-react-flow-instance",
		type: "dependency",
		label: "produces nodes for",
	},
	{
		id: "e-landscape-reactflow",
		sourceNodeId: "n-landscape-layout",
		targetNodeId: "n-react-flow-instance",
		type: "dependency",
		label: "produces nodes for",
	},
	{
		id: "e-sequence-reactflow",
		sourceNodeId: "n-sequence-layout",
		targetNodeId: "n-react-flow-instance",
		type: "dependency",
		label: "produces nodes for",
	},

	// === Runtime connections ===
	{
		id: "e-context-hook-actor",
		sourceNodeId: "n-use-context-machine",
		targetNodeId: "n-xstate-actor",
		type: "dependency",
		label: "creates",
	},
	{
		id: "e-ui-store-zustand",
		sourceNodeId: "n-ui-store",
		targetNodeId: "n-zustand-store",
		type: "dependency",
		label: "creates",
	},
	{
		id: "e-shell-reactflow",
		sourceNodeId: "n-app-shell",
		targetNodeId: "n-react-flow-instance",
		type: "dependency",
		label: "renders",
	},

	// === Core internal ===
	{
		id: "e-machine-entities",
		sourceNodeId: "n-context-machine",
		targetNodeId: "n-entities",
		type: "dependency",
		label: "validates with",
	},
	{
		id: "e-loader-entities",
		sourceNodeId: "n-file-loader",
		targetNodeId: "n-entities",
		type: "dependency",
		label: "validates with",
	},
	{
		id: "e-loader-graph",
		sourceNodeId: "n-file-loader",
		targetNodeId: "n-graph",
		type: "dependency",
		label: "builds",
	},

	// === User interaction ===
	{
		id: "e-user-shell",
		sourceNodeId: "n-user",
		targetNodeId: "n-app-shell",
		type: "user_interaction",
		label: "interacts with",
	},
].map((d) => EdgeSchema.parse(d));
