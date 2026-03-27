import { ActorNode } from "./ActorNode.js";
import { BpmnEventNode } from "./BpmnEventNode.js";
import { BpmnGatewayNode } from "./BpmnGatewayNode.js";
import { BpmnTaskNode } from "./BpmnTaskNode.js";
import { JourneyPickerNode } from "./JourneyPickerNode.js";
import { JourneyStepNode } from "./JourneyStepNode.js";
import { LandscapeActorNode } from "./LandscapeActorNode.js";
import { LandscapeCapabilityNode } from "./LandscapeCapabilityNode.js";
import { LandscapeDomainNode } from "./LandscapeDomainNode.js";
import { LifelineNode } from "./LifelineNode.js";
import { ScreenNode } from "./ScreenNode.js";
import { SequenceMessageNode } from "./SequenceMessageNode.js";
import { SequencePickerNode } from "./SequencePickerNode.js";
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
	journey_step: JourneyStepNode,
	journey_picker: JourneyPickerNode,
	landscape_domain: LandscapeDomainNode,
	landscape_capability: LandscapeCapabilityNode,
	landscape_actor: LandscapeActorNode,
	sequence_picker: SequencePickerNode,
};
