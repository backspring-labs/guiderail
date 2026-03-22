# Addendum — Session Replay

## Purpose
This addendum captures an additional capability for the **Interactive Flow Visualizer** concept: the ability to reconstruct and replay a specific user session from logs, traces, or other recorded telemetry.

This extends the core idea from a design-review and architecture-explainability tool into a **post-event replay and investigation surface**.

## Addendum Summary
In addition to showing how a flow is supposed to work, the platform could also replay **what actually transpired** for a particular user session.

That means the system would not only support modeled or generated sequence flows from the codebase, but could also ingest runtime evidence and reconstruct:

- the user journey that occurred
- the request sequence that was executed
- the headers or token context involved
- the services and objects traversed
- the persistence or event side effects triggered
- the final outcome or failure point

This would make the visualizer useful not only for planned explanation, but also for **forensics, support, audit reconstruction, and troubleshooting**.

## Core Concept
Given a single user session, correlation ID, trace ID, request chain, or similar runtime identifier, the system could replay the session visually.

The replay would show:

- **Left pane:** what the user likely experienced or what UI state transitions occurred
- **Right pane:** the actual backend traversal inferred from logs and traces
- **Top band:** request metadata and security context observed at each step
- **Bottom band:** persistence, cache, queue, audit, and event activity emitted during the session

This turns the tool into a kind of **runtime playback console** for real user behavior.

## Why This Is Powerful
The original concept helps explain how the system works.

This extension helps explain **what happened in a real case**.

That makes it useful for:

- production investigations
- support escalations
- security incident review
- audit reconstruction
- customer dispute analysis
- debugging hard-to-reproduce issues
- validating whether runtime behavior matched intended architecture
- training teams using real examples

In other words, it adds a “flight recorder” mode to the concept.

## Example Use Cases

### 1. Production issue investigation
A customer reports that a payment failed or behaved unexpectedly.

Using the session replay capability, the team could:
- locate the relevant session
- replay the UI and service flow
- inspect the request progression
- identify which service or dependency failed
- see whether retries, events, or persistence actions occurred
- determine whether the user-facing result matched backend state

### 2. Security review
A reviewer wants to understand how auth context was propagated for a specific request chain.

The replay could show:
- incoming token context
- where validation occurred
- which services consumed or forwarded identity context
- what headers were present at each hop
- whether token handling matched expected policy

### 3. Audit / exam reconstruction
Instead of manually assembling screenshots, log snippets, and architecture notes, the team could replay an actual session path and show:

- what the user did
- what the system did
- what was stored
- what controls were exercised
- how the request completed

### 4. Support and customer success
Support teams often struggle to bridge the gap between a user complaint and backend evidence.

A session replay view could help them understand:
- where the user was in the journey
- whether the issue was UI, API, orchestration, dependency, or state-related
- whether the system partially completed work behind the scenes

## Data Sources
This capability could be fed from one or more evidence sources, such as:

- structured application logs
- request logs
- distributed tracing systems
- OpenTelemetry spans
- audit events
- API gateway logs
- browser or mobile telemetry
- session analytics streams
- queue/event bus traces
- persistence activity logs

The first implementation probably should not try to support everything.  
A narrow starting point would be better.

## Recommended Input Keys
To make session replay practical, the system may need to anchor around identifiers such as:

- session ID
- correlation ID
- trace ID
- request ID chain
- customer interaction ID
- user ID plus time window
- case/ticket ID linked to telemetry

## Replay Model
A session replay feature would likely work as a time-ordered playback model.

Possible event types:
- UI state entered
- button/action triggered
- request issued
- auth context attached
- service invoked
- validation performed
- persistence action completed
- cache hit/miss/write
- event emitted
- external dependency called
- error returned
- response rendered
- session terminated

These events could then be normalized into a unified replay timeline.

## Key Product Value
This adds a second operating mode to the product:

### Mode 1 — Designed Flow View
How the system is expected to work, based on generated or modeled flow definitions.

### Mode 2 — Session Replay View
How a real user session actually unfolded, based on logs and trace evidence.

That duality is powerful because it allows comparison between:
- intended behavior
- actual behavior

Over time, that could become a major differentiator.

## Important Design Considerations

### 1. Replay is not the same as raw log viewing
This should not become a glorified log viewer.

The value comes from:
- sequence reconstruction
- abstraction
- synchronized visualization
- cross-layer storytelling

### 2. Data will be incomplete in some environments
Not every session will have perfect observability. The design should tolerate missing spans, partial logs, and inferred transitions.

### 3. Privacy and masking are critical
If replaying real sessions, the platform must handle:
- PII masking
- token redaction
- role-based access
- environment controls
- auditability of who viewed the replay

### 4. UI-state reconstruction may be approximate
Depending on telemetry quality, the left-side “what the user saw” may need to be:
- exact, when captured directly
- inferred, when based on route transitions or known flow states
- marked as inferred when certainty is lower

### 5. Timeline controls matter
Replay should feel usable, not overwhelming.

Useful controls may include:
- play
- pause
- next step
- previous step
- jump to failure
- jump to persistence
- jump to token validation
- change playback speed
- filter by subsystem

## Suggested MVP for Session Replay
Keep the first version tight.

### MVP scope
Support replay for a single known flow, such as:
- login
- payment initiation
- transfer flow
- account lookup

### MVP inputs
Use one or two data sources only, such as:
- structured JSON logs
- OpenTelemetry traces

### MVP outputs
- replay timeline
- synchronized service sequence view
- top-band request summary
- bottom-band side effect summary
- key event/failure markers

### MVP goal
Prove that a real session can be turned into a readable narrative instead of a pile of telemetry.

## Spec Additions This Suggests
If the broader product moves toward a real specification, this addendum implies new spec sections such as:

### Session Replay Ingestion
- accepted trace/log formats
- normalization process
- correlation strategy
- ordering rules
- missing-data handling

### Session Timeline Model
- event schema
- timestamps
- causality and parent/child relationships
- inferred vs observed markers
- branch and retry handling

### Privacy / Security Model
- masking rules
- access control
- retention policies
- sensitive-field detection
- replay export restrictions

### Investigation UX
- search by trace/session/correlation ID
- replay filters
- jump-to-error shortcuts
- annotations
- bookmarking notable moments
- side-by-side compare with expected flow

## Strategic Value
This makes the concept more than an architecture visualization product.

It starts to look like a blend of:
- architecture explainability
- observability replay
- security review tooling
- audit reconstruction
- support investigation tooling

That is a strong expansion because it grounds the idea in both:
- **planned system understanding**
- **actual runtime truth**

## Closing Thought
The original idea answers:

**“How does this system work?”**

This addendum adds a second, equally valuable question:

**“What happened in this specific session?”**

That is a meaningful extension and probably one of the strongest follow-on capabilities for the overall concept.
