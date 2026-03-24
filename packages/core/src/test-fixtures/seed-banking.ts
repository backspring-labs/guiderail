import { AnnotationSchema } from "../entities/annotation.js";
import type { Annotation } from "../entities/annotation.js";
import { CapabilitySchema } from "../entities/capability.js";
import type { Capability } from "../entities/capability.js";
import { ControlPointSchema } from "../entities/control-point.js";
import type { ControlPoint } from "../entities/control-point.js";
import { DomainSchema } from "../entities/domain.js";
import type { Domain } from "../entities/domain.js";
import { EdgeSchema } from "../entities/edge.js";
import type { Edge } from "../entities/edge.js";
import { EvidenceRefSchema } from "../entities/evidence-ref.js";
import type { EvidenceRef } from "../entities/evidence-ref.js";
import { InterfaceSchema } from "../entities/interface.js";
import type { Interface } from "../entities/interface.js";
import { JourneySchema } from "../entities/journey.js";
import type { Journey } from "../entities/journey.js";
import { LayerSchema } from "../entities/layer.js";
import type { Layer } from "../entities/layer.js";
import { MessageSchema } from "../entities/message.js";
import type { Message } from "../entities/message.js";
import { NodeSchema } from "../entities/node.js";
import type { Node } from "../entities/node.js";
import { PerspectiveSchema } from "../entities/perspective.js";
import type { Perspective } from "../entities/perspective.js";
import { ProcessStageSchema } from "../entities/process-stage.js";
import type { ProcessStage } from "../entities/process-stage.js";
import { ProcessSchema } from "../entities/process.js";
import type { Process } from "../entities/process.js";
import { ProviderAssociationSchema } from "../entities/provider-association.js";
import type { ProviderAssociation } from "../entities/provider-association.js";
import { ProviderSchema } from "../entities/provider.js";
import type { Provider } from "../entities/provider.js";
import { SceneSchema } from "../entities/scene.js";
import type { Scene } from "../entities/scene.js";
import { StepSchema } from "../entities/step.js";
import type { Step } from "../entities/step.js";
import { StoryRouteSchema } from "../entities/story-route.js";
import type { StoryRoute } from "../entities/story-route.js";
import { StoryWaypointSchema } from "../entities/story-waypoint.js";
import type { StoryWaypoint } from "../entities/story-waypoint.js";
import { ValueStreamSchema } from "../entities/value-stream.js";
import type { ValueStream } from "../entities/value-stream.js";

// --- Domains ---

export const domains: Domain[] = [
	{
		id: "dom-customer",
		label: "Customer",
		description: "Customer-facing capabilities",
		tags: ["retail"],
	},
	{
		id: "dom-accounts",
		label: "Accounts",
		description: "Account lifecycle and servicing",
		tags: ["core"],
	},
	{
		id: "dom-payments",
		label: "Payments",
		description: "Payment processing and money movement",
		tags: ["core"],
	},
	{
		id: "dom-risk-identity",
		label: "Risk & Identity",
		description: "Risk management, identity verification, and fraud prevention",
		tags: ["risk", "security"],
	},
	{
		id: "dom-orchestration",
		label: "Orchestration & Control",
		description: "Payment orchestration, routing, and policy engines",
		tags: ["orchestration"],
	},
	{
		id: "dom-channels",
		label: "Channels & Experience",
		description: "Digital channels, interfaces, and user experiences",
		tags: ["channels", "ux"],
	},
	{
		id: "dom-networks",
		label: "Networks & Schemes",
		description: "Card networks, payment schemes, and interchange",
		tags: ["networks", "schemes"],
	},
	{
		id: "dom-rails",
		label: "Rails & Money Movement",
		description: "Payment rails, clearing, and settlement",
		tags: ["rails", "settlement"],
	},
	{
		id: "dom-data-rewards",
		label: "Data & Rewards",
		description: "Analytics, rewards, loyalty, and behavioral data",
		tags: ["data", "rewards"],
	},
].map((d) => DomainSchema.parse(d));

// --- Capabilities ---

export const capabilities: Capability[] = [
	{
		id: "cap-onboarding",
		domainId: "dom-customer",
		label: "Customer Onboarding",
		description: "New customer identity verification and profile creation",
		nodeIds: ["n-customer", "n-mobile-app", "n-api-gateway", "n-identity-svc", "n-risk-svc"],
		edgeIds: ["e-cust-app", "e-app-gw", "e-gw-identity", "e-identity-risk"],
		journeyIds: ["j-open-savings"],
		tags: ["kyc", "onboarding"],
	},
	{
		id: "cap-auth",
		domainId: "dom-customer",
		label: "Authentication",
		description: "User authentication and session management",
		nodeIds: ["n-customer", "n-mobile-app", "n-api-gateway", "n-identity-svc"],
		edgeIds: ["e-cust-app", "e-app-gw", "e-gw-identity"],
		journeyIds: [],
		tags: ["auth", "security"],
	},
	{
		id: "cap-account-opening",
		domainId: "dom-accounts",
		label: "Account Opening",
		description: "New account creation and ledger setup",
		nodeIds: ["n-api-gateway", "n-account-svc", "n-core-ledger", "n-notification-svc"],
		edgeIds: ["e-gw-account", "e-account-ledger", "e-account-notify"],
		journeyIds: ["j-open-savings"],
		tags: ["accounts", "origination"],
	},
	{
		id: "cap-account-servicing",
		domainId: "dom-accounts",
		label: "Account Servicing",
		description: "Ongoing account management and maintenance",
		nodeIds: ["n-account-svc", "n-core-ledger", "n-notification-svc"],
		edgeIds: ["e-account-ledger", "e-account-notify"],
		journeyIds: [],
		tags: ["accounts", "servicing"],
	},
	{
		id: "cap-money-movement",
		domainId: "dom-payments",
		label: "Money Movement",
		description: "Internal and external fund transfers",
		nodeIds: ["n-api-gateway", "n-payment-orch", "n-payment-rail", "n-core-ledger"],
		edgeIds: ["e-gw-payment", "e-payment-rail", "e-payment-ledger"],
		journeyIds: [],
		tags: ["payments", "transfers"],
	},
	{
		id: "cap-payment-processing",
		domainId: "dom-payments",
		label: "Payment Processing",
		description: "Payment authorization, clearing, and settlement",
		nodeIds: ["n-payment-orch", "n-payment-rail", "n-risk-svc", "n-core-ledger"],
		edgeIds: ["e-payment-rail", "e-payment-ledger", "e-risk-payment"],
		journeyIds: [],
		tags: ["payments", "processing"],
	},
	{
		id: "cap-fraud-detection",
		domainId: "dom-risk-identity",
		label: "Fraud Detection",
		description: "Real-time fraud detection and prevention across payment and account events",
		nodeIds: ["n-fraud-engine", "n-risk-svc", "n-aml-screening"],
		edgeIds: ["e-orch-fraud", "e-fraud-aml"],
		journeyIds: [],
		tags: ["fraud", "risk", "real-time"],
	},
	{
		id: "cap-identity-verification",
		domainId: "dom-risk-identity",
		label: "Identity Verification",
		description: "Customer identity verification using KYC, biometrics, and document analysis",
		nodeIds: ["n-kyc-provider", "n-biometric-auth", "n-identity-svc"],
		edgeIds: ["e-identity-kyc", "e-identity-biometric"],
		journeyIds: [],
		tags: ["identity", "kyc", "biometrics"],
	},
	{
		id: "cap-payment-orchestration",
		domainId: "dom-orchestration",
		label: "Payment Orchestration",
		description: "Intelligent routing and orchestration of payment flows across rails and networks",
		nodeIds: ["n-payment-router", "n-workflow-engine", "n-payment-orch"],
		edgeIds: ["e-router-workflow", "e-router-orch"],
		journeyIds: [],
		tags: ["orchestration", "routing"],
	},
	{
		id: "cap-policy-engine",
		domainId: "dom-orchestration",
		label: "Policy Engine",
		description:
			"Centralized policy evaluation for transaction limits, compliance, and agent controls",
		nodeIds: ["n-policy-engine", "n-agent-policy"],
		edgeIds: ["e-agent-policy", "e-policy-router"],
		journeyIds: [],
		tags: ["policy", "compliance", "controls"],
	},
	{
		id: "cap-wallet-management",
		domainId: "dom-channels",
		label: "Wallet Management",
		description: "Digital wallet provisioning, tokenization, and payment credential management",
		nodeIds: ["n-mobile-app", "n-web-app", "n-merchant-checkout"],
		edgeIds: ["e-web-gw", "e-merchant-gw"],
		journeyIds: [],
		tags: ["wallet", "tokenization", "channels"],
	},
	{
		id: "cap-digital-channels",
		domainId: "dom-channels",
		label: "Digital Channels",
		description: "Multi-channel digital banking interfaces including web, mobile, and agent",
		nodeIds: ["n-web-app", "n-mobile-app", "n-merchant-checkout", "n-agent-interface"],
		edgeIds: ["e-web-gw", "e-merchant-gw", "e-agent-interface-gw"],
		journeyIds: [],
		tags: ["channels", "digital", "omnichannel"],
	},
	{
		id: "cap-network-authorization",
		domainId: "dom-networks",
		label: "Network Authorization",
		description: "Card network authorization, scheme routing, and interchange management",
		nodeIds: ["n-visa-network", "n-mastercard-network", "n-card-processor"],
		edgeIds: ["e-processor-visa", "e-processor-mastercard"],
		journeyIds: [],
		tags: ["networks", "authorization", "interchange"],
	},
	{
		id: "cap-settlement",
		domainId: "dom-rails",
		label: "Settlement & Clearing",
		description: "End-of-day settlement, clearing, and reconciliation across payment rails",
		nodeIds: ["n-clearing-house", "n-settlement-engine", "n-core-ledger"],
		edgeIds: ["e-clearing-settlement", "e-settlement-ledger"],
		journeyIds: [],
		tags: ["settlement", "clearing", "reconciliation"],
	},
	{
		id: "cap-rewards-processing",
		domainId: "dom-data-rewards",
		label: "Rewards Processing",
		description: "Points accrual, redemption, and loyalty program management",
		nodeIds: ["n-rewards-engine", "n-analytics-platform"],
		edgeIds: ["e-event-rewards"],
		journeyIds: [],
		tags: ["rewards", "loyalty", "points"],
	},
	{
		id: "cap-analytics",
		domainId: "dom-data-rewards",
		label: "Analytics & Insights",
		description: "Transaction analytics, behavioral insights, and reporting",
		nodeIds: ["n-analytics-platform", "n-data-warehouse", "n-event-bus"],
		edgeIds: ["e-event-analytics", "e-analytics-warehouse"],
		journeyIds: [],
		tags: ["analytics", "data", "insights"],
	},
].map((d) => CapabilitySchema.parse(d));

// --- Nodes ---

export const nodes: Node[] = [
	{
		id: "n-customer",
		type: "actor",
		label: "Customer",
		description: "Retail banking customer",
		tags: ["external"],
		layoutByPerspective: {
			"persp-landscape": { x: 0, y: 200 },
			"persp-architecture": { x: 0, y: 200 },
			"persp-process": { x: 0, y: 0 },
			"persp-journey": { x: 0, y: 0 },
			"persp-provider": { x: 0, y: 200 },
		},
	},
	{
		id: "n-mobile-app",
		type: "screen",
		label: "Mobile Banking App",
		description: "Customer-facing mobile application",
		tags: ["channel", "mobile"],
		layoutByPerspective: {
			"persp-landscape": { x: 300, y: 200 },
			"persp-architecture": { x: 300, y: 200 },
			"persp-process": { x: 300, y: 0 },
			"persp-journey": { x: 300, y: 0 },
			"persp-provider": { x: 300, y: 200 },
		},
	},
	{
		id: "n-api-gateway",
		type: "system",
		label: "API Gateway",
		description: "Central API gateway and routing layer",
		tags: ["infrastructure", "orchestration"],
		layoutByPerspective: {
			"persp-landscape": { x: 600, y: 200 },
			"persp-architecture": { x: 600, y: 200 },
			"persp-process": { x: 600, y: 0 },
			"persp-journey": { x: 600, y: 0 },
			"persp-provider": { x: 600, y: 200 },
		},
	},
	{
		id: "n-identity-svc",
		type: "service",
		label: "Identity Service",
		description: "Identity verification and KYC processing",
		tags: ["identity", "kyc", "security"],
		layoutByPerspective: {
			"persp-landscape": { x: 950, y: 0 },
			"persp-architecture": { x: 950, y: 0 },
			"persp-process": { x: 0, y: 150 },
			"persp-journey": { x: 0, y: 150 },
			"persp-provider": { x: 950, y: 0 },
		},
	},
	{
		id: "n-risk-svc",
		type: "service",
		label: "Risk & Decisioning",
		description: "Fraud detection, risk scoring, and policy evaluation",
		tags: ["risk", "fraud", "decisioning"],
		layoutByPerspective: {
			"persp-landscape": { x: 950, y: 150 },
			"persp-architecture": { x: 950, y: 150 },
			"persp-process": { x: 300, y: 150 },
			"persp-journey": { x: 300, y: 150 },
			"persp-provider": { x: 950, y: 150 },
		},
	},
	{
		id: "n-account-svc",
		type: "service",
		label: "Account Service",
		description: "Account lifecycle management",
		tags: ["accounts", "core"],
		layoutByPerspective: {
			"persp-landscape": { x: 950, y: 300 },
			"persp-architecture": { x: 950, y: 300 },
			"persp-process": { x: 600, y: 150 },
			"persp-journey": { x: 600, y: 150 },
			"persp-provider": { x: 950, y: 300 },
		},
	},
	{
		id: "n-core-ledger",
		type: "system",
		label: "Core Ledger",
		description: "Double-entry ledger and system of record",
		tags: ["core", "ledger", "system-of-record"],
		layoutByPerspective: {
			"persp-landscape": { x: 1300, y: 250 },
			"persp-architecture": { x: 1300, y: 250 },
			"persp-process": { x: 900, y: 100 },
			"persp-journey": { x: 900, y: 100 },
			"persp-provider": { x: 1300, y: 250 },
		},
	},
	{
		id: "n-notification-svc",
		type: "service",
		label: "Notification Service",
		description: "Customer notifications and alerts",
		tags: ["notifications", "messaging"],
		layoutByPerspective: {
			"persp-landscape": { x: 1300, y: 400 },
			"persp-architecture": { x: 1300, y: 400 },
			"persp-process": { x: 900, y: 250 },
			"persp-journey": { x: 900, y: 250 },
			"persp-provider": { x: 1300, y: 400 },
		},
	},
	{
		id: "n-payment-orch",
		type: "service",
		label: "Payment Orchestrator",
		description: "Payment routing and orchestration",
		tags: ["payments", "orchestration"],
		layoutByPerspective: {
			"persp-landscape": { x: 950, y: 450 },
			"persp-architecture": { x: 950, y: 450 },
			"persp-process": { x: 300, y: 300 },
			"persp-provider": { x: 950, y: 450 },
		},
	},
	{
		id: "n-payment-rail",
		type: "system",
		label: "Payment Rail",
		description: "External payment network interface (ACH, RTP, FedNow)",
		tags: ["payments", "rails", "external"],
		layoutByPerspective: {
			"persp-landscape": { x: 1300, y: 500 },
			"persp-architecture": { x: 1300, y: 500 },
			"persp-process": { x: 600, y: 300 },
			"persp-provider": { x: 1300, y: 500 },
		},
	},
	// --- Channels & Experience ---
	{
		id: "n-web-app",
		type: "screen",
		label: "Web Banking App",
		description: "Customer-facing web banking application",
		tags: ["channel", "web"],
	},
	{
		id: "n-merchant-checkout",
		type: "screen",
		label: "Merchant Checkout",
		description: "Merchant-facing checkout and payment acceptance interface",
		tags: ["channel", "merchant", "checkout"],
	},
	{
		id: "n-agent-interface",
		type: "screen",
		label: "AI Agent Interface",
		description: "Conversational interface for AI-driven banking interactions",
		tags: ["channel", "agent", "ai"],
	},
	// --- Orchestration & Control ---
	{
		id: "n-payment-router",
		type: "service",
		label: "Payment Router",
		description:
			"Intelligent payment routing across rails and networks based on cost, speed, and availability",
		tags: ["orchestration", "routing", "payments"],
	},
	{
		id: "n-policy-engine",
		type: "service",
		label: "Bank Policy Engine",
		description:
			"Centralized policy evaluation for transaction limits, compliance rules, and agent permissions",
		tags: ["policy", "compliance", "controls"],
	},
	{
		id: "n-workflow-engine",
		type: "service",
		label: "Workflow Engine",
		description: "Orchestrates multi-step payment and account workflows with state management",
		tags: ["orchestration", "workflow", "state-machine"],
	},
	// --- Risk & Identity ---
	{
		id: "n-fraud-engine",
		type: "service",
		label: "Fraud Detection Engine",
		description:
			"Real-time fraud scoring using ML models, velocity checks, and behavioral analysis",
		tags: ["fraud", "ml", "risk", "real-time"],
	},
	{
		id: "n-kyc-provider",
		type: "service",
		label: "KYC Provider",
		description: "Know Your Customer identity verification and document validation",
		tags: ["kyc", "identity", "compliance"],
	},
	{
		id: "n-aml-screening",
		type: "service",
		label: "AML Screening",
		description: "Anti-money laundering screening against sanctions lists and PEP databases",
		tags: ["aml", "compliance", "screening"],
	},
	{
		id: "n-biometric-auth",
		type: "service",
		label: "Biometric Authentication",
		description: "Fingerprint, face, and voice-based authentication for secure access",
		tags: ["biometrics", "authentication", "security"],
	},
	// --- Networks & Schemes ---
	{
		id: "n-visa-network",
		type: "system",
		label: "Visa Network",
		description: "Visa payment network for card authorization, clearing, and settlement",
		tags: ["network", "cards", "visa", "external"],
	},
	{
		id: "n-mastercard-network",
		type: "system",
		label: "Mastercard Network",
		description: "Mastercard payment network for card authorization, clearing, and settlement",
		tags: ["network", "cards", "mastercard", "external"],
	},
	{
		id: "n-card-processor",
		type: "service",
		label: "Card Processor / Issuer Processor",
		description: "Card issuing, processing, and BIN management for debit and credit programs",
		tags: ["cards", "issuing", "processing"],
	},
	// --- Rails & Money Movement ---
	{
		id: "n-ach-rail",
		type: "system",
		label: "ACH Network",
		description: "Automated Clearing House network for batch and same-day transfers",
		tags: ["rail", "ach", "batch", "external"],
	},
	{
		id: "n-rtp-rail",
		type: "system",
		label: "RTP Network",
		description: "Real-Time Payments network operated by The Clearing House",
		tags: ["rail", "rtp", "real-time", "external"],
	},
	{
		id: "n-fednow-rail",
		type: "system",
		label: "FedNow Service",
		description: "Federal Reserve instant payment service for real-time gross settlement",
		tags: ["rail", "fednow", "real-time", "federal", "external"],
	},
	{
		id: "n-wire-rail",
		type: "system",
		label: "Wire Transfer Network",
		description: "Fedwire and CHIPS networks for high-value wire transfers",
		tags: ["rail", "wire", "high-value", "external"],
	},
	{
		id: "n-zelle-rail",
		type: "system",
		label: "Zelle Network",
		description: "Zelle P2P payment network for person-to-person transfers",
		tags: ["rail", "zelle", "p2p", "external"],
	},
	{
		id: "n-clearing-house",
		type: "service",
		label: "Clearing House",
		description: "Clearing and netting service for multi-rail transaction reconciliation",
		tags: ["clearing", "reconciliation", "settlement"],
	},
	{
		id: "n-settlement-engine",
		type: "service",
		label: "Settlement Engine",
		description: "End-of-day settlement processing and position management",
		tags: ["settlement", "position", "reconciliation"],
	},
	// --- Core / System of Record (expanded) ---
	{
		id: "n-deposit-system",
		type: "system",
		label: "Deposit System",
		description: "Core deposit account system managing DDA, savings, and CD products",
		tags: ["core", "deposits", "system-of-record"],
	},
	{
		id: "n-loan-system",
		type: "system",
		label: "Loan System",
		description: "Loan origination and servicing system for consumer and commercial lending",
		tags: ["core", "lending", "system-of-record"],
	},
	{
		id: "n-gl-system",
		type: "system",
		label: "General Ledger",
		description: "General ledger and financial accounting system of record",
		tags: ["core", "accounting", "system-of-record"],
	},
	// --- Data & Rewards ---
	{
		id: "n-analytics-platform",
		type: "system",
		label: "Analytics Platform",
		description:
			"Real-time and batch analytics for transaction monitoring and business intelligence",
		tags: ["analytics", "bi", "monitoring"],
	},
	{
		id: "n-rewards-engine",
		type: "service",
		label: "Rewards Engine",
		description: "Points accrual, redemption, and loyalty program management engine",
		tags: ["rewards", "loyalty", "points"],
	},
	{
		id: "n-data-warehouse",
		type: "system",
		label: "Data Warehouse",
		description: "Enterprise data warehouse for historical analytics and regulatory reporting",
		tags: ["data", "warehouse", "reporting"],
	},
	{
		id: "n-event-bus",
		type: "system",
		label: "Event Bus / Message Broker",
		description: "Event-driven messaging infrastructure for async communication across services",
		tags: ["events", "messaging", "infrastructure", "async"],
	},
	// --- Agentic Commerce ---
	{
		id: "n-ai-agent",
		type: "actor",
		label: "Personal AI Agent",
		description:
			"Autonomous AI agent acting on behalf of a customer for payments and banking tasks",
		tags: ["agent", "ai", "autonomous"],
	},
	{
		id: "n-agent-policy",
		type: "service",
		label: "Agent Policy Manager",
		description: "Policy and permission management for AI agent actions and spending limits",
		tags: ["agent", "policy", "controls"],
	},
	// --- Internal Components (C4 Level 3) ---
	{
		id: "n-fraud-scoring",
		type: "service",
		label: "Scoring Engine",
		description: "ML-based fraud scoring model execution",
		parentNodeId: "n-fraud-engine",
		tags: ["component", "ml"],
	},
	{
		id: "n-fraud-rules",
		type: "service",
		label: "Rules Engine",
		description: "Configurable fraud rule evaluation",
		parentNodeId: "n-fraud-engine",
		tags: ["component", "rules"],
	},
	{
		id: "n-fraud-velocity",
		type: "service",
		label: "Velocity Tracker",
		description: "Transaction velocity monitoring and limit enforcement",
		parentNodeId: "n-fraud-engine",
		tags: ["component", "monitoring"],
	},
	{
		id: "n-orch-router",
		type: "service",
		label: "Payment Router",
		description: "Routes payments to the appropriate network or rail",
		parentNodeId: "n-payment-orch",
		tags: ["component", "routing"],
	},
	{
		id: "n-orch-saga",
		type: "service",
		label: "Saga Coordinator",
		description: "Manages distributed transaction orchestration",
		parentNodeId: "n-payment-orch",
		tags: ["component", "orchestration"],
	},
	{
		id: "n-orch-retry",
		type: "service",
		label: "Retry Handler",
		description: "Handles failed payment retries and compensation",
		parentNodeId: "n-payment-orch",
		tags: ["component", "reliability"],
	},
	{
		id: "n-ledger-journal",
		type: "service",
		label: "Journal Writer",
		description: "Double-entry journal posting engine",
		parentNodeId: "n-core-ledger",
		tags: ["component", "accounting"],
	},
	{
		id: "n-ledger-balance",
		type: "service",
		label: "Balance Calculator",
		description: "Real-time balance computation and validation",
		parentNodeId: "n-core-ledger",
		tags: ["component", "accounting"],
	},
	{
		id: "n-ledger-reconciler",
		type: "service",
		label: "Reconciliation Engine",
		description: "End-of-day reconciliation and GL posting",
		parentNodeId: "n-core-ledger",
		tags: ["component", "accounting"],
	},
].map((d) => NodeSchema.parse(d));

// --- Deployment metadata enrichment ---
const deploymentMap: Record<string, { region: string; tier: string; runtime: string }> = {
	"n-api-gateway": { region: "us-east-1", tier: "edge", runtime: "AWS API Gateway" },
	"n-identity-svc": { region: "us-east-1", tier: "application", runtime: "EKS" },
	"n-risk-svc": { region: "us-east-1", tier: "application", runtime: "EKS" },
	"n-account-svc": { region: "us-east-1", tier: "application", runtime: "EKS" },
	"n-payment-orch": { region: "us-east-1", tier: "application", runtime: "EKS" },
	"n-payment-router": { region: "us-east-1", tier: "application", runtime: "EKS" },
	"n-payment-rail": { region: "us-east-1", tier: "infrastructure", runtime: "Managed Service" },
	"n-core-ledger": { region: "us-east-1", tier: "data", runtime: "RDS PostgreSQL" },
	"n-deposit-system": { region: "us-east-1", tier: "data", runtime: "RDS PostgreSQL" },
	"n-loan-system": { region: "us-east-1", tier: "data", runtime: "RDS PostgreSQL" },
	"n-gl-system": { region: "us-east-1", tier: "data", runtime: "RDS PostgreSQL" },
	"n-notification-svc": { region: "us-east-1", tier: "application", runtime: "Lambda" },
	"n-fraud-engine": { region: "us-east-1", tier: "application", runtime: "EKS" },
	"n-aml-screening": { region: "us-east-1", tier: "application", runtime: "EKS" },
	"n-kyc-provider": { region: "us-east-1", tier: "external", runtime: "Third Party" },
	"n-biometric-auth": { region: "us-east-1", tier: "external", runtime: "Third Party" },
	"n-policy-engine": { region: "us-east-1", tier: "application", runtime: "EKS" },
	"n-workflow-engine": { region: "us-east-1", tier: "application", runtime: "Step Functions" },
	"n-card-processor": { region: "us-east-1", tier: "application", runtime: "EKS" },
	"n-clearing-house": { region: "us-east-1", tier: "infrastructure", runtime: "Managed Service" },
	"n-settlement-engine": { region: "us-east-1", tier: "application", runtime: "EKS" },
	"n-rewards-engine": { region: "us-east-1", tier: "application", runtime: "Lambda" },
	"n-analytics-platform": { region: "us-east-1", tier: "data", runtime: "Redshift" },
	"n-data-warehouse": { region: "us-east-1", tier: "data", runtime: "S3 + Glue" },
	"n-event-bus": { region: "us-east-1", tier: "infrastructure", runtime: "EventBridge" },
	"n-visa-network": { region: "global", tier: "external", runtime: "Visa Network" },
	"n-mastercard-network": { region: "global", tier: "external", runtime: "Mastercard Network" },
	"n-ach-rail": { region: "us", tier: "external", runtime: "Federal Reserve" },
	"n-rtp-rail": { region: "us", tier: "external", runtime: "TCH" },
	"n-fednow-rail": { region: "us", tier: "external", runtime: "Federal Reserve" },
	"n-wire-rail": { region: "us", tier: "external", runtime: "Fedwire" },
	"n-zelle-rail": { region: "us", tier: "external", runtime: "EWS" },
};

for (const node of nodes) {
	const deployment = deploymentMap[node.id];
	if (deployment) {
		(node.metadata as Record<string, unknown>).deployment = deployment;
	}
}

// --- Edges ---

export const edges: Edge[] = [
	{
		id: "e-cust-app",
		sourceNodeId: "n-customer",
		targetNodeId: "n-mobile-app",
		type: "user_interaction",
		label: "uses",
	},
	{
		id: "e-app-gw",
		sourceNodeId: "n-mobile-app",
		targetNodeId: "n-api-gateway",
		type: "api_call",
		label: "requests",
	},
	{
		id: "e-gw-identity",
		sourceNodeId: "n-api-gateway",
		targetNodeId: "n-identity-svc",
		type: "service_call",
		label: "verify identity",
	},
	{
		id: "e-gw-account",
		sourceNodeId: "n-api-gateway",
		targetNodeId: "n-account-svc",
		type: "service_call",
		label: "manage account",
	},
	{
		id: "e-gw-payment",
		sourceNodeId: "n-api-gateway",
		targetNodeId: "n-payment-orch",
		type: "service_call",
		label: "initiate payment",
	},
	{
		id: "e-identity-risk",
		sourceNodeId: "n-identity-svc",
		targetNodeId: "n-risk-svc",
		type: "dependency",
		label: "risk check",
	},
	{
		id: "e-risk-payment",
		sourceNodeId: "n-risk-svc",
		targetNodeId: "n-payment-orch",
		type: "decision_result",
		label: "risk decision",
	},
	{
		id: "e-account-ledger",
		sourceNodeId: "n-account-svc",
		targetNodeId: "n-core-ledger",
		type: "ledger_posting",
		label: "post entries",
	},
	{
		id: "e-account-notify",
		sourceNodeId: "n-account-svc",
		targetNodeId: "n-notification-svc",
		type: "event",
		label: "notify",
	},
	{
		id: "e-payment-rail",
		sourceNodeId: "n-payment-orch",
		targetNodeId: "n-payment-rail",
		type: "rail_execution",
		label: "execute",
	},
	{
		id: "e-payment-ledger",
		sourceNodeId: "n-payment-orch",
		targetNodeId: "n-core-ledger",
		type: "ledger_posting",
		label: "post entries",
	},
	// --- Channel → Gateway ---
	{
		id: "e-web-gw",
		sourceNodeId: "n-web-app",
		targetNodeId: "n-api-gateway",
		type: "api_call",
		label: "requests",
	},
	{
		id: "e-merchant-gw",
		sourceNodeId: "n-merchant-checkout",
		targetNodeId: "n-api-gateway",
		type: "api_call",
		label: "payment request",
	},
	{
		id: "e-agent-interface-gw",
		sourceNodeId: "n-agent-interface",
		targetNodeId: "n-api-gateway",
		type: "api_call",
		label: "agent request",
	},
	{
		id: "e-cust-web",
		sourceNodeId: "n-customer",
		targetNodeId: "n-web-app",
		type: "user_interaction",
		label: "uses",
	},
	// --- Agentic Commerce ---
	{
		id: "e-agent-interface-agent",
		sourceNodeId: "n-ai-agent",
		targetNodeId: "n-agent-interface",
		type: "user_interaction",
		label: "interacts via",
	},
	{
		id: "e-agent-policy",
		sourceNodeId: "n-ai-agent",
		targetNodeId: "n-agent-policy",
		type: "service_call",
		label: "check permissions",
	},
	{
		id: "e-policy-router",
		sourceNodeId: "n-agent-policy",
		targetNodeId: "n-payment-router",
		type: "service_call",
		label: "authorized request",
	},
	// --- Gateway → Orchestration ---
	{
		id: "e-gw-router",
		sourceNodeId: "n-api-gateway",
		targetNodeId: "n-payment-router",
		type: "service_call",
		label: "route payment",
	},
	{
		id: "e-gw-policy",
		sourceNodeId: "n-api-gateway",
		targetNodeId: "n-policy-engine",
		type: "service_call",
		label: "evaluate policy",
	},
	{
		id: "e-router-workflow",
		sourceNodeId: "n-payment-router",
		targetNodeId: "n-workflow-engine",
		type: "service_call",
		label: "orchestrate flow",
	},
	{
		id: "e-router-orch",
		sourceNodeId: "n-payment-router",
		targetNodeId: "n-payment-orch",
		type: "service_call",
		label: "delegate execution",
	},
	// --- Orchestration → Risk ---
	{
		id: "e-orch-fraud",
		sourceNodeId: "n-payment-orch",
		targetNodeId: "n-fraud-engine",
		type: "service_call",
		label: "fraud check",
	},
	{
		id: "e-fraud-aml",
		sourceNodeId: "n-fraud-engine",
		targetNodeId: "n-aml-screening",
		type: "dependency",
		label: "AML screen",
	},
	// --- Identity ---
	{
		id: "e-identity-kyc",
		sourceNodeId: "n-identity-svc",
		targetNodeId: "n-kyc-provider",
		type: "service_call",
		label: "verify identity",
	},
	{
		id: "e-identity-biometric",
		sourceNodeId: "n-identity-svc",
		targetNodeId: "n-biometric-auth",
		type: "service_call",
		label: "biometric check",
	},
	// --- Orchestration → Networks ---
	{
		id: "e-orch-processor",
		sourceNodeId: "n-payment-orch",
		targetNodeId: "n-card-processor",
		type: "service_call",
		label: "process card",
	},
	{
		id: "e-processor-visa",
		sourceNodeId: "n-card-processor",
		targetNodeId: "n-visa-network",
		type: "rail_execution",
		label: "authorize",
	},
	{
		id: "e-processor-mastercard",
		sourceNodeId: "n-card-processor",
		targetNodeId: "n-mastercard-network",
		type: "rail_execution",
		label: "authorize",
	},
	// --- Rails ---
	{
		id: "e-router-ach",
		sourceNodeId: "n-payment-router",
		targetNodeId: "n-ach-rail",
		type: "rail_execution",
		label: "ACH transfer",
	},
	{
		id: "e-router-rtp",
		sourceNodeId: "n-payment-router",
		targetNodeId: "n-rtp-rail",
		type: "rail_execution",
		label: "RTP transfer",
	},
	{
		id: "e-router-fednow",
		sourceNodeId: "n-payment-router",
		targetNodeId: "n-fednow-rail",
		type: "rail_execution",
		label: "FedNow transfer",
	},
	{
		id: "e-router-wire",
		sourceNodeId: "n-payment-router",
		targetNodeId: "n-wire-rail",
		type: "rail_execution",
		label: "wire transfer",
	},
	{
		id: "e-router-zelle",
		sourceNodeId: "n-payment-router",
		targetNodeId: "n-zelle-rail",
		type: "rail_execution",
		label: "Zelle transfer",
	},
	// --- Settlement ---
	{
		id: "e-clearing-settlement",
		sourceNodeId: "n-clearing-house",
		targetNodeId: "n-settlement-engine",
		type: "service_call",
		label: "net positions",
	},
	{
		id: "e-settlement-ledger",
		sourceNodeId: "n-settlement-engine",
		targetNodeId: "n-core-ledger",
		type: "ledger_posting",
		label: "post settlement",
	},
	{
		id: "e-settlement-gl",
		sourceNodeId: "n-settlement-engine",
		targetNodeId: "n-gl-system",
		type: "ledger_posting",
		label: "GL entries",
	},
	// --- Core systems ---
	{
		id: "e-ledger-deposit",
		sourceNodeId: "n-core-ledger",
		targetNodeId: "n-deposit-system",
		type: "dependency",
		label: "deposit positions",
	},
	{
		id: "e-ledger-loan",
		sourceNodeId: "n-core-ledger",
		targetNodeId: "n-loan-system",
		type: "dependency",
		label: "loan positions",
	},
	{
		id: "e-ledger-gl",
		sourceNodeId: "n-core-ledger",
		targetNodeId: "n-gl-system",
		type: "ledger_posting",
		label: "GL sync",
	},
	// --- Event Bus ---
	{
		id: "e-ledger-event",
		sourceNodeId: "n-core-ledger",
		targetNodeId: "n-event-bus",
		type: "event",
		label: "transaction events",
	},
	{
		id: "e-payment-event",
		sourceNodeId: "n-payment-orch",
		targetNodeId: "n-event-bus",
		type: "event",
		label: "payment events",
	},
	// --- Event Bus → Data & Rewards ---
	{
		id: "e-event-analytics",
		sourceNodeId: "n-event-bus",
		targetNodeId: "n-analytics-platform",
		type: "event",
		label: "stream events",
	},
	{
		id: "e-event-rewards",
		sourceNodeId: "n-event-bus",
		targetNodeId: "n-rewards-engine",
		type: "event",
		label: "transaction events",
	},
	{
		id: "e-analytics-warehouse",
		sourceNodeId: "n-analytics-platform",
		targetNodeId: "n-data-warehouse",
		type: "dependency",
		label: "persist analytics",
	},
].map((d) => EdgeSchema.parse(d));

// --- Journey ---

export const steps: Step[] = [
	{
		id: "s-1",
		journeyId: "j-open-savings",
		sequenceNumber: 0,
		stepType: "screen",
		focusTargets: [
			{ type: "node", targetId: "n-customer" },
			{ type: "node", targetId: "n-mobile-app" },
		],
		capabilityId: "cap-onboarding",
		title: "Launch & Authenticate",
		narrative: "Customer opens the mobile banking app and authenticates.",
		actor: "Customer",
		expectedAction: "Open app, enter credentials",
		transitions: [{ targetStepId: "s-2", label: "Authenticated" }],
		sceneId: "sc-1",
	},
	{
		id: "s-2",
		journeyId: "j-open-savings",
		sequenceNumber: 1,
		stepType: "screen",
		focusTargets: [{ type: "node", targetId: "n-mobile-app" }],
		capabilityId: "cap-onboarding",
		title: "Fill Application",
		narrative: "Customer enters personal information and selects savings product.",
		actor: "Customer",
		expectedAction: "Complete application form",
		transitions: [{ targetStepId: "s-3", label: "Submit" }],
		sceneId: "sc-2",
	},
	{
		id: "s-3",
		journeyId: "j-open-savings",
		sequenceNumber: 2,
		stepType: "info",
		focusTargets: [
			{ type: "node", targetId: "n-identity-svc" },
			{ type: "edge", targetId: "e-gw-identity" },
		],
		capabilityId: "cap-onboarding",
		title: "Verifying Identity",
		narrative:
			"System verifies customer identity through KYC provider. Customer sees a processing screen.",
		actor: "System",
		expectedAction: "Verify identity documents and data",
		transitions: [
			{ targetStepId: "s-4", label: "Verified", condition: "KYC passed" },
			{ targetStepId: "s-3e", label: "Failed", condition: "KYC failed" },
		],
		sceneId: "sc-3",
		evidenceRefIds: ["ev-kyc-policy"],
	},
	{
		id: "s-3e",
		journeyId: "j-open-savings",
		sequenceNumber: 3,
		stepType: "error",
		focusTargets: [{ type: "node", targetId: "n-mobile-app" }],
		capabilityId: "cap-onboarding",
		title: "Verification Failed",
		narrative:
			"Identity verification did not pass. Customer is shown an error with options to retry or contact support.",
		actor: "Customer",
		expectedAction: "Retry verification or contact support",
		transitions: [{ targetStepId: "s-2", label: "Retry" }],
	},
	{
		id: "s-4",
		journeyId: "j-open-savings",
		sequenceNumber: 4,
		stepType: "info",
		focusTargets: [
			{ type: "node", targetId: "n-risk-svc" },
			{ type: "edge", targetId: "e-identity-risk" },
		],
		capabilityId: "cap-onboarding",
		title: "Risk Assessment",
		narrative: "System runs risk, fraud, and compliance checks.",
		actor: "System",
		expectedAction: "Evaluate risk score and policy compliance",
		transitions: [
			{ targetStepId: "s-5", label: "Approved", condition: "Risk acceptable" },
			{ targetStepId: "s-4r", label: "Review", condition: "Manual review required" },
		],
		sceneId: "sc-4",
	},
	{
		id: "s-4r",
		journeyId: "j-open-savings",
		sequenceNumber: 5,
		stepType: "info",
		focusTargets: [{ type: "node", targetId: "n-mobile-app" }],
		capabilityId: "cap-onboarding",
		title: "Under Review",
		narrative: "Application requires manual review. Customer is informed they will be contacted.",
		actor: "System",
		expectedAction: "Notify customer of pending review",
		transitions: [],
	},
	{
		id: "s-5",
		journeyId: "j-open-savings",
		sequenceNumber: 6,
		stepType: "screen",
		focusTargets: [
			{ type: "node", targetId: "n-account-svc" },
			{ type: "node", targetId: "n-core-ledger" },
			{ type: "edge", targetId: "e-account-ledger" },
		],
		capabilityId: "cap-account-opening",
		title: "Account Creation",
		narrative: "Account is created in the system of record and ledger entries are posted.",
		actor: "System",
		expectedAction: "Create account, post opening ledger entries",
		transitions: [{ targetStepId: "s-6", label: "Created" }],
		sceneId: "sc-5",
		evidenceRefIds: ["ev-account-reg"],
	},
	{
		id: "s-6",
		journeyId: "j-open-savings",
		sequenceNumber: 7,
		stepType: "confirmation",
		focusTargets: [
			{ type: "node", targetId: "n-notification-svc" },
			{ type: "node", targetId: "n-mobile-app" },
			{ type: "edge", targetId: "e-account-notify" },
		],
		capabilityId: "cap-account-opening",
		title: "Account Opened",
		narrative:
			"Customer receives confirmation that their savings account is open and ready to use.",
		actor: "System",
		expectedAction: "Display confirmation, send notifications",
		transitions: [],
		sceneId: "sc-6",
	},
].map((d) => StepSchema.parse(d));

export const journeys: Journey[] = [
	{
		id: "j-open-savings",
		label: "Open Savings Account",
		description: "End-to-end journey for a customer opening a new savings account.",
		entryCapabilityId: "cap-onboarding",
		capabilityIds: ["cap-onboarding", "cap-account-opening"],
		stepIds: ["s-1", "s-2", "s-3", "s-3e", "s-4", "s-4r", "s-5", "s-6"],
		tags: ["savings", "origination", "golden-path"],
	},
].map((d) => JourneySchema.parse(d));

// --- Perspectives ---

export const perspectives: Perspective[] = [
	{
		id: "persp-landscape",
		type: "landscape",
		label: "Landscape",
		description: "Broad terrain, domains, capabilities, and cross-domain relationships",
		defaultLayerId: "layer-default",
	},
	{
		id: "persp-journey",
		type: "journey",
		label: "Journey",
		description: "User journey step-by-step traversal",
		defaultLayerId: "layer-journey",
	},
	{
		id: "persp-process",
		type: "process",
		label: "Process",
		description: "Business process and workflow steps",
		defaultLayerId: "layer-process",
	},
	{
		id: "persp-architecture",
		type: "architecture",
		label: "Architecture",
		description: "System boundaries, services, and dependencies",
		defaultLayerId: "layer-default",
	},
	{
		id: "persp-system",
		type: "system",
		label: "System",
		description: "Scenario-scoped participating systems and interfaces",
		defaultLayerId: "layer-default",
	},
	{
		id: "persp-sequence",
		type: "sequence",
		label: "Sequence",
		description: "Runtime call flow between participating interfaces",
		defaultLayerId: "layer-default",
	},
].map((d) => PerspectiveSchema.parse(d));

// --- Layers ---

export const layers: Layer[] = [
	{
		id: "layer-default",
		label: "Default",
		eligibleNodeTypes: [],
		eligibleEdgeTypes: [],
		layoutStrategy: "auto",
	},
	{
		id: "layer-process",
		label: "Process",
		eligibleNodeTypes: ["service", "system"],
		eligibleEdgeTypes: ["service_call", "ledger_posting", "event", "dependency", "decision_result"],
		layoutStrategy: "auto",
	},
	{
		id: "layer-journey",
		label: "Journey",
		eligibleNodeTypes: ["actor", "screen", "service", "system"],
		eligibleEdgeTypes: ["user_interaction", "api_call", "service_call", "ledger_posting", "event"],
		layoutStrategy: "manual",
	},
].map((d) => LayerSchema.parse(d));

// --- Scenes ---

export const scenes: Scene[] = [
	{
		id: "sc-1",
		stepId: "s-1",
		uiStateRef: "screen://account-opening/login",
		focusTargets: ["n-customer", "n-mobile-app"],
		instructionalCopy: "Customer opens the banking app and logs in with their credentials.",
	},
	{
		id: "sc-2",
		stepId: "s-2",
		uiStateRef: "screen://account-opening/application-form",
		focusTargets: ["n-mobile-app"],
		instructionalCopy:
			"Customer fills in personal details and selects the savings account product.",
	},
	{
		id: "sc-3",
		stepId: "s-3",
		uiStateRef: "screen://account-opening/identity-check",
		focusTargets: ["n-identity-svc"],
		instructionalCopy: "The system performs identity verification using the KYC provider.",
	},
	{
		id: "sc-4",
		stepId: "s-4",
		uiStateRef: "screen://account-opening/risk-check",
		focusTargets: ["n-risk-svc"],
		instructionalCopy: "Risk and compliance checks are performed against fraud and policy rules.",
	},
	{
		id: "sc-5",
		stepId: "s-5",
		uiStateRef: "screen://account-opening/processing",
		focusTargets: ["n-account-svc", "n-core-ledger"],
		instructionalCopy: "The account is created and opening ledger entries are posted.",
	},
	{
		id: "sc-6",
		stepId: "s-6",
		uiStateRef: "screen://account-opening/confirmation",
		focusTargets: ["n-notification-svc", "n-mobile-app"],
		instructionalCopy: "Customer sees the confirmation screen and receives a welcome notification.",
	},
].map((d) => SceneSchema.parse(d));

// --- Annotations ---

export const annotations: Annotation[] = [
	{
		id: "ann-1",
		targetType: "node",
		targetId: "n-identity-svc",
		type: "research_note",
		content:
			"Identity verification may use document scanning, knowledge-based authentication, or third-party identity providers depending on risk tier.",
		author: "system",
		createdAt: "2026-01-15T10:00:00Z",
	},
	{
		id: "ann-2",
		targetType: "node",
		targetId: "n-risk-svc",
		type: "risk_note",
		content:
			"Risk decisioning evaluates fraud signals, identity confidence score, and regulatory compliance before allowing account creation.",
		author: "system",
		createdAt: "2026-01-15T10:00:00Z",
	},
	{
		id: "ann-3",
		targetType: "node",
		targetId: "n-core-ledger",
		type: "control_note",
		content:
			"All account opening transactions must create balanced double-entry ledger postings. Opening balance must match the initial deposit amount.",
		author: "system",
		createdAt: "2026-01-15T10:00:00Z",
	},
	{
		id: "ann-4",
		targetType: "node",
		targetId: "n-fraud-engine",
		type: "control_note",
		content:
			"Fraud engine must score all transactions in under 100ms. Scores above the configured threshold trigger automatic decline. Threshold is configurable per merchant category.",
		author: "system",
		createdAt: "2026-03-15T10:00:00Z",
	},
	{
		id: "ann-5",
		targetType: "node",
		targetId: "n-aml-screening",
		type: "risk_note",
		content:
			"AML screening checks against OFAC, EU, and UN sanctions lists. Positive matches require manual review before processing continues.",
		author: "system",
		createdAt: "2026-03-15T10:00:00Z",
	},
	{
		id: "ann-6",
		targetType: "node",
		targetId: "n-policy-engine",
		type: "control_note",
		content:
			"Policy engine evaluates issuer-specific rules including merchant category blocks, geographic restrictions, and time-of-day limits.",
		author: "system",
		createdAt: "2026-03-15T10:00:00Z",
	},
	{
		id: "ann-7",
		targetType: "node",
		targetId: "n-payment-orch",
		type: "risk_note",
		content:
			"Orchestration layer is the single point of authorization decision aggregation. All risk, policy, and balance decisions must converge here before network authorization.",
		author: "system",
		createdAt: "2026-03-15T10:00:00Z",
	},
].map((d) => AnnotationSchema.parse(d));

// --- Evidence Refs ---

export const evidenceRefs: EvidenceRef[] = [
	{
		id: "ev-kyc-policy",
		title: "KYC Policy Requirements",
		type: "document",
		summary: "Regulatory requirements for customer identity verification in account opening.",
		accessClassification: "internal",
		relatedEntityIds: ["n-identity-svc", "cap-onboarding"],
	},
	{
		id: "ev-account-reg",
		title: "Account Opening Regulatory Framework",
		type: "document",
		summary:
			"Regulatory framework governing savings account origination and initial deposit requirements.",
		accessClassification: "internal",
		relatedEntityIds: ["n-account-svc", "n-core-ledger", "cap-account-opening"],
	},
	{
		id: "ev-fraud-policy",
		title: "Fraud Detection Policy & Thresholds",
		type: "control_evidence",
		summary: "Documented fraud scoring thresholds, velocity limits, and escalation procedures.",
		accessClassification: "internal",
		relatedEntityIds: ["n-fraud-engine", "cp-fraud-score", "cp-fraud-check"],
	},
	{
		id: "ev-aml-compliance",
		title: "AML/BSA Compliance Program",
		type: "control_evidence",
		summary:
			"Anti-money laundering program documentation including sanctions screening procedures.",
		accessClassification: "restricted",
		relatedEntityIds: ["n-aml-screening", "cp-aml-screening"],
	},
	{
		id: "ev-sox-ledger",
		title: "SOX Ledger Controls",
		type: "control_evidence",
		summary:
			"Sarbanes-Oxley documentation for double-entry ledger controls and balance reconciliation.",
		accessClassification: "internal",
		relatedEntityIds: ["n-core-ledger", "cp-double-entry", "cp-balance-update"],
	},
].map((d) => EvidenceRefSchema.parse(d));

// --- Providers (payments vertical slice) ---

export const providers: Provider[] = [
	{
		id: "prov-visa",
		label: "Visa",
		description: "Global payment network and scheme operator",
		category: "scheme",
		tags: ["network", "cards", "global"],
	},
	{
		id: "prov-mastercard",
		label: "Mastercard",
		description: "Global payment network and scheme operator",
		category: "scheme",
		tags: ["network", "cards", "global"],
	},
	{
		id: "prov-rtp",
		label: "RTP",
		description: "Real-time payments network operated by The Clearing House",
		category: "rail",
		tags: ["real-time", "account-to-account"],
	},
	{
		id: "prov-fednow",
		label: "FedNow",
		description: "Federal Reserve instant payment service",
		category: "rail",
		tags: ["real-time", "account-to-account", "federal"],
	},
	{
		id: "prov-apple-pay",
		label: "Apple Pay",
		description: "Mobile wallet and payment interface",
		category: "wallet",
		tags: ["mobile", "wallet", "tokenization"],
	},
	{
		id: "prov-google-pay",
		label: "Google Pay",
		description: "Mobile wallet and payment interface for Android",
		category: "wallet",
		tags: ["mobile", "wallet", "tokenization"],
	},
	{
		id: "prov-paze",
		label: "Paze",
		description: "Bank-owned digital wallet for online checkout",
		category: "wallet",
		tags: ["wallet", "checkout", "bank-owned"],
	},
	{
		id: "prov-ach",
		label: "ACH",
		description: "Automated Clearing House network for batch and same-day transfers",
		category: "rail",
		tags: ["batch", "account-to-account"],
	},
	{
		id: "prov-zelle",
		label: "Zelle",
		description: "P2P payment network operated by Early Warning Services",
		category: "orchestration",
		tags: ["p2p", "real-time", "account-to-account"],
	},
	{
		id: "prov-wire",
		label: "Wire",
		description: "Fedwire and CHIPS high-value wire transfer networks",
		category: "rail",
		tags: ["high-value", "same-day"],
	},
	{
		id: "prov-feedzai",
		label: "Feedzai",
		description: "AI-powered fraud detection and financial crime prevention platform",
		category: "specialist",
		tags: ["fraud", "ml", "real-time"],
	},
	{
		id: "prov-socure",
		label: "Socure",
		description: "Digital identity verification and fraud prevention platform",
		category: "specialist",
		tags: ["identity", "kyc", "fraud"],
	},
	{
		id: "prov-plaid",
		label: "Plaid",
		description: "Financial data connectivity and account linking infrastructure",
		category: "infrastructure",
		tags: ["data", "connectivity", "account-linking"],
	},
	{
		id: "prov-stripe",
		label: "Stripe",
		description: "Payment processing and financial infrastructure platform",
		category: "orchestration",
		tags: ["payments", "processing", "developer"],
	},
	{
		id: "prov-marqeta",
		label: "Marqeta",
		description: "Modern card issuing and payment processing platform",
		category: "infrastructure",
		tags: ["cards", "issuing", "modern"],
	},
	{
		id: "prov-galileo",
		label: "Galileo",
		description: "Card processing and program management platform",
		category: "infrastructure",
		tags: ["cards", "processing", "program-management"],
	},
	{
		id: "prov-fis",
		label: "FIS",
		description: "Core banking and payment technology provider",
		category: "infrastructure",
		tags: ["core-banking", "payments", "enterprise"],
	},
	{
		id: "prov-fiserv",
		label: "Fiserv",
		description: "Financial services technology and core banking provider",
		category: "infrastructure",
		tags: ["core-banking", "payments", "enterprise"],
	},
	{
		id: "prov-jack-henry",
		label: "Jack Henry",
		description: "Core banking technology provider for community and mid-size banks",
		category: "infrastructure",
		tags: ["core-banking", "community", "mid-market"],
	},
	{
		id: "prov-infinant",
		label: "Infinant",
		description: "Banking-as-a-service orchestration and embedded finance platform",
		category: "orchestration",
		tags: ["baas", "embedded-finance", "orchestration"],
	},
].map((d) => ProviderSchema.parse(d));

// --- Provider Associations ---

export const providerAssociations: ProviderAssociation[] = [
	{
		id: "pa-visa-processing",
		providerId: "prov-visa",
		targetType: "capability",
		targetId: "cap-payment-processing",
		role: "scheme_operator",
	},
	{
		id: "pa-mastercard-processing",
		providerId: "prov-mastercard",
		targetType: "capability",
		targetId: "cap-payment-processing",
		role: "scheme_operator",
	},
	{
		id: "pa-rtp-movement",
		providerId: "prov-rtp",
		targetType: "capability",
		targetId: "cap-money-movement",
		role: "rail_provider",
	},
	{
		id: "pa-fednow-movement",
		providerId: "prov-fednow",
		targetType: "capability",
		targetId: "cap-money-movement",
		role: "rail_provider",
	},
	{
		id: "pa-apple-pay-app",
		providerId: "prov-apple-pay",
		targetType: "node",
		targetId: "n-mobile-app",
		role: "interface_provider",
	},
	{
		id: "pa-visa-rail",
		providerId: "prov-visa",
		targetType: "node",
		targetId: "n-payment-rail",
		role: "scheme_operator",
	},
	{
		id: "pa-rtp-vs",
		providerId: "prov-rtp",
		targetType: "value_stream",
		targetId: "vs-retail-payments",
		role: "rail_provider",
	},
	{
		id: "pa-fednow-vs",
		providerId: "prov-fednow",
		targetType: "value_stream",
		targetId: "vs-retail-payments",
		role: "rail_provider",
	},
	{
		id: "pa-google-pay-app",
		providerId: "prov-google-pay",
		targetType: "node",
		targetId: "n-mobile-app",
		role: "interface_provider",
	},
	{
		id: "pa-paze-checkout",
		providerId: "prov-paze",
		targetType: "node",
		targetId: "n-merchant-checkout",
		role: "interface_provider",
	},
	{
		id: "pa-ach-rail",
		providerId: "prov-ach",
		targetType: "node",
		targetId: "n-ach-rail",
		role: "rail_provider",
	},
	{
		id: "pa-zelle-rail",
		providerId: "prov-zelle",
		targetType: "node",
		targetId: "n-zelle-rail",
		role: "rail_provider",
	},
	{
		id: "pa-wire-rail",
		providerId: "prov-wire",
		targetType: "node",
		targetId: "n-wire-rail",
		role: "rail_provider",
	},
	{
		id: "pa-feedzai-fraud",
		providerId: "prov-feedzai",
		targetType: "capability",
		targetId: "cap-fraud-detection",
		role: "technology_provider",
	},
	{
		id: "pa-socure-identity",
		providerId: "prov-socure",
		targetType: "capability",
		targetId: "cap-identity-verification",
		role: "technology_provider",
	},
	{
		id: "pa-plaid-channels",
		providerId: "prov-plaid",
		targetType: "capability",
		targetId: "cap-digital-channels",
		role: "data_provider",
	},
	{
		id: "pa-stripe-orchestration",
		providerId: "prov-stripe",
		targetType: "capability",
		targetId: "cap-payment-orchestration",
		role: "technology_provider",
	},
	{
		id: "pa-marqeta-processor",
		providerId: "prov-marqeta",
		targetType: "node",
		targetId: "n-card-processor",
		role: "technology_provider",
	},
	{
		id: "pa-galileo-processor",
		providerId: "prov-galileo",
		targetType: "node",
		targetId: "n-card-processor",
		role: "technology_provider",
	},
	{
		id: "pa-fis-core",
		providerId: "prov-fis",
		targetType: "node",
		targetId: "n-core-ledger",
		role: "technology_provider",
	},
	{
		id: "pa-fiserv-core",
		providerId: "prov-fiserv",
		targetType: "node",
		targetId: "n-core-ledger",
		role: "technology_provider",
	},
	{
		id: "pa-jack-henry-core",
		providerId: "prov-jack-henry",
		targetType: "node",
		targetId: "n-deposit-system",
		role: "technology_provider",
	},
	{
		id: "pa-infinant-orchestration",
		providerId: "prov-infinant",
		targetType: "capability",
		targetId: "cap-payment-orchestration",
		role: "platform_provider",
	},
].map((d) => ProviderAssociationSchema.parse(d));

// --- Value Streams ---

export const valueStreams: ValueStream[] = [
	{
		id: "vs-retail-payments",
		domainId: "dom-payments",
		label: "Retail Payments",
		description: "End-to-end value stream for retail payment processing and money movement",
		capabilityIds: ["cap-money-movement", "cap-payment-processing"],
		journeyIds: [],
		tags: ["payments", "retail"],
	},
	{
		id: "vs-account-origination",
		domainId: "dom-accounts",
		label: "Account Origination",
		description: "End-to-end value stream for new account creation and onboarding",
		capabilityIds: ["cap-account-opening", "cap-onboarding"],
		journeyIds: ["j-open-savings"],
		tags: ["accounts", "origination"],
	},
	{
		id: "vs-card-payment",
		domainId: "dom-payments",
		label: "Card Payment Processing",
		description:
			"End-to-end value stream for card payment authorization, network routing, and settlement",
		capabilityIds: ["cap-payment-processing", "cap-network-authorization", "cap-settlement"],
		journeyIds: [],
		tags: ["payments", "cards", "settlement"],
	},
].map((d) => ValueStreamSchema.parse(d));

// --- Process Stages ---

export const processStages: ProcessStage[] = [
	{
		id: "ps-1",
		processId: "proc-payment-auth",
		sequenceNumber: 0,
		label: "Transaction Receipt",
		description: "Receive and validate the payment request from the channel",
		nodeIds: ["n-api-gateway", "n-payment-orch"],
		edgeIds: ["e-gw-payment"],
	},
	{
		id: "ps-2",
		processId: "proc-payment-auth",
		sequenceNumber: 1,
		label: "Risk Screening",
		description: "Evaluate fraud signals, velocity checks, and policy compliance",
		nodeIds: ["n-risk-svc"],
		edgeIds: ["e-risk-payment"],
		controlPoints: ["fraud-check", "velocity-limit", "policy-compliance"],
	},
	{
		id: "ps-3",
		processId: "proc-payment-auth",
		sequenceNumber: 2,
		label: "Network Authorization",
		description: "Route to the appropriate payment network for authorization",
		nodeIds: ["n-payment-orch", "n-payment-rail"],
		edgeIds: ["e-payment-rail"],
	},
	{
		id: "ps-4",
		processId: "proc-payment-auth",
		sequenceNumber: 3,
		label: "Posting",
		description: "Record the authorized transaction in the core ledger",
		nodeIds: ["n-core-ledger"],
		edgeIds: ["e-payment-ledger"],
		controlPoints: ["double-entry", "balance-update"],
	},
	// --- Card Authorization Process Stages ---
	{
		id: "ps-card-1",
		processId: "proc-card-auth",
		sequenceNumber: 0,
		label: "Request Receipt",
		description: "Receive card authorization request from merchant acquirer or channel",
		nodeIds: ["n-api-gateway", "n-payment-router"],
		edgeIds: ["e-gw-router"],
	},
	{
		id: "ps-card-2",
		processId: "proc-card-auth",
		sequenceNumber: 1,
		label: "Fraud Screening",
		description: "Real-time fraud scoring and AML screening before network routing",
		nodeIds: ["n-fraud-engine", "n-aml-screening"],
		edgeIds: ["e-orch-fraud", "e-fraud-aml"],
		controlPoints: ["fraud-score", "velocity-check", "aml-screening"],
	},
	{
		id: "ps-card-3",
		processId: "proc-card-auth",
		sequenceNumber: 2,
		label: "Network Routing",
		description: "Route to the appropriate card network (Visa, Mastercard) via issuer processor",
		nodeIds: ["n-card-processor", "n-visa-network", "n-mastercard-network"],
		edgeIds: ["e-orch-processor", "e-processor-visa", "e-processor-mastercard"],
	},
	{
		id: "ps-card-4",
		processId: "proc-card-auth",
		sequenceNumber: 3,
		label: "Authorization Decision",
		description: "Evaluate available balance, credit limit, and policy rules to approve or decline",
		nodeIds: ["n-policy-engine", "n-core-ledger"],
		edgeIds: ["e-gw-policy"],
		controlPoints: ["balance-check", "credit-limit", "policy-evaluation"],
	},
	{
		id: "ps-card-5",
		processId: "proc-card-auth",
		sequenceNumber: 4,
		label: "Response Return",
		description: "Return authorization response to the network and originating channel",
		nodeIds: ["n-card-processor", "n-api-gateway"],
		edgeIds: ["e-orch-processor"],
	},
].map((d) => ProcessStageSchema.parse(d));

// --- Control Points ---

export const controlPoints: ControlPoint[] = [
	// Payment Authorization (proc-payment-auth) controls
	{
		id: "cp-fraud-check",
		label: "Fraud Check",
		processStageId: "ps-2",
		severity: "critical",
		controlType: "preventive",
		status: "active",
		description: "Real-time fraud scoring against transaction patterns",
		regulatoryRef: "BSA/AML §5318",
	},
	{
		id: "cp-velocity-limit",
		label: "Velocity Limit",
		processStageId: "ps-2",
		severity: "critical",
		controlType: "detective",
		status: "active",
		description: "Transaction velocity and frequency monitoring",
	},
	{
		id: "cp-policy-compliance",
		label: "Policy Compliance",
		processStageId: "ps-2",
		severity: "warning",
		controlType: "preventive",
		status: "active",
		description: "Regulatory policy rule evaluation",
	},
	{
		id: "cp-double-entry",
		label: "Double-Entry Validation",
		processStageId: "ps-4",
		severity: "critical",
		controlType: "preventive",
		status: "active",
		description: "Every debit must have a corresponding credit entry",
		regulatoryRef: "GAAP/SOX",
	},
	{
		id: "cp-balance-update",
		label: "Balance Reconciliation",
		processStageId: "ps-4",
		severity: "warning",
		controlType: "detective",
		status: "active",
		description: "Running balance verified after posting",
	},
	// Card Authorization (proc-card-auth) controls
	{
		id: "cp-fraud-score",
		label: "Fraud Score Gate",
		processStageId: "ps-card-2",
		severity: "critical",
		controlType: "preventive",
		status: "active",
		description: "ML-based fraud scoring with configurable threshold",
		regulatoryRef: "PCI-DSS §6.5",
	},
	{
		id: "cp-velocity-check",
		label: "Velocity Check",
		processStageId: "ps-card-2",
		severity: "critical",
		controlType: "detective",
		status: "active",
		description: "Card-level velocity monitoring across channels",
	},
	{
		id: "cp-aml-screening",
		label: "AML Screening",
		processStageId: "ps-card-2",
		severity: "critical",
		controlType: "preventive",
		status: "active",
		description: "Anti-money laundering watchlist screening",
		regulatoryRef: "BSA/AML §5318(h)",
	},
	{
		id: "cp-balance-check",
		label: "Balance Sufficiency",
		processStageId: "ps-card-4",
		severity: "warning",
		controlType: "preventive",
		status: "active",
		description: "Verify available balance covers the authorization amount",
	},
	{
		id: "cp-credit-limit",
		label: "Credit Limit Check",
		processStageId: "ps-card-4",
		severity: "warning",
		controlType: "preventive",
		status: "active",
		description: "Verify authorization does not exceed credit limit",
	},
	{
		id: "cp-policy-eval",
		label: "Policy Evaluation",
		processStageId: "ps-card-4",
		severity: "info",
		controlType: "detective",
		status: "active",
		description: "Custom issuer policy rules (merchant category, geography, time-of-day)",
	},
].map((d) => ControlPointSchema.parse(d));

// --- BPMN Nodes (Payment Authorization Process Flow) ---

export const bpmnNodes: Node[] = [
	{
		id: "bpmn-start",
		type: "bpmn_event",
		label: "Payment Initiated",
		metadata: { swimLane: "Customer", eventKind: "start" },
	},
	{
		id: "bpmn-route-payment",
		type: "bpmn_task",
		label: "Route Payment",
		metadata: { swimLane: "Orchestration", terrainNodeId: "n-payment-orch" },
	},
	{
		id: "bpmn-fork-risk",
		type: "bpmn_gateway",
		label: "Parallel Risk Checks",
		metadata: { swimLane: "Orchestration", gatewayKind: "parallel" },
	},
	{
		id: "bpmn-check-fraud",
		type: "bpmn_task",
		label: "Check Fraud Score",
		metadata: { swimLane: "Risk & Identity", terrainNodeId: "n-fraud-engine" },
	},
	{
		id: "bpmn-screen-aml",
		type: "bpmn_task",
		label: "Screen AML",
		metadata: { swimLane: "Risk & Identity", terrainNodeId: "n-aml-screening" },
	},
	{
		id: "bpmn-join-risk",
		type: "bpmn_gateway",
		label: "Risk Results",
		metadata: { swimLane: "Orchestration", gatewayKind: "parallel" },
	},
	{
		id: "bpmn-fraud-ok",
		type: "bpmn_gateway",
		label: "Fraud Acceptable?",
		metadata: { swimLane: "Orchestration", gatewayKind: "exclusive" },
	},
	{
		id: "bpmn-eval-policy",
		type: "bpmn_task",
		label: "Evaluate Policy",
		metadata: { swimLane: "Orchestration", terrainNodeId: "n-policy-engine" },
	},
	{
		id: "bpmn-check-funds",
		type: "bpmn_task",
		label: "Check Funds",
		metadata: { swimLane: "Core Banking", terrainNodeId: "n-core-ledger" },
	},
	{
		id: "bpmn-funds-ok",
		type: "bpmn_gateway",
		label: "Sufficient Funds?",
		metadata: { swimLane: "Core Banking", gatewayKind: "exclusive" },
	},
	{
		id: "bpmn-authorize-network",
		type: "bpmn_task",
		label: "Authorize Network",
		metadata: { swimLane: "Networks", terrainNodeId: "n-visa-network" },
	},
	{
		id: "bpmn-post-ledger",
		type: "bpmn_task",
		label: "Post Ledger Entry",
		metadata: { swimLane: "Core Banking", terrainNodeId: "n-core-ledger" },
	},
	{
		id: "bpmn-end-authorized",
		type: "bpmn_event",
		label: "Payment Authorized",
		metadata: { swimLane: "Orchestration", eventKind: "end" },
	},
	{
		id: "bpmn-end-declined",
		type: "bpmn_event",
		label: "Payment Declined",
		metadata: { swimLane: "Orchestration", eventKind: "end" },
	},
].map((d) => NodeSchema.parse(d));

// --- BPMN Edges ---

export const bpmnEdges: Edge[] = [
	{
		id: "be-start-route",
		sourceNodeId: "bpmn-start",
		targetNodeId: "bpmn-route-payment",
		type: "bpmn_flow",
	},
	{
		id: "be-route-fork",
		sourceNodeId: "bpmn-route-payment",
		targetNodeId: "bpmn-fork-risk",
		type: "bpmn_flow",
	},
	{
		id: "be-fork-fraud",
		sourceNodeId: "bpmn-fork-risk",
		targetNodeId: "bpmn-check-fraud",
		type: "bpmn_flow",
	},
	{
		id: "be-fork-aml",
		sourceNodeId: "bpmn-fork-risk",
		targetNodeId: "bpmn-screen-aml",
		type: "bpmn_flow",
	},
	{
		id: "be-fraud-join",
		sourceNodeId: "bpmn-check-fraud",
		targetNodeId: "bpmn-join-risk",
		type: "bpmn_flow",
	},
	{
		id: "be-aml-join",
		sourceNodeId: "bpmn-screen-aml",
		targetNodeId: "bpmn-join-risk",
		type: "bpmn_flow",
	},
	{
		id: "be-join-gate",
		sourceNodeId: "bpmn-join-risk",
		targetNodeId: "bpmn-fraud-ok",
		type: "bpmn_flow",
	},
	{
		id: "be-fraud-yes",
		sourceNodeId: "bpmn-fraud-ok",
		targetNodeId: "bpmn-eval-policy",
		type: "yes_branch",
		label: "Yes",
	},
	{
		id: "be-fraud-no",
		sourceNodeId: "bpmn-fraud-ok",
		targetNodeId: "bpmn-end-declined",
		type: "no_branch",
		label: "No",
	},
	{
		id: "be-policy-funds",
		sourceNodeId: "bpmn-eval-policy",
		targetNodeId: "bpmn-check-funds",
		type: "bpmn_flow",
	},
	{
		id: "be-funds-gate",
		sourceNodeId: "bpmn-check-funds",
		targetNodeId: "bpmn-funds-ok",
		type: "bpmn_flow",
	},
	{
		id: "be-funds-yes",
		sourceNodeId: "bpmn-funds-ok",
		targetNodeId: "bpmn-authorize-network",
		type: "yes_branch",
		label: "Yes",
	},
	{
		id: "be-funds-no",
		sourceNodeId: "bpmn-funds-ok",
		targetNodeId: "bpmn-end-declined",
		type: "no_branch",
		label: "No",
	},
	{
		id: "be-network-ledger",
		sourceNodeId: "bpmn-authorize-network",
		targetNodeId: "bpmn-post-ledger",
		type: "bpmn_flow",
	},
	{
		id: "be-ledger-end",
		sourceNodeId: "bpmn-post-ledger",
		targetNodeId: "bpmn-end-authorized",
		type: "bpmn_flow",
	},
].map((d) => EdgeSchema.parse(d));

// --- Interfaces (Sequence Perspective) ---

export const interfaces: Interface[] = [
	{
		id: "iface-mobile",
		nodeId: "n-mobile-app",
		label: "Mobile App API",
		protocol: "rest",
		description: "Customer-facing mobile application",
	},
	{
		id: "iface-gateway",
		nodeId: "n-api-gateway",
		label: "Payment Gateway",
		protocol: "rest",
		description: "API gateway for payment request ingress",
	},
	{
		id: "iface-orch",
		nodeId: "n-payment-orch",
		label: "Orchestration Service",
		protocol: "grpc",
		description: "Payment orchestration and routing engine",
	},
	{
		id: "iface-fraud",
		nodeId: "n-fraud-engine",
		label: "Fraud Engine API",
		protocol: "grpc",
		description: "Real-time fraud scoring service",
	},
	{
		id: "iface-aml",
		nodeId: "n-aml-screening",
		label: "AML Screening API",
		protocol: "grpc",
		description: "Anti-money laundering watchlist screening",
	},
	{
		id: "iface-policy",
		nodeId: "n-policy-engine",
		label: "Policy Engine API",
		protocol: "grpc",
		description: "Issuer policy rule evaluation",
	},
	{
		id: "iface-network",
		nodeId: "n-visa-network",
		label: "Network Gateway",
		protocol: "rest",
		description: "Card network authorization interface",
	},
	{
		id: "iface-ledger",
		nodeId: "n-core-ledger",
		label: "Core Ledger API",
		protocol: "grpc",
		description: "Double-entry ledger posting service",
	},
].map((d) => InterfaceSchema.parse(d));

// --- Messages (Sequence Perspective) ---

export const messages: Message[] = [
	{
		id: "msg-1",
		sequenceNumber: 0,
		sourceInterfaceId: "iface-mobile",
		targetInterfaceId: "iface-gateway",
		type: "request",
		label: "POST /authorize",
		description: "Customer initiates a payment authorization",
		payloadSummary: "{ amount, currency, merchantId, cardToken }",
	},
	{
		id: "msg-2",
		sequenceNumber: 1,
		sourceInterfaceId: "iface-gateway",
		targetInterfaceId: "iface-orch",
		type: "request",
		label: "Forward Authorization",
		description: "Gateway routes the request to orchestration",
	},
	{
		id: "msg-3",
		sequenceNumber: 2,
		sourceInterfaceId: "iface-orch",
		targetInterfaceId: "iface-fraud",
		type: "request",
		label: "Check Fraud Score",
		description: "Orchestration requests real-time fraud scoring",
	},
	{
		id: "msg-4",
		sequenceNumber: 3,
		sourceInterfaceId: "iface-fraud",
		targetInterfaceId: "iface-orch",
		type: "response",
		label: "Fraud Result",
		description: "Fraud engine returns score and recommendation",
		payloadSummary: "{ score: 0.12, recommendation: 'approve' }",
	},
	{
		id: "msg-5",
		sequenceNumber: 4,
		sourceInterfaceId: "iface-orch",
		targetInterfaceId: "iface-aml",
		type: "request",
		label: "Screen AML",
		description: "Orchestration requests AML/sanctions screening",
	},
	{
		id: "msg-6",
		sequenceNumber: 5,
		sourceInterfaceId: "iface-aml",
		targetInterfaceId: "iface-orch",
		type: "response",
		label: "AML Result",
		description: "AML screening returns clear/match result",
		payloadSummary: "{ status: 'clear' }",
	},
	{
		id: "msg-7",
		sequenceNumber: 6,
		sourceInterfaceId: "iface-orch",
		targetInterfaceId: "iface-policy",
		type: "request",
		label: "Evaluate Policy",
		description: "Orchestration requests issuer policy evaluation",
	},
	{
		id: "msg-8",
		sequenceNumber: 7,
		sourceInterfaceId: "iface-policy",
		targetInterfaceId: "iface-orch",
		type: "response",
		label: "Policy Result",
		description: "Policy engine returns rule evaluation result",
		payloadSummary: "{ approved: true, appliedRules: ['geo-ok', 'mcc-ok'] }",
	},
	{
		id: "msg-9",
		sequenceNumber: 8,
		sourceInterfaceId: "iface-orch",
		targetInterfaceId: "iface-network",
		type: "request",
		label: "Network Authorize",
		description: "Orchestration sends authorization to card network",
	},
	{
		id: "msg-10",
		sequenceNumber: 9,
		sourceInterfaceId: "iface-network",
		targetInterfaceId: "iface-orch",
		type: "response",
		label: "Network Response",
		description: "Card network returns authorization decision",
		payloadSummary: "{ authCode: 'A12345', approved: true }",
	},
	{
		id: "msg-11",
		sequenceNumber: 10,
		sourceInterfaceId: "iface-orch",
		targetInterfaceId: "iface-ledger",
		type: "request",
		label: "Post Ledger Entry",
		description: "Orchestration posts the authorized transaction to the ledger",
	},
	{
		id: "msg-12",
		sequenceNumber: 11,
		sourceInterfaceId: "iface-ledger",
		targetInterfaceId: "iface-orch",
		type: "response",
		label: "Ledger Confirmation",
		description: "Ledger confirms double-entry posting",
		payloadSummary: "{ journalId: 'JRN-98765', balanced: true }",
	},
	{
		id: "msg-13",
		sequenceNumber: 12,
		sourceInterfaceId: "iface-orch",
		targetInterfaceId: "iface-gateway",
		type: "response",
		label: "Authorization Response",
		description: "Orchestration returns final authorization result",
	},
	{
		id: "msg-14",
		sequenceNumber: 13,
		sourceInterfaceId: "iface-gateway",
		targetInterfaceId: "iface-mobile",
		type: "response",
		label: "Response to Client",
		description: "Gateway returns authorization result to the customer",
		payloadSummary: "{ approved: true, authCode: 'A12345' }",
	},
].map((d) => MessageSchema.parse(d));

// --- Processes ---

export const processes: Process[] = [
	{
		id: "proc-payment-auth",
		label: "Payment Authorization",
		description: "Operational process for authorizing and posting a retail payment",
		capabilityIds: ["cap-payment-processing"],
		valueStreamId: "vs-retail-payments",
		stageIds: ["ps-1", "ps-2", "ps-3", "ps-4"],
		tags: ["payments", "authorization"],
	},
	{
		id: "proc-card-auth",
		label: "Card Authorization",
		description:
			"Operational process for authorizing a card payment through network and issuer processor",
		capabilityIds: ["cap-network-authorization"],
		valueStreamId: "vs-card-payment",
		stageIds: ["ps-card-1", "ps-card-2", "ps-card-3", "ps-card-4", "ps-card-5"],
		tags: ["cards", "authorization", "network"],
	},
].map((d) => ProcessSchema.parse(d));

// --- Story Waypoints ---

export const storyWaypoints: StoryWaypoint[] = [
	// --- Route: How a Payment Flows (sr-payment-flow) ---
	{
		id: "sw-1",
		storyRouteId: "sr-payment-flow",
		sequenceNumber: 0,
		title: "The Customer Initiates",
		keyMessage:
			"Every payment begins with a customer action in a digital channel — mobile, web, or merchant checkout",
		whyItMatters:
			"The channel determines which wallets, authentication methods, and payment interfaces are available",
		focusTargets: [
			{ type: "node", targetId: "n-customer" },
			{ type: "node", targetId: "n-mobile-app" },
			{ type: "node", targetId: "n-web-app" },
			{ type: "node", targetId: "n-merchant-checkout" },
			{ type: "edge", targetId: "e-cust-app" },
		],
		perspectiveId: "persp-landscape",
	},
	{
		id: "sw-2",
		storyRouteId: "sr-payment-flow",
		sequenceNumber: 1,
		title: "Orchestration Takes Over",
		keyMessage:
			"The API gateway hands off to the payment router and policy engine, which decide how the payment should be processed",
		whyItMatters:
			"Orchestration is the strategic control point — it determines routing, cost optimization, and fallback paths",
		focusTargets: [
			{ type: "node", targetId: "n-api-gateway" },
			{ type: "node", targetId: "n-payment-router" },
			{ type: "node", targetId: "n-policy-engine" },
			{ type: "edge", targetId: "e-gw-router" },
			{ type: "edge", targetId: "e-policy-router" },
		],
		perspectiveId: "persp-architecture",
	},
	{
		id: "sw-3",
		storyRouteId: "sr-payment-flow",
		sequenceNumber: 2,
		title: "Risk and Fraud Decisioning",
		keyMessage:
			"Before any money moves, the fraud engine, AML screening, and risk service determine if the payment proceeds",
		whyItMatters:
			"This is where the bank retains critical control — blocking fraud while minimizing false declines",
		focusTargets: [
			{ type: "node", targetId: "n-fraud-engine" },
			{ type: "node", targetId: "n-aml-screening" },
			{ type: "node", targetId: "n-risk-svc" },
			{ type: "edge", targetId: "e-orch-fraud" },
			{ type: "edge", targetId: "e-fraud-aml" },
			{ type: "process_stage", targetId: "ps-2" },
		],
	},
	{
		id: "sw-4",
		storyRouteId: "sr-payment-flow",
		sequenceNumber: 3,
		title: "Network and Rail Selection",
		keyMessage:
			"The router selects the appropriate network or rail — card schemes for purchases, ACH/RTP/FedNow for transfers",
		whyItMatters:
			"This is where Visa, Mastercard, RTP, FedNow, and ACH enter the flow, each with different speed, cost, and finality characteristics",
		focusTargets: [
			{ type: "node", targetId: "n-card-processor" },
			{ type: "node", targetId: "n-visa-network" },
			{ type: "node", targetId: "n-rtp-rail" },
			{ type: "node", targetId: "n-ach-rail" },
			{ type: "edge", targetId: "e-router-ach" },
			{ type: "edge", targetId: "e-router-rtp" },
			{ type: "edge", targetId: "e-processor-visa" },
			{ type: "provider", targetId: "prov-visa" },
			{ type: "provider", targetId: "prov-rtp" },
		],
		perspectiveId: "persp-process",
	},
	{
		id: "sw-5",
		storyRouteId: "sr-payment-flow",
		sequenceNumber: 4,
		title: "Settlement and Clearing",
		keyMessage:
			"After network authorization, clearing and settlement engines finalize the money movement",
		whyItMatters:
			"Settlement timing varies dramatically — real-time rails settle instantly while ACH batches settle next day",
		focusTargets: [
			{ type: "node", targetId: "n-clearing-house" },
			{ type: "node", targetId: "n-settlement-engine" },
			{ type: "edge", targetId: "e-clearing-settlement" },
			{ type: "edge", targetId: "e-settlement-ledger" },
		],
	},
	{
		id: "sw-6",
		storyRouteId: "sr-payment-flow",
		sequenceNumber: 5,
		title: "Core Records the Truth",
		keyMessage:
			"The core ledger and general ledger are the system of record — this is where the transaction becomes authoritative",
		whyItMatters:
			"Regardless of which network or rail was used, the core ledger maintains the bank's single source of truth",
		focusTargets: [
			{ type: "node", targetId: "n-core-ledger" },
			{ type: "node", targetId: "n-gl-system" },
			{ type: "edge", targetId: "e-settlement-gl" },
			{ type: "edge", targetId: "e-ledger-gl" },
			{ type: "process_stage", targetId: "ps-4" },
		],
		perspectiveId: "persp-architecture",
	},

	// --- Route: Real-Time Payment: RTP vs FedNow (sr-rtp-vs-fednow) ---
	{
		id: "sw-7",
		storyRouteId: "sr-rtp-vs-fednow",
		sequenceNumber: 0,
		title: "Customer Initiates a Transfer",
		keyMessage: "A customer initiates a person-to-person or account transfer from their mobile app",
		whyItMatters:
			"Real-time payments start the same way as any other payment — the difference is in the rail, not the channel",
		focusTargets: [
			{ type: "node", targetId: "n-customer" },
			{ type: "node", targetId: "n-mobile-app" },
			{ type: "edge", targetId: "e-cust-app" },
		],
		perspectiveId: "persp-landscape",
	},
	{
		id: "sw-8",
		storyRouteId: "sr-rtp-vs-fednow",
		sequenceNumber: 1,
		title: "Orchestration Routes to Real-Time",
		keyMessage:
			"The payment router and policy engine determine the transfer qualifies for a real-time rail instead of batch ACH",
		whyItMatters:
			"Routing logic decides between RTP, FedNow, and ACH based on amount limits, recipient capability, and cost",
		focusTargets: [
			{ type: "node", targetId: "n-payment-router" },
			{ type: "node", targetId: "n-policy-engine" },
			{ type: "edge", targetId: "e-policy-router" },
			{ type: "edge", targetId: "e-gw-router" },
		],
		perspectiveId: "persp-architecture",
	},
	{
		id: "sw-9",
		storyRouteId: "sr-rtp-vs-fednow",
		sequenceNumber: 2,
		title: "The RTP Path",
		keyMessage:
			"RTP (Real-Time Payments) is operated by The Clearing House — a bank-owned network processing credit transfers in seconds",
		whyItMatters:
			"RTP was first to market, has broader bank coverage, and supports request-for-payment messaging",
		focusTargets: [
			{ type: "node", targetId: "n-rtp-rail" },
			{ type: "edge", targetId: "e-router-rtp" },
			{ type: "provider", targetId: "prov-rtp" },
		],
	},
	{
		id: "sw-10",
		storyRouteId: "sr-rtp-vs-fednow",
		sequenceNumber: 3,
		title: "The FedNow Path",
		keyMessage:
			"FedNow is the Federal Reserve's instant payment rail — a government-operated alternative ensuring universal access",
		whyItMatters:
			"FedNow provides a public-infrastructure alternative that doesn't require membership in a private network",
		focusTargets: [
			{ type: "node", targetId: "n-fednow-rail" },
			{ type: "edge", targetId: "e-router-fednow" },
			{ type: "provider", targetId: "prov-fednow" },
		],
	},
	{
		id: "sw-11",
		storyRouteId: "sr-rtp-vs-fednow",
		sequenceNumber: 4,
		title: "Settlement and Clearing",
		keyMessage:
			"Both rails settle in real time, but clearing mechanics and finality guarantees differ between them",
		whyItMatters:
			"Real-time settlement eliminates credit risk between banks — a fundamental shift from batch processing",
		focusTargets: [
			{ type: "node", targetId: "n-settlement-engine" },
			{ type: "node", targetId: "n-clearing-house" },
			{ type: "edge", targetId: "e-clearing-settlement" },
			{ type: "edge", targetId: "e-settlement-ledger" },
		],
		perspectiveId: "persp-process",
	},
	{
		id: "sw-12",
		storyRouteId: "sr-rtp-vs-fednow",
		sequenceNumber: 5,
		title: "Core Ledger Records",
		keyMessage:
			"The core ledger posts the completed transfer in real time, updating balances immediately",
		whyItMatters:
			"Real-time posting to the core ledger means customers see their balance update instantly — no more pending transactions",
		focusTargets: [
			{ type: "node", targetId: "n-core-ledger" },
			{ type: "edge", targetId: "e-settlement-ledger" },
			{ type: "process_stage", targetId: "ps-4" },
		],
	},

	// --- Route: Where Bank Control Changes Hands (sr-bank-control) ---
	{
		id: "sw-13",
		storyRouteId: "sr-bank-control",
		sequenceNumber: 0,
		title: "The Bank Starts in Control",
		keyMessage:
			"At the core, the bank fully controls its ledger, deposit systems, and account infrastructure",
		whyItMatters:
			"The core ledger and deposit system are the bank's sovereign territory — no third party can override them",
		focusTargets: [
			{ type: "node", targetId: "n-core-ledger" },
			{ type: "node", targetId: "n-deposit-system" },
			{ type: "edge", targetId: "e-ledger-deposit" },
		],
		perspectiveId: "persp-landscape",
	},
	{
		id: "sw-14",
		storyRouteId: "sr-bank-control",
		sequenceNumber: 1,
		title: "Orchestration as Strategic Control Layer",
		keyMessage:
			"The payment router and policy engine are where the bank exercises strategic control over payment flows",
		whyItMatters:
			"Banks that own their orchestration layer can optimize routing, manage costs, and enforce business rules without vendor lock-in",
		focusTargets: [
			{ type: "node", targetId: "n-payment-router" },
			{ type: "node", targetId: "n-policy-engine" },
			{ type: "node", targetId: "n-workflow-engine" },
			{ type: "edge", targetId: "e-policy-router" },
			{ type: "edge", targetId: "e-router-workflow" },
		],
		perspectiveId: "persp-architecture",
	},
	{
		id: "sw-15",
		storyRouteId: "sr-bank-control",
		sequenceNumber: 2,
		title: "Risk and Identity as Trust Boundary",
		keyMessage:
			"Fraud detection and identity verification are where the bank enforces its trust model before money moves",
		whyItMatters:
			"Outsourcing risk entirely to third parties means ceding control over who can transact and what gets approved",
		focusTargets: [
			{ type: "node", targetId: "n-fraud-engine" },
			{ type: "node", targetId: "n-risk-svc" },
			{ type: "node", targetId: "n-identity-svc" },
			{ type: "edge", targetId: "e-orch-fraud" },
			{ type: "edge", targetId: "e-identity-risk" },
			{ type: "provider", targetId: "prov-feedzai" },
		],
		perspectiveId: "persp-process",
	},
	{
		id: "sw-16",
		storyRouteId: "sr-bank-control",
		sequenceNumber: 3,
		title: "Control Shifts to Networks and Schemes",
		keyMessage:
			"When a payment enters a card network, the bank cedes control to Visa or Mastercard's rules, interchange, and dispute processes",
		whyItMatters:
			"Network rules govern authorization, interchange fees, chargeback liability, and settlement timing — the bank must comply",
		focusTargets: [
			{ type: "node", targetId: "n-visa-network" },
			{ type: "node", targetId: "n-mastercard-network" },
			{ type: "node", targetId: "n-card-processor" },
			{ type: "edge", targetId: "e-processor-visa" },
			{ type: "edge", targetId: "e-processor-mastercard" },
			{ type: "provider", targetId: "prov-visa" },
			{ type: "provider", targetId: "prov-mastercard" },
		],
	},
	{
		id: "sw-17",
		storyRouteId: "sr-bank-control",
		sequenceNumber: 4,
		title: "Wallets and Interfaces Add Another Layer",
		keyMessage:
			"Digital wallets like Apple Pay and merchant checkouts insert a layer between the bank and the customer",
		whyItMatters:
			"When Apple Pay or a merchant checkout owns the customer experience, the bank loses visibility into customer intent and behavior",
		focusTargets: [
			{ type: "node", targetId: "n-mobile-app" },
			{ type: "node", targetId: "n-merchant-checkout" },
			{ type: "provider", targetId: "prov-apple-pay" },
			{ type: "provider", targetId: "prov-google-pay" },
			{ type: "edge", targetId: "e-merchant-gw" },
		],
		perspectiveId: "persp-journey",
	},
	{
		id: "sw-18",
		storyRouteId: "sr-bank-control",
		sequenceNumber: 5,
		title: "The System of Record Anchors Truth",
		keyMessage:
			"Regardless of how many intermediaries touched the payment, the core ledger and GL remain the bank's authoritative record",
		whyItMatters:
			"The bank's ultimate control comes from being the system of record — regulatory reporting, reconciliation, and audit all flow from here",
		focusTargets: [
			{ type: "node", targetId: "n-core-ledger" },
			{ type: "node", targetId: "n-gl-system" },
			{ type: "edge", targetId: "e-ledger-gl" },
			{ type: "edge", targetId: "e-settlement-gl" },
		],
		perspectiveId: "persp-architecture",
	},
	// --- Route 4: From Landscape to Sequence — The Full Descent ---
	{
		id: "sw-19",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 0,
		title: "The Payments Landscape",
		keyMessage:
			"We start at the broadest view — the fintech landscape. Payments sits among nine domains that together compose a modern banking platform.",
		focusTargets: [{ type: "node", targetId: "n-payment-orch" }],
		perspectiveId: "persp-landscape",
	},
	{
		id: "sw-20",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 1,
		title: "The Customer's Journey",
		keyMessage:
			"From the customer's perspective, a payment starts with a tap. The journey traces the user's experience from initiation to confirmation.",
		focusTargets: [
			{ type: "node", targetId: "n-mobile-app" },
			{ type: "node", targetId: "n-customer" },
		],
		perspectiveId: "persp-journey",
	},
	{
		id: "sw-21",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 2,
		title: "The Operational Process",
		keyMessage:
			"Behind the tap, a BPMN process flow orchestrates fraud checks, policy evaluation, network authorization, and ledger posting across multiple swim lanes.",
		focusTargets: [{ type: "node", targetId: "n-payment-orch" }],
		perspectiveId: "persp-process",
	},
	{
		id: "sw-22",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 3,
		title: "The Technical Architecture",
		keyMessage:
			"Each process task maps to a real system. The architecture view shows how services, gateways, and external networks connect.",
		focusTargets: [
			{ type: "node", targetId: "n-api-gateway" },
			{ type: "node", targetId: "n-fraud-engine" },
			{ type: "node", targetId: "n-core-ledger" },
		],
		perspectiveId: "persp-architecture",
	},
	{
		id: "sw-23",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 4,
		title: "The Participating Systems",
		keyMessage:
			"Not all systems participate in every flow. The System view filters to just the cast of characters for this payment authorization.",
		focusTargets: [
			{ type: "node", targetId: "n-fraud-engine" },
			{ type: "node", targetId: "n-policy-engine" },
			{ type: "node", targetId: "n-core-ledger" },
		],
		perspectiveId: "persp-system",
	},
	{
		id: "sw-24",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 5,
		title: "The Runtime Sequence",
		keyMessage:
			"At the deepest level, we see exactly what calls what. Each message in the sequence diagram represents a real API interaction — request and response, in order.",
		focusTargets: [{ type: "interface", targetId: "iface-orch" }],
		perspectiveId: "persp-sequence",
	},
	// --- Route 5: The Runtime Call Sequence ---
	{
		id: "sw-25",
		storyRouteId: "sr-call-sequence",
		sequenceNumber: 0,
		title: "The Authorization Request",
		keyMessage:
			"A payment authorization begins when the mobile app sends a POST /authorize request through the API gateway to the orchestration service.",
		focusTargets: [
			{ type: "interface", targetId: "iface-mobile" },
			{ type: "interface", targetId: "iface-gateway" },
		],
		perspectiveId: "persp-sequence",
	},
	{
		id: "sw-26",
		storyRouteId: "sr-call-sequence",
		sequenceNumber: 1,
		title: "Fraud and AML Screening",
		keyMessage:
			"The orchestration service calls the fraud engine and AML screening in sequence. Each returns a score or status that gates further processing.",
		focusTargets: [
			{ type: "interface", targetId: "iface-fraud" },
			{ type: "interface", targetId: "iface-aml" },
		],
		perspectiveId: "persp-sequence",
	},
	{
		id: "sw-27",
		storyRouteId: "sr-call-sequence",
		sequenceNumber: 2,
		title: "Where the Fraud Engine Lives",
		keyMessage:
			"Stepping out of the sequence view, here is where the fraud engine sits in the broader architecture — connected to the orchestration layer and risk domain.",
		whyItMatters:
			"Understanding the structural context helps explain why this service has the dependencies it does.",
		focusTargets: [{ type: "node", targetId: "n-fraud-engine" }],
		perspectiveId: "persp-architecture",
	},
	{
		id: "sw-28",
		storyRouteId: "sr-call-sequence",
		sequenceNumber: 3,
		title: "Policy and Network Authorization",
		keyMessage:
			"Back in the sequence, the orchestration evaluates issuer policy rules, then sends the authorization to the card network. The network returns an auth code.",
		focusTargets: [
			{ type: "interface", targetId: "iface-policy" },
			{ type: "interface", targetId: "iface-network" },
		],
		perspectiveId: "persp-sequence",
	},
	{
		id: "sw-29",
		storyRouteId: "sr-call-sequence",
		sequenceNumber: 4,
		title: "Ledger Posting and Response",
		keyMessage:
			"The authorized transaction is posted to the core ledger with double-entry validation. The response flows back through the gateway to the customer's device.",
		focusTargets: [
			{ type: "interface", targetId: "iface-ledger" },
			{ type: "interface", targetId: "iface-mobile" },
		],
		perspectiveId: "persp-sequence",
	},
	// --- Route 6: Process Modes — Three Views of One Flow ---
	{
		id: "sw-30",
		storyRouteId: "sr-process-modes",
		sequenceNumber: 0,
		title: "The Operational Flow",
		keyMessage:
			"In Operational mode, the Process perspective shows the BPMN flow — how work moves across swim lanes from customer initiation through risk, orchestration, and core banking.",
		focusTargets: [{ type: "node", targetId: "n-payment-orch" }],
		perspectiveId: "persp-process",
	},
	{
		id: "sw-31",
		storyRouteId: "sr-process-modes",
		sequenceNumber: 1,
		title: "Decision Gates",
		keyMessage:
			"Switch to Decision mode. The same flow, but now the gateway decisions are emphasized — fraud acceptable? sufficient funds? These are the gates that determine the outcome.",
		focusTargets: [{ type: "node", targetId: "n-fraud-engine" }],
		perspectiveId: "persp-process",
	},
	{
		id: "sw-32",
		storyRouteId: "sr-process-modes",
		sequenceNumber: 2,
		title: "Risk Controls",
		keyMessage:
			"Switch to Controls mode. The same flow again, but now you see where regulatory controls apply — critical fraud scoring, AML screening, double-entry ledger validation.",
		focusTargets: [{ type: "node", targetId: "n-core-ledger" }],
		perspectiveId: "persp-process",
	},
	{
		id: "sw-33",
		storyRouteId: "sr-process-modes",
		sequenceNumber: 3,
		title: "Three Lenses, One Flow",
		keyMessage:
			"Operational, Decision, and Controls are three views of the same process. The topology never changes — only the emphasis. This is what canvas modes are for.",
		focusTargets: [{ type: "node", targetId: "n-payment-orch" }],
		perspectiveId: "persp-process",
	},
].map((d) => StoryWaypointSchema.parse(d));

// --- Story Routes ---

export const storyRoutes: StoryRoute[] = [
	{
		id: "sr-payment-flow",
		title: "How a Payment Flows",
		destinationObjective:
			"Understand how a payment moves through the modern banking stack from customer initiation to core recording",
		audienceTag: "architecture",
		overview:
			"This route walks through a retail payment from the customer's device through channels, orchestration, risk, network/rail selection, settlement, and core posting.",
		waypointIds: ["sw-1", "sw-2", "sw-3", "sw-4", "sw-5", "sw-6"],
		tags: ["payments", "teaching", "architecture"],
	},
	{
		id: "sr-rtp-vs-fednow",
		title: "Real-Time Payment: RTP vs FedNow",
		destinationObjective:
			"Explain how real-time payments differ from card network flows and compare the two instant payment rails",
		audienceTag: "architecture",
		overview:
			"This route compares the two real-time payment rails in the US — RTP (operated by The Clearing House) and FedNow (operated by the Federal Reserve) — tracing a transfer from initiation through routing, rail-specific processing, settlement, and core posting.",
		waypointIds: ["sw-7", "sw-8", "sw-9", "sw-10", "sw-11", "sw-12"],
		tags: ["payments", "real-time", "rails", "comparison"],
	},
	{
		id: "sr-bank-control",
		title: "Where Bank Control Changes Hands",
		destinationObjective:
			"Understand where a bank retains control versus delegates it to networks, schemes, wallets, or orchestration layers",
		audienceTag: "strategy",
		overview:
			"This route traces the boundary between bank-controlled and externally-controlled components in the payment stack — from core systems where the bank has full sovereignty, through orchestration and risk layers, to networks and wallets where control shifts to third parties.",
		waypointIds: ["sw-13", "sw-14", "sw-15", "sw-16", "sw-17", "sw-18"],
		tags: ["strategy", "control", "governance", "vendor-management"],
	},
	{
		id: "sr-full-descent",
		title: "From Landscape to Sequence — The Full Descent",
		destinationObjective:
			"Experience the same payment authorization moment through every perspective in the progression — from broad landscape to runtime call sequence",
		audienceTag: "teaching",
		overview:
			"This route demonstrates the 6-perspective progression by showing the same payment authorization at each level of understanding: landscape, journey, process, architecture, system, and sequence.",
		waypointIds: ["sw-19", "sw-20", "sw-21", "sw-22", "sw-23", "sw-24"],
		tags: ["teaching", "progression", "perspectives"],
	},
	{
		id: "sr-call-sequence",
		title: "The Runtime Call Sequence",
		destinationObjective:
			"Understand the exact API call sequence when a payment is authorized — every request, response, and service interaction",
		audienceTag: "architecture",
		overview:
			"This route walks through the payment authorization sequence diagram, showing each service-to-service call in order. One waypoint steps into the Architecture view to show where a key service lives in the broader landscape.",
		waypointIds: ["sw-25", "sw-26", "sw-27", "sw-28", "sw-29"],
		tags: ["sequence", "runtime", "api", "payments"],
	},
	{
		id: "sr-process-modes",
		title: "Process Modes — Three Views of One Flow",
		destinationObjective:
			"See how canvas modes reveal different truths about the same process without changing the topology",
		audienceTag: "teaching",
		overview:
			"This route stays on the Process perspective and toggles between Operational, Decision, and Controls modes — demonstrating that the same BPMN flow can be viewed through three different emphases.",
		waypointIds: ["sw-30", "sw-31", "sw-32", "sw-33"],
		tags: ["teaching", "canvas-modes", "process"],
	},
].map((d) => StoryRouteSchema.parse(d));
