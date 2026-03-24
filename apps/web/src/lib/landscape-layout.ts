import type {
	Capability,
	Domain,
	Node,
	Provider,
	ProviderAssociation,
} from "@guiderail/core/entities";

const DOMAIN_PADDING = 20;
const DOMAIN_HEADER_HEIGHT = 40;
const DOMAIN_GAP = 30;
const CAP_TILE_WIDTH = 200;
const CAP_TILE_HEIGHT = 80;
const CAP_GAP = 16;
const CAPS_PER_ROW = 2;
const ACTOR_WIDTH = 140;
const ACTOR_HEIGHT = 60;
const ACTOR_GAP = 20;
const ACTOR_START_X = 40;
const DOMAIN_START_X = 240;
const START_Y = 40;

interface LandscapeNode {
	id: string;
	type: string;
	position: { x: number; y: number };
	draggable: boolean;
	data: Record<string, unknown>;
}

export interface LandscapeLayoutResult {
	nodes: LandscapeNode[];
	edges: never[];
}

/**
 * Landscape layout: domains as groups, capabilities as tiles, actors as entry points.
 */
export function computeLandscapeLayout(
	domains: Domain[],
	capabilities: Capability[],
	actors: Node[],
	providers: Provider[],
	providerAssociations: ProviderAssociation[],
): LandscapeLayoutResult {
	const nodes: LandscapeNode[] = [];

	// Position actors on the left edge
	const actorNodes = buildActorNodes(actors);
	nodes.push(...actorNodes);

	// Position domains with capability tiles inside
	const domainNodes = buildDomainNodes(domains, capabilities, providers, providerAssociations);
	nodes.push(...domainNodes);

	return { nodes, edges: [] };
}

function buildActorNodes(actors: Node[]): LandscapeNode[] {
	return actors.map((actor, index) => ({
		id: `landscape-actor-${actor.id}`,
		type: "landscape_actor",
		position: { x: ACTOR_START_X, y: START_Y + index * (ACTOR_HEIGHT + ACTOR_GAP) },
		draggable: false,
		data: {
			nodeId: actor.id,
			label: actor.label,
			description: actor.description,
		},
	}));
}

function buildDomainNodes(
	domains: Domain[],
	capabilities: Capability[],
	providers: Provider[],
	providerAssociations: ProviderAssociation[],
): LandscapeNode[] {
	const nodes: LandscapeNode[] = [];

	// Arrange domains in a 3-column grid
	const columns = 3;
	const domainWidth = CAPS_PER_ROW * (CAP_TILE_WIDTH + CAP_GAP) + DOMAIN_PADDING * 2;
	const columnHeights = new Array(columns).fill(START_Y) as number[];

	for (const domain of domains) {
		const domainCaps = capabilities.filter((c) => c.domainId === domain.id);

		// Find the shortest column
		const col = columnHeights.indexOf(Math.min(...columnHeights));
		const x = DOMAIN_START_X + col * (domainWidth + DOMAIN_GAP);
		const y = columnHeights[col] ?? START_Y;

		// Calculate domain height based on capability count
		const capRows = Math.ceil(domainCaps.length / CAPS_PER_ROW);
		const domainHeight =
			DOMAIN_HEADER_HEIGHT + capRows * (CAP_TILE_HEIGHT + CAP_GAP) + DOMAIN_PADDING;

		// Domain group node
		nodes.push({
			id: `landscape-domain-${domain.id}`,
			type: "landscape_domain",
			position: { x, y },
			draggable: false,
			data: {
				domainId: domain.id,
				label: domain.label,
				description: domain.description,
				capabilityCount: domainCaps.length,
				width: domainWidth,
				height: domainHeight,
			},
		});

		// Capability tile nodes inside the domain
		for (let j = 0; j < domainCaps.length; j++) {
			const cap = domainCaps[j];
			if (!cap) continue;
			const row = Math.floor(j / CAPS_PER_ROW);
			const colInDomain = j % CAPS_PER_ROW;
			const capX = x + DOMAIN_PADDING + colInDomain * (CAP_TILE_WIDTH + CAP_GAP);
			const capY = y + DOMAIN_HEADER_HEIGHT + row * (CAP_TILE_HEIGHT + CAP_GAP);

			const providerCount = providerAssociations.filter(
				(pa) => pa.targetType === "capability" && pa.targetId === cap.id,
			).length;

			nodes.push({
				id: `landscape-cap-${cap.id}`,
				type: "landscape_capability",
				position: { x: capX, y: capY },
				draggable: false,
				data: {
					capabilityId: cap.id,
					domainId: domain.id,
					label: cap.label,
					nodeCount: cap.nodeIds.length,
					providerCount,
				},
			});
		}

		columnHeights[col] = y + domainHeight + DOMAIN_GAP;
	}

	return nodes;
}
