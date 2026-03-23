import { ActorNode } from "./ActorNode.js";
import { BpmnEventNode } from "./BpmnEventNode.js";
import { BpmnGatewayNode } from "./BpmnGatewayNode.js";
import { BpmnTaskNode } from "./BpmnTaskNode.js";
import { LifelineNode } from "./LifelineNode.js";
import { ScreenNode } from "./ScreenNode.js";
import { SequenceMessageNode } from "./SequenceMessageNode.js";
import { ServiceNode } from "./ServiceNode.js";
import { SystemNode } from "./SystemNode.js";

export const nodeTypes = {
	actor: ActorNode,
	service: ServiceNode,
	system: SystemNode,
	screen: ScreenNode,
	bpmn_task: BpmnTaskNode,
	bpmn_event: BpmnEventNode,
	bpmn_gateway: BpmnGatewayNode,
	lifeline: LifelineNode,
	sequence_message: SequenceMessageNode,
};
