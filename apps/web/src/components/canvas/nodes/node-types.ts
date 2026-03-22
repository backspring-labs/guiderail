import { ActorNode } from "./ActorNode.js";
import { ScreenNode } from "./ScreenNode.js";
import { ServiceNode } from "./ServiceNode.js";
import { SystemNode } from "./SystemNode.js";

export const nodeTypes = {
	actor: ActorNode,
	service: ServiceNode,
	system: SystemNode,
	screen: ScreenNode,
};
