import { emptyContentBundle } from "@guiderail/core/content";
import type { ContentBundle } from "@guiderail/core/content";
import { type Dataset, createDataset } from "./dataset.js";

/**
 * A small dataset that is nothing like the demo corpus, and deliberately
 * partial: most collections are omitted, sequence numbers are gapped, and two
 * references point at entities that do not exist. The app must render it
 * without any component changing, and the kernel and the views must agree.
 */
export function tinyBundle(): ContentBundle {
	return {
		...emptyContentBundle(),
		domains: [{ id: "d-shop", label: "Shop", tags: [], metadata: {} }],
		capabilities: [
			{
				id: "c-checkout",
				domainId: "d-shop",
				label: "Checkout",
				nodeIds: ["n-cart", "n-pay"],
				edgeIds: [],
				journeyIds: [],
				tags: [],
				metadata: {},
			},
		],
		nodes: [
			{
				id: "n-cart",
				type: "service",
				label: "Cart",
				tags: [],
				metadata: {},
				layoutByPerspective: {},
			},
			{
				id: "n-pay",
				type: "service",
				label: "Payments",
				tags: [],
				metadata: {},
				layoutByPerspective: {},
			},
		],
		edges: [
			{
				id: "e-cart-pay",
				sourceNodeId: "n-cart",
				targetNodeId: "n-pay",
				type: "calls",
				directed: true,
				metadata: {},
			},
			// Dangling: there is no node "n-ghost".
			{
				id: "e-pay-ghost",
				sourceNodeId: "n-pay",
				targetNodeId: "n-ghost",
				type: "calls",
				directed: true,
				metadata: {},
			},
		],
		// Perspective ids that do not contain their type names.
		perspectives: [
			{ id: "view-1", type: "landscape", label: "Map", highlightRules: {}, visibilityRules: {} },
			{ id: "view-2", type: "journey", label: "Trip", highlightRules: {}, visibilityRules: {} },
			{ id: "view-3", type: "sequence", label: "Calls", highlightRules: {}, visibilityRules: {} },
		],
		journeys: [
			{
				id: "j-buy",
				label: "Buy something",
				entryCapabilityId: "c-checkout",
				capabilityIds: ["c-checkout"],
				stepIds: [],
				tags: [],
				entryConditions: [],
				exitConditions: [],
				metadata: {},
			},
		],
		// Gapped numbers, given out of order.
		steps: [
			{
				id: "s-pay",
				journeyId: "j-buy",
				sequenceNumber: 40,
				stepType: "screen",
				focusTargets: [{ type: "node", targetId: "n-pay" }],
				capabilityId: "c-checkout",
				title: "Pay",
				transitions: [],
				evidenceRefIds: [],
				metadata: {},
			},
			{
				id: "s-cart",
				journeyId: "j-buy",
				sequenceNumber: 10,
				stepType: "screen",
				focusTargets: [{ type: "node", targetId: "n-cart" }],
				capabilityId: "c-checkout",
				title: "Review cart",
				transitions: [{ targetStepId: "s-pay" }],
				evidenceRefIds: [],
				metadata: {},
			},
		],
		interfaces: [
			{ id: "i-cart", nodeId: "n-cart", label: "Cart API", metadata: {} },
			{ id: "i-pay", nodeId: "n-pay", label: "Payments API", metadata: {} },
		],
		messages: [
			{
				id: "m-charge",
				sequenceNumber: 7,
				sourceInterfaceId: "i-cart",
				targetInterfaceId: "i-pay",
				type: "request",
				label: "charge",
				metadata: {},
			},
			{
				id: "m-receipt",
				sequenceNumber: 12,
				sourceInterfaceId: "i-pay",
				targetInterfaceId: "i-cart",
				type: "response",
				label: "receipt",
				metadata: {},
			},
		],
		sequences: [
			{
				id: "q-charge",
				label: "Charge a card",
				capabilityId: "c-checkout",
				interfaceIds: ["i-cart", "i-pay"],
				// Dangling: there is no message "m-missing".
				messageIds: ["m-charge", "m-missing", "m-receipt"],
				tags: [],
				metadata: {},
			},
		],
	};
}

export function tinyDataset(): Dataset {
	return createDataset(tinyBundle());
}
