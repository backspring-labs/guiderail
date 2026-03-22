# Nebulus Financial Genesis Design Pack Spec — DDD + Hex Alignment Edition
## Revised Genesis Spec for an Agent Squad Building the Nebulus Demo Banking Platform

**Status:** Draft v2  
**Supersedes:** Prior Genesis Design Pack Spec where this document conflicts  
**Intent:** Preserve the strongest parts of the original Genesis spec while making the platform architecture explicitly DDD- and Hexagonal-friendly, provider-adapter-ready, and more executable for a squad building the first Nebulus demo platform.

---

## 1) Purpose, outcomes, and architectural intent

### Purpose

Define a **complete, agent-executable design pack** that enables a squad of agents to design and generate:

- the `nebulus_financial` modular monolith as the **canonical internal banking platform**
- consumer apps (**React web + Expo Router mobile**)
- Nebulus Console (**Continuum shell, branded + themed**)
- a provider-ready integration surface using **ports and adapters**
- add-on packs (Checking, Cards, Loans, FDX, Analytics, Workflow, etc.)
- conformance gates (contracts, invariants, scenarios, observability, seed determinism)
- build transparency artifacts (“Built By”)

### Why this revision exists

The original Genesis spec was already strong on:
- canonical folder structure
- spec-before-build discipline
- modular monolith packaging
- conformance
- pack governance
- seed determinism
- and anti-drift rules

What it did **not** make explicit enough was:

- the distinction between **domain**, **application/use-case**, and **adapter** layers
- the difference between **canonical internal models** and **provider-specific edge models**
- a **platform-wide port taxonomy**
- the discipline that providers must plug into **capability ports**, not leak into the core
- the separation between **inbound adapters**, **application orchestration**, **domain rules**, and **outbound adapters**

This version keeps the good bones of Genesis and clarifies those seams.

### Definition of Done

A build is “done” when:

- `nebulus up` brings up backend + local observability stack + console
- `nebulus seed --dataset baseline_v1` produces deterministic demo data
- `nebulus test` passes all required gates
- web + mobile can complete **Golden Demo Journeys** using a real backend
- Nebulus Console shows at least:
  - System Overview
  - Correlation Search
  - Build Snapshot
- adapter seams exist for designated external capability families, even if some are fulfilled by deterministic stubs in Genesis
- `artifacts/builds/build_stats.json` exists and validates against schema

---

## 2) Core architectural stance

### 2.1 Primary style

Nebulus Genesis is a:

- **DDD-oriented modular monolith**
- with **Hexagonal Architecture** at bounded-context seams and external capability edges
- with **contracts-first delivery**
- and **pack-based additive extension**

### 2.2 Foundational statement

Nebulus is the **canonical internal banking platform model**.  
Real providers are integrated via **capability ports** and **provider adapters** at the edge.

That means:

- the Nebulus domain language is internal and canonical
- provider-specific schemas, terminology, and request/response models must stay in adapters
- the core domain must not be shaped around vendor APIs
- packs may add capabilities, but must extend through explicit seams and port contracts

### 2.3 Architecture layers (explicit)

Each bounded context and feature area should be understood through four layers:

#### A. Domain layer
Contains:
- aggregates / entities / value objects
- invariants
- domain services
- domain events
- business rules that must remain true regardless of delivery channel or provider

#### B. Application layer
Contains:
- use-case orchestration
- command handling
- transaction coordination
- invocation of domain behavior
- invocation of outbound ports
- mapping from inbound requests into domain commands

The application layer is where workflow happens.  
It is **not** where the core business rules live.

#### C. Inbound adapters
Contain:
- HTTP / API controllers
- event consumers
- scheduled job triggers
- console actions
- mobile/web-facing request handlers

Inbound adapters call the application layer.  
They do not directly manipulate domain internals.

#### D. Outbound adapters
Contain:
- persistence implementations
- provider integrations
- queue publishers
- workflow engine connectors
- analytics sinks
- telemetry sinks
- notification gateways
- future payment / risk / identity provider connectors

Outbound adapters implement owned ports.  
They do not own the business language of the system.

---

## 3) Architectural principles (binding)

The following principles are mandatory.

### 3.1 Domain-first, provider-second
The Nebulus domain model must be designed around canonical banking concepts, not provider product names or provider response shapes.

### 3.2 Hex at the seams
Any external dependency or replaceable integration must be represented as an owned port with one or more adapters.

### 3.3 Capability ports, not vendor ports
Ports must be named after stable capabilities, not vendors.

Good examples:
- `FraudDecisionPort`
- `IdentityVerificationPort`
- `PaymentRailExecutionPort`
- `WalletTokenizationPort`
- `NotificationPort`
- `ProcessEnginePort`
- `TelemetrySinkPort`

Bad examples:
- `FeedzaiPort`
- `VisaPort`
- `PingPort`

### 3.4 No provider leakage into the domain
Provider request/response DTOs must not leak into aggregates, domain events, or core application contracts.

### 3.5 Application layer orchestrates, domain layer decides
Use-case sequencing belongs in application services.  
Business truth belongs in the domain.

### 3.6 Golden journeys over document completeness
If there is tension between exhaustive spec coverage and proving the core demo slice, the **golden journeys win**.

### 3.7 Additive packs only
Packs may extend the platform by:
- adding bounded contexts
- adding APIs/events
- registering new posting types
- adding UI routes and console panels
- implementing adapters for declared ports

Packs must not mutate Genesis invariants.

### 3.8 Deterministic stubs are acceptable at the edge
Where a capability is future-facing or provider-backed, Genesis may use deterministic stub adapters as long as:
- the port is stable
- behavior is documented
- seed and scenario outputs are deterministic
- replacement by a real adapter is possible without reworking the domain

---

## 4) Product target and Golden Demo Journeys

### 4.1 Genesis MVP target

Genesis is not trying to build a full digital bank.  
Genesis is trying to build a **credible, end-to-end demo banking substrate** that proves:

- a real kernel
- real ledger-backed journeys
- real contracts
- real observability
- real console visibility
- and clean adapter seams for future provider-backed capabilities

### 4.2 Golden Demo Journeys

A Genesis build is successful only if the following journeys work end to end against the real backend:

1. **Login**
2. **Open Savings Account**
3. **Accounts List**
4. **Account Detail**
5. **Transaction Listing**
6. **Internal Transfer**
7. **Console Correlation Drilldown for one completed journey**

### 4.3 Genesis MVP must implement

- authentication boundary sufficient for demo use
- customer profile seed and retrieval
- savings account opening
- accounts list/detail
- transaction list
- internal transfers
- double-entry ledger posting and journal visibility
- deterministic seed dataset
- console overview and traceability
- build transparency artifacts
- basic observability and conformance gates

### 4.4 Genesis MVP may stub

- advanced MFA / production-grade IAM
- external payment rails
- third-party fraud providers
- provider-backed workflow engine
- advanced experimentation backend
- deep case management
- FDX certification depth
- advanced notification infrastructure

### 4.5 Genesis reserves

- disputes
- collections
- deep loan servicing
- full cards network integrations
- certified open banking programs
- advanced AML operations
- complex onboarding/KYC production flows

---

## 5) Packaging model and governance

### 5.1 Modular monolith + feature flags

- Single deployable backend
- Strict bounded context boundaries
- Packs are additive modules with feature flags and compatibility metadata
- The Genesis pack defines the required kernel shape; packs extend around it

### 5.2 Pack rules (must be enforced by tests)

Packs **may add**:
- bounded contexts
- APIs
- events
- migrations
- UI routes and screens
- console panels
- seed datasets
- provider adapters
- gate cases

Packs **must not**:
- change Genesis ledger invariants
- break core transaction-view fields
- replace kernel contracts in-place
- directly reshape existing domain models around external providers

Any breaking change => **Genesis vNext**, not “just a pack tweak.”

### 5.3 Pack compatibility metadata

Every pack must declare:
- minimum Genesis version
- required bounded contexts or ports
- optional adapters satisfied
- feature flag identifiers
- whether it introduces new provider categories or only new domain features

---

## 6) Canonical repo + folder structure (revised for explicit DDD/Hex)

The structure below is mandatory. It extends the original tree with explicit architecture guidance for application/services and ports/adapters.

```text
nebulus_financial/
├─ README.md
├─ GENESIS_PACK.md
├─ PACKS.md
├─ VERSIONING.md
│
├─ docs/
│  ├─ index.md
│  ├─ genesis/
│  │  ├─ 00_readme.md
│  │  ├─ 01_principles.md
│  │  ├─ 02_architecture/
│  │  │  ├─ context_map_index.md
│  │  │  ├─ system_overview.md
│  │  │  ├─ hexagonal_stance.md
│  │  │  ├─ application_layer_conventions.md
│  │  │  ├─ port_catalog.md
│  │  │  ├─ adapter_taxonomy.md
│  │  │  ├─ provider_mapping_matrix.md
│  │  │  ├─ integration_conventions.md
│  │  │  ├─ deployment_profiles.md
│  │  │  └─ diagrams/
│  │  │     ├─ context_map.mmd
│  │  │     ├─ service_map.mmd
│  │  │     ├─ core_flows.mmd
│  │  │     ├─ ledger_posting_flow.mmd
│  │  │     └─ hex_seams.mmd
│  │  │
│  │  ├─ 03_domain/
│  │  │  ├─ domain_index.md
│  │  │  ├─ identity_access.md
│  │  │  ├─ customer_profile.md
│  │  │  ├─ accounts_savings.md
│  │  │  ├─ core_ledger.md
│  │  │  ├─ transfers_internal.md
│  │  │  ├─ interest_savings.md
│  │  │  ├─ error_model.md
│  │  │  └─ extension_points.md
│  │  │
│  │  ├─ 04_application/
│  │  │  ├─ app_index.md
│  │  │  ├─ command_catalog.md
│  │  │  ├─ query_catalog.md
│  │  │  ├─ use_case_orchestration.md
│  │  │  ├─ transaction_boundary_rules.md
│  │  │  └─ idempotency_and_retries.md
│  │  │
│  │  ├─ 05_contracts/
│  │  │  ├─ api_overview.md
│  │  │  ├─ openapi/
│  │  │  │  ├─ genesis.openapi.yaml
│  │  │  │  └─ console.openapi.yaml
│  │  │  ├─ events/
│  │  │  │  ├─ envelope.schema.json
│  │  │  │  ├─ account_opened.schema.json
│  │  │  │  ├─ journal_entry_posted.schema.json
│  │  │  │  ├─ transfer_posted.schema.json
│  │  │  │  └─ interest_posted.schema.json
│  │  │  └─ examples/
│  │  │     ├─ api_requests.md
│  │  │     └─ event_examples.md
│  │  │
│  │  ├─ 06_experience/
│  │  │  ├─ experience_index.md
│  │  │  ├─ ia_routes.md
│  │  │  ├─ ui_state_conventions.md
│  │  │  ├─ copy_baseline.md
│  │  │  ├─ web_overview.md
│  │  │  ├─ mobile_overview.md
│  │  │  └─ journeys/
│  │  │     ├─ auth_login.md
│  │  │     ├─ open_savings_account.md
│  │  │     ├─ accounts_list.md
│  │  │     ├─ account_detail.md
│  │  │     ├─ transaction_listing.md
│  │  │     └─ internal_transfer.md
│  │  │
│  │  ├─ 07_console_ops/
│  │  │  ├─ console_index.md
│  │  │  ├─ rbac_baseline.md
│  │  │  ├─ system_overview.md
│  │  │  ├─ correlation_search.md
│  │  │  ├─ build_snapshot.md
│  │  │  └─ pack_registry_view.md
│  │  │
│  │  ├─ 08_data_persistence/
│  │  │  ├─ data_index.md
│  │  │  ├─ postgres_schema.md
│  │  │  ├─ repositories.md
│  │  │  ├─ read_models.md
│  │  │  ├─ outbox.md
│  │  │  └─ seed_data.md
│  │  │
│  │  ├─ 09_runtime_infra/
│  │  │  ├─ runtime_controls.md
│  │  │  ├─ local_stack.md
│  │  │  ├─ service_dependencies.md
│  │  │  └─ config_profiles.md
│  │  │
│  │  ├─ 10_observability/
│  │  │  ├─ telemetry_field_dictionary.md
│  │  │  ├─ metrics_minimum.md
│  │  │  ├─ logging_minimum.md
│  │  │  ├─ tracing_minimum.md
│  │  │  ├─ alert_rules_baseline.md
│  │  │  └─ built_in_dashboards.md
│  │  │
│  │  ├─ 11_build_transparency/
│  │  │  ├─ built_by_page.md
│  │  │  ├─ build_stats_schema.json
│  │  │  └─ conformance_receipt.md
│  │  │
│  │  ├─ 12_testing_conformance/
│  │  │  ├─ testing_index.md
│  │  │  ├─ gate_definitions.md
│  │  │  ├─ scenario_catalog.md
│  │  │  ├─ reports.md
│  │  │  └─ ui_smoke_matrix.md
│  │  │
│  │  └─ 13_pack_extension_guide/
│  │     ├─ pack_template.md
│  │     ├─ pack_metadata_template.yaml
│  │     ├─ port_extension_rules.md
│  │     └─ compatibility_rules.md
│  │
│  └─ storefront/
│     ├─ index.md
│     ├─ products.md
│     ├─ architecture.md
│     └─ built_by.md
│
├─ contracts/
│  ├─ openapi/
│  └─ events/
│
├─ apps/
│  ├─ web/
│  ├─ mobile/
│  └─ console/
│
├─ modules/
│  ├─ kernel/
│  │  ├─ identity_access/
│  │  ├─ customer_profile/
│  │  ├─ accounts_savings/
│  │  ├─ core_ledger/
│  │  ├─ transfers_internal/
│  │  └─ interest_savings/
│  │
│  ├─ shared/
│  │  ├─ domain/
│  │  ├─ application/
│  │  ├─ contracts/
│  │  └─ observability/
│  │
│  └─ packs/
│     └─ ...
│
├─ adapters/
│  ├─ inbound/
│  │  ├─ http/
│  │  ├─ console/
│  │  ├─ events/
│  │  └─ jobs/
│  └─ outbound/
│     ├─ persistence/
│     ├─ messaging/
│     ├─ telemetry/
│     ├─ notifications/
│     ├─ workflow/
│     ├─ risk/
│     ├─ identity/
│     ├─ payments/
│     └─ analytics/
│
├─ seed/
├─ tests/
├─ tools/
└─ artifacts/
```

### Notes on this structure

- `docs/genesis/**` remains the canonical design pack.
- `modules/**` makes bounded-context packaging explicit.
- `adapters/**` makes Hex edges explicit.
- `04_application/` forces the design pack to specify orchestration explicitly.
- `02_architecture/port_catalog.md` and `provider_mapping_matrix.md` tie the Nebulus design to the fintech landscape and future adapter strategy.

---

## 7) Content requirements per Genesis file/folder

This section defines what must be inside each file, emphasizing the DDD + Hex layers.

### 7.1 Root files

#### `GENESIS_PACK.md`
Must include:
- pack intent
- target outcomes
- non-goals
- golden journeys
- required commands: `up | down | seed | test`
- enabled pack set for a Genesis-only build
- acceptance checklist
- explicit statement of which external capabilities are stubbed vs real in Genesis

#### `PACKS.md`
Must include:
- additive-only rules
- compatibility metadata rules
- provider-adapter extension policy
- how packs add new bounded contexts, adapters, or routes without mutating Genesis invariants

#### `VERSIONING.md`
Must include:
- semver rules for Genesis + packs
- compatibility constraint format
- breaking change policy
- rules for contract versioning at port boundaries

---

### 7.2 `docs/genesis/02_architecture/`

#### `context_map_index.md` (critical)
Must include:
- table: **Bounded Context | Purpose | Owner (Genesis or Pack) | Status (implemented/stubbed/reserved) | Seams | Primary Ports**
- context map showing BC interactions
- explicit “do not implement in Genesis” guardrails for reserved BCs

#### `system_overview.md`
Must include:
- narrative of the Genesis platform shape
- how consumer apps, console, kernel, observability, and seed fit together
- where packs attach
- where adapters sit relative to the core

#### `hexagonal_stance.md`
Must include:
- the explicit layering model:
  - domain
  - application
  - inbound adapters
  - outbound adapters
- rules for what each layer may and may not do
- anti-corruption rule for provider models
- dependency direction rules

#### `application_layer_conventions.md`
Must include:
- command handler conventions
- query service conventions
- transaction boundary rules
- orchestration rules
- retry and idempotency patterns
- what belongs in application services versus domain services

#### `port_catalog.md`
Must include:
- platform-wide canonical ports
- owning bounded context for each port
- port direction (inbound/outbound)
- capability description
- whether Genesis uses a real or stub adapter

At a minimum, define:
- `IdentitySessionPort`
- `LedgerRepositoryPort`
- `AccountReadModelPort`
- `NotificationPort`
- `TelemetrySinkPort`
- `ProcessEnginePort`
- `FraudDecisionPort` (stub if not real in Genesis)
- `PaymentRailExecutionPort` (reserved or stub)
- `WalletTokenizationPort` (reserved)
- `ConsentManagementPort` (reserved or FDX pack-owned)

#### `adapter_taxonomy.md`
Must include adapter families aligned to the fintech landscape:
- core/persistence adapters
- workflow adapters
- risk/decisioning adapters
- identity adapters
- payment rail adapters
- payment scheme/network adapters
- wallet/interface adapters
- analytics adapters
- notification adapters

#### `provider_mapping_matrix.md`
Must include:
- capability family
- owned port
- potential provider examples
- Genesis default implementation
- pack ownership if introduced later

This is the bridge between Nebulus and the fintech landscape map.

#### `integration_conventions.md`
Must include:
- event envelope requirements
- API vs event usage rules
- outbox requirement
- retry and idempotent consumer rules
- correlation-id conventions
- provider failure and fallback handling rules

#### `deployment_profiles.md`
Must include:
- local profile
- future cloud profiles
- which adapters are stubbed or local-only in local profile
- what “batteries-included local” means for Genesis

---

### 7.3 `docs/genesis/03_domain/`

Each domain file must include:
- purpose and scope
- ubiquitous language
- key entities / aggregates / value objects
- commands and invariants
- domain events emitted
- read models required
- error codes used
- boundaries with other contexts
- which ports are invoked by the application layer on behalf of this domain
- test requirements and gates

#### `core_ledger.md` (mandatory minimum spec)
Must include:
- double-entry invariant
- immutability and reversal policy
- balance definitions (current / available)
- posting taxonomy registry rules
- canonical transaction-view contract
- clear statement that ledger semantics remain internal and canonical regardless of downstream provider adapters

#### `interest_savings.md`
Must include:
- daily accrual, monthly posting
- Actual/365 basis
- rounding at posting time; remainder carry
- idempotency keys for accrual and posting runs
- ledger entry structure
- boundary between interest domain logic and scheduling/orchestration logic

#### `transfers_internal.md`
Must include:
- posted-only transfer model for Genesis
- idempotency requirement
- resulting ledger postings + transaction view mapping
- explicit note that external payment rails are out of scope for Genesis kernel and belong behind `PaymentRailExecutionPort`

#### `extension_points.md`
Must include:
- kernel extension points
- allowed pack seams
- provider-facing capability seams
- registry-style extension points
- strict rule: packs extend; do not modify kernel invariants

---

### 7.4 `docs/genesis/04_application/`

This folder is new and mandatory.

#### `app_index.md`
Must include:
- purpose of the application layer
- list of primary use cases
- conventions for command handling and queries
- cross-BC orchestration rules

#### `command_catalog.md`
Must include the command inventory for Genesis, including at least:
- `Login`
- `OpenSavingsAccount`
- `ListAccounts`
- `GetAccountDetail`
- `ListTransactions`
- `CreateInternalTransfer`
- `PostInterestRun` (if driven from an application service / job)
- console-facing query or correlation retrieval commands where relevant

Each command entry must include:
- intent
- initiating actor
- owning application service
- participating domain objects
- outbound ports touched
- emitted events
- idempotency semantics

#### `query_catalog.md`
Must include:
- accounts list query
- account detail query
- transaction list query
- console system overview query
- console correlation search query
- build snapshot query

#### `use_case_orchestration.md`
Must include the ordered orchestration for each golden journey.

#### `transaction_boundary_rules.md`
Must include:
- where transactional boundaries begin/end
- what is synchronous vs eventual
- how outbox publication is coordinated with DB writes

#### `idempotency_and_retries.md`
Must include:
- command idempotency rules
- event consumer idempotency rules
- retry backoff conventions
- duplicate handling expectations

---

### 7.5 `docs/genesis/05_contracts/`

#### `openapi/genesis.openapi.yaml`
Must include endpoints needed for the golden journeys:
- auth/login boundary or explicit demo stub
- accounts create/list/get
- transactions list
- transfers create
- build info endpoint
- health/build metadata endpoints if console requires them
- all error codes referenced in `error_model.md`

#### `events/*.schema.json`
Must include:
- event envelope schema
- `account_opened`
- `journal_entry_posted`
- `transfer_posted`
- `interest_posted`
- examples for each

#### Contract rule
HTTP contracts are inbound adapter contracts, not domain object definitions.  
They may map to application commands and queries, but must not become the canonical domain model.

---

### 7.6 `docs/genesis/06_experience/`

Each journey must explicitly reference:
- initiating actor
- API/application commands involved
- domain outcomes
- emitted events
- related console observability view
- failure and degraded states

#### `mobile_overview.md`
Must include:
- Expo Router conventions
- token storage rules
- degraded behavior rules
- route groups
- experiment rules
- build snapshot surface

#### `journeys/*.md`
Each journey must include:
- actor
- preconditions
- route/screens
- states
- API/application interactions
- domain consequences
- emitted events
- observability traces expected
- gate coverage references

This makes the experience docs usable as acceptance inputs for the squad.

---

### 7.7 `docs/genesis/07_console_ops/`

Must include enough to make the console a believable operator surface for the demo.

At minimum:
- system overview
- correlation search
- build snapshot
- pack registry view
- masked account lookup if available

Console docs must specify:
- what API/query layer they hit
- what observability data they surface
- what is read-only in Genesis
- what operational actions are explicitly out of scope

---

### 7.8 `docs/genesis/08_data_persistence/`

Must include:
- persistence model per bounded context
- repository expectations
- outbox storage and replay rules
- read-model update rules
- seed dataset structure

Persistence adapters must implement owned ports.  
Repositories are not the domain.

---

### 7.9 `docs/genesis/09_observability/`

Must include:
- trace IDs and correlation conventions
- required fields for logs / traces / metrics
- minimum dashboards
- how golden journeys appear in telemetry
- which adapter interactions must be traced

This is especially important because provider-adapter seams and stub seams need to be visible in traces.

---

### 7.10 `docs/genesis/10_build_transparency/`

Must include:
- build provenance
- generated build stats
- agent contribution receipt format
- what constitutes a valid conformance receipt

---

### 7.11 `docs/genesis/11_testing_conformance/`

Must include:
- gate definitions
- scenario catalog
- UI smoke matrix
- contract conformance tests
- domain invariant tests
- adapter conformance tests
- route-to-gate traceability

---

### 7.12 `docs/genesis/13_pack_extension_guide/`

Must include:
- how packs add new bounded contexts
- how packs add new outbound adapters
- how packs register new commands, queries, and routes
- how packs declare new provider capability mappings
- how packs extend the provider matrix without mutating the kernel

---

## 8) Required bounded contexts for Genesis

Genesis must explicitly define these core contexts:

- `identity_access`
- `customer_profile`
- `accounts_savings`
- `core_ledger`
- `transfers_internal`
- `interest_savings`

Reserved / likely future:
- `accounts_checking`
- `card_account`
- `loan_account`
- `consent`
- `workflow`
- `case`
- `transaction_tags`
- `fraud_risk`
- `external_payments`

Each bounded context must declare:
- owned aggregates
- inbound commands/queries
- outbound ports
- published events
- dependent contexts
- whether implemented, stubbed, or reserved

---

## 9) Canonical port catalog (minimum set)

This section is binding. Genesis must define the following ports even if some are initially fulfilled by local or stub adapters.

### 9.1 Core ports

#### `LedgerRepositoryPort`
Purpose:
- persist and retrieve authoritative ledger and journal data

Likely Genesis adapter:
- Postgres repository adapter

#### `AccountReadModelPort`
Purpose:
- serve account list/detail/read-model access

Likely Genesis adapter:
- SQL/read-model adapter

#### `TelemetrySinkPort`
Purpose:
- emit structured telemetry, traces, or events into observability sinks

Likely Genesis adapter:
- local OTEL / log adapter

#### `NotificationPort`
Purpose:
- send user/operator notifications

Likely Genesis adapter:
- deterministic local notification stub

#### `IdentitySessionPort`
Purpose:
- issue/validate session context for demo auth boundary

Likely Genesis adapter:
- local auth/session adapter

### 9.2 Workflow and integration ports

#### `ProcessEnginePort`
Purpose:
- abstract workflow/case orchestration engine interactions

Likely Genesis adapter:
- stub or local implementation

#### `FraudDecisionPort`
Purpose:
- request a fraud / risk decision for a payment or action

Genesis status:
- stubbed or reserved unless a risk pack is included

Possible future adapters:
- Feedzai
- Featurespace
- SEON
- Sardine
- demo deterministic adapter

#### `PaymentRailExecutionPort`
Purpose:
- execute or simulate external payment rail movement

Genesis status:
- reserved or deterministic stub

Possible future adapters:
- RTP
- FedNow
- ACH processor
- simulated local adapter

#### `WalletTokenizationPort`
Purpose:
- request tokenization or wallet interaction support

Genesis status:
- reserved

Possible future adapters:
- Apple Pay / wallet abstraction
- bank wallet integration
- demo stub

#### `ConsentManagementPort`
Purpose:
- manage sharing/consent lifecycle for open banking surfaces

Genesis status:
- reserved or FDX-pack owned

### 9.3 Port rules

- Ports belong to Nebulus, not vendors.
- Vendors only appear in adapter implementations and mapping docs.
- Stub adapters must be deterministic and traceable.
- No port may be introduced that is merely a synonym for a vendor.

---

## 10) Provider capability mapping matrix

Genesis must include a provider mapping matrix that links the future fintech landscape to Nebulus capability seams.

Minimum structure:

| Capability Family | Port | Genesis Implementation | Future Adapter Examples | Owner |
|---|---|---|---|---|
| Workflow / Cases | ProcessEnginePort | local stub | Temporal, Camunda, custom | Pack |
| Fraud / Risk | FraudDecisionPort | deterministic stub | Feedzai, Featurespace, SEON, Sardine | Pack |
| Notifications | NotificationPort | local stub | Twilio, SendGrid, internal | Genesis |
| Identity Session | IdentitySessionPort | local adapter | Ping, Auth0, Cognito | Genesis/Pack |
| Payment Rails | PaymentRailExecutionPort | reserved/stub | RTP, FedNow, ACH | Pack |
| Wallet / Tokenization | WalletTokenizationPort | reserved | Apple Pay, Paze, bank wallet | Pack |

This matrix is the conceptual bridge between:
- Nebulus internal architecture
- future provider adapters
- and the fintech landscape map

---

## 11) Anti-drift rule (strengthened)

Agents must not generate implementation code for a capability until:

- the bounded-context spec exists
- its application/use-case spec exists
- its API and/or event contract exists
- its journey spec exists if user-visible
- its conformance gate exists
- its port and adapter seam are identified if it depends on external capabilities

This rule is binding.

---

## 12) Stub policy (new and mandatory)

A stub is valid only if it includes:

- a declared owned port
- deterministic behavior
- fixed or seed-driven outputs
- observability visibility
- documented replacement guidance
- a gate proving consistent behavior

A stub may **not**:
- bypass the application layer
- embed provider terms into the domain
- become the canonical contract by accident

---

## 13) Agent operating model and handoff contracts

The design pack should be buildable by a squad. Therefore each major role must have an artifact contract.

### 13.1 Lead / Integrator
Owns:
- overall build plan
- sequence
- merge gating
- conflict resolution
- final conformance receipt

### 13.2 Architecture Agent
Owns:
- context map
- hex seams
- port catalog
- provider mapping matrix
- bounded-context ownership table

### 13.3 Domain Agent
Owns:
- ubiquitous language
- aggregates/invariants
- domain events
- extension points

### 13.4 Application Agent
Owns:
- commands
- queries
- orchestration flows
- transaction boundary rules
- idempotency patterns

### 13.5 Contracts Agent
Owns:
- OpenAPI
- event schemas
- examples
- error model alignment

### 13.6 Experience Agents
Own:
- web/mobile IA
- journeys
- UI state conventions
- copy baseline
- build realism for the golden paths

### 13.7 Console / Ops Agent
Owns:
- console journeys
- correlation search
- build snapshot
- pack registry view
- operator narratives

### 13.8 Data / Persistence Agent
Owns:
- repository contracts
- schema docs
- read-model projections
- seed determinism

### 13.9 QA / Conformance Agent
Owns:
- gate catalog
- scenario-to-gate mapping
- adapter conformance tests
- route completeness validation

---

## 14) Testing and conformance expectations

The following gates are required.

### 14.1 Domain invariant gates
Must prove:
- ledger double-entry
- reversal policy
- transfer correctness
- interest posting rules
- deterministic balance outcomes

### 14.2 Contract gates
Must prove:
- OpenAPI validity
- event schema validity
- example payload correctness
- error code coverage

### 14.3 Journey gates
Must prove:
- web and mobile golden journeys complete end to end
- backend state matches expected journey outcomes

### 14.4 Adapter conformance gates
Must prove:
- stub adapters satisfy port contracts
- process engine adapter conformance if workflow pack is enabled
- future provider adapters can be verified against owned ports

### 14.5 Observability gates
Must prove:
- trace continuity through golden journeys
- correlation ID presence
- build snapshot visibility
- key telemetry fields emitted

### 14.6 Seed determinism gates
Must prove:
- baseline_v1 seed produces deterministic records
- example flows run against known dataset outputs

---

## 15) Pack model (DDD/Hex-aligned revisions)

The original pack taxonomy remains useful. This revision clarifies how packs extend bounded contexts, ports, and adapters.

### A) Checking Pack
May add:
- `accounts_checking`
- optional `fees_checking`
- posting types for checking
- checking UI routes
- read models and journeys

Must not mutate:
- Genesis ledger invariants
- transaction view base fields

### B) Cards Pack
May add:
- `card_account`
- `card_authorization`
- `clearing_settlement`
- card timelines and controls
- optional payment network adapters via owned ports

Must explicitly state:
- which aspects are simulated
- which adapters are stubbed
- how auth-hold semantics map to available/current balance

### C) Loans Pack
May add:
- `loan_account`
- `amortization_schedule`
- `payments`
- loan journeys and console panels

Must preserve:
- kernel ledger rules
- canonical posting model

### D) FDX / Open Banking Pack
Owns:
- `consent`
- `data_sharing`
- `client_registry`
- `ConsentManagementPort` implementations or exposures

### E) Analytics & Experiments Pack
May add:
- analytics events
- client/server experiment plumbing
- console analytics panels

Must preserve:
- no PII analytics rule
- additive-only event schema strategy

### F) Tagging Pack
May add:
- `transaction_tags`
- tag APIs
- tag UI and console views

### G) Workflow / Case Management Pack
Owns:
- `case`
- `workflow`
- `ProcessEnginePort` adapter realizations

This remains the clean example of a capability port fulfilled by pack-owned adapters.

---

## 16) Suggested first authoring sequence (revised)

The authoring order matters. Agents should work in this sequence:

1. `docs/genesis/02_architecture/context_map_index.md`
2. `docs/genesis/02_architecture/hexagonal_stance.md`
3. `docs/genesis/02_architecture/port_catalog.md`
4. `docs/genesis/03_domain/core_ledger.md`
5. remaining core domain specs
6. `docs/genesis/04_application/command_catalog.md`
7. `docs/genesis/04_application/use_case_orchestration.md`
8. contracts (OpenAPI + event schemas)
9. experience journeys
10. console ops
11. data persistence and seed docs
12. observability docs
13. gate definitions
14. pack extension guide

This sequence is designed to prevent implementation drift and preserve architectural integrity.

---

## 17) Final assessment standard

A revised Genesis build should be judged by this standard:

- Does it preserve the clarity and discipline of the original design pack?
- Does it make the domain language canonical and stable?
- Does it make the application layer explicit?
- Does it define capability ports cleanly?
- Does it keep providers at the edge?
- Does it prove the golden demo slice end to end?
- Does it remain extensible through packs without forcing a Genesis rewrite?

If yes, the design pack is fit for squad execution.

---

## 18) Closing principle

Nebulus should behave as a **canonical internal banking platform** with a **clean DDD + Hex foundation**, not as a collage of provider-specific integrations.

That is what will let it serve both:
- as a believable demo banking platform
- and as a long-lived reference architecture that can later map cleanly to the broader fintech landscape.
