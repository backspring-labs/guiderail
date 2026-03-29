# PRD: GuideRail Live Walkthrough Sessions

## Document Status
Draft PRD

## Product
GuideRail

## Feature
Live Walkthrough Sessions

## Working Title
Participant Join / Follow Mode

---

## 1. Executive Summary

GuideRail should add a lightweight multi-participant session mode that allows one person to act as a **guide** while others **join via a short code** and follow the walkthrough live.

This feature is intentionally narrower than full collaborative editing and intentionally lighter than a full authentication system. Its purpose is to make GuideRail useful for **live guided architecture exploration**, not to turn GuideRail into a general-purpose collaborative canvas.

The first release should focus on a simple but high-value loop:

- a guide starts a live walkthrough session
- participants join with a short code and a display name
- participants can choose to **follow the guide**
- participants can temporarily navigate independently
- participants can **return to tour**
- participants can leave **anchored questions**
- later phases may add **sticky notes** and richer annotation behavior

The core product insight is that GuideRail is evolving from a single-user explorer into a **shared guided exploration surface**. The most valuable collaboration primitive is not freeform editing. It is **shared guided presence around a modeled topic**.

This feature makes GuideRail more valuable for:
- product demos
- architecture walkthroughs
- onboarding
- training
- design reviews
- risk/control walkthroughs
- collaborative exploration of a modeled corpus

---

## 2. Product Intent

GuideRail already models a guided descent through perspectives. Once that experience becomes strong enough to teach one person, the next natural extension is to let one person **lead others through it**.

The intent of Live Walkthrough Sessions is to:

- let a guide lead others through a corpus in real time
- preserve the integrity of the GuideRail walkthrough experience
- add lightweight participation before committing to full auth and enterprise collaboration
- enable collaborative discussion that stays anchored to modeled entities and perspectives
- make GuideRail viable for teaching, review, and demo settings
- establish the collaboration substrate that can later support richer presence, permissions, comments, and evidence capture

This is not about cloning Figma. It is about expressing collaboration in a GuideRail-native way.

The collaboration model should be centered on:
- guide state
- participant state
- follow mode
- perspective and focus context
- route and waypoint progression
- anchored discussion

not on:
- arbitrary freeform co-editing
- multi-user visual design tooling
- unconstrained canvas manipulation

---

## 3. Problem Statement

GuideRail today is primarily a single-user experience. A person can explore a corpus, play guided routes, and descend through perspectives, but there is no lightweight way for a group to experience that exploration together.

This creates several limitations:

1. A guide cannot easily lead participants through a live walkthrough.
2. Participants cannot stay synchronized with the guide’s current location.
3. Questions and comments are not anchored to the actual modeled entities being discussed.
4. There is no lightweight participation mode short of future full auth and persistent collaboration systems.
5. GuideRail is missing a high-value teaching and review mode that naturally fits its product direction.

In practice, that means a team using GuideRail for a walkthrough ends up screen-sharing or narrating externally rather than collaborating inside the product.

---

## 4. Vision

GuideRail should support a shared live session where participants can join quickly, follow the guide’s current context, temporarily explore independently, return to the guide’s current location, and leave context-aware questions and notes that remain attached to the modeled content.

The best first version should feel like:

- easy to start
- easy to join
- easy to follow
- easy to break away
- easy to return
- anchored to the GuideRail model
- constrained enough to remain coherent

The product should feel like a **live walkthrough environment**, not like a generic multiplayer whiteboard.

---

## 5. Goals

### Primary goals
- Enable live multi-participant walkthroughs without full authentication.
- Allow a guide to broadcast their current GuideRail context to participants.
- Allow participants to follow the guide in real time.
- Allow participants to temporarily leave follow mode and later return to the guide’s current position.
- Allow participants to submit anchored questions tied to specific entities, perspectives, routes, or waypoints.
- Preserve GuideRail’s shared context model as the basis for collaboration.

### Secondary goals
- Establish a session model that can later support annotation, persistence, moderation, and roles.
- Create a strong demo/onboarding/training mode for GuideRail.
- Keep the first release lightweight enough to ship without overbuilding enterprise collaboration.

---

## 6. Non-Goals for Initial Releases

The initial releases should not attempt to solve:

- full account-based authentication
- full enterprise permissions and tenancy
- arbitrary real-time co-editing of all canvas elements
- persistent organizational workspaces
- rich threaded chat across the whole session
- generalized document collaboration
- mobile optimization
- full moderation workflows
- plugin or external collaboration ecosystem support

The first versions should remain intentionally constrained around **guided live participation**.

---

## 7. Core Product Principles

### 7.1 GuideRail-native collaboration
Collaboration should be built around GuideRail’s real primitives:
- perspective
- entity
- focus target
- route
- waypoint
- viewport
- annotation anchor
- follow state

### 7.2 Follow is the center of gravity
The most important real-time behavior is the ability for participants to follow the guide’s current position in the modeled space.

### 7.3 Breakaway must be safe
Participants should be able to explore independently without breaking the shared experience permanently.

### 7.4 Return to tour must be obvious
A participant who breaks away should always have a clear, immediate way to return to the guide’s current location.

### 7.5 Anchors matter more than chat
Questions and notes should be attached to actual GuideRail context whenever possible:
- entity
- perspective
- waypoint
- canvas location
- route

### 7.6 Lightweight first, deeper later
The first version should prove the interaction model before introducing full auth, long-term persistence, or complex governance.

### 7.7 Avoid generic canvas sprawl
Sticky notes and annotations should remain bounded and structured enough that the session stays useful rather than cluttered.

---

## 8. Personas

### 8.1 Guide / Presenter
The person leading the walkthrough.

Needs:
- create a live session quickly
- share a join code easily
- move through perspectives and routes
- know who is present
- know who is following
- answer or collect participant questions
- keep the group synchronized

### 8.2 Participant / Follower
The person joining the walkthrough.

Needs:
- join fast with minimal friction
- understand where the guide is
- follow automatically if desired
- step away temporarily without getting lost
- rejoin the guide instantly
- ask context-aware questions
- optionally leave a note on what they are seeing

### 8.3 Future Moderator / Admin
Not required in MVP, but relevant later.

Needs:
- control session roles
- manage permissions
- moderate notes/questions
- review session history

---

## 9. Primary Use Cases

### 9.1 Live architecture walkthrough
A lead architect starts a session and walks a team through a domain, journey, process, architecture, system, and sequence path.

### 9.2 Product demo
A product lead uses a session to demonstrate the corpus and route structure to stakeholders.

### 9.3 Onboarding / training
A new engineer joins a live walkthrough led by an experienced guide.

### 9.4 Risk/control review
A reviewer leads others through a process and anchored questions are left on specific control points or entities.

### 9.5 Collaborative exploration with temporary breakaway
Participants follow the guide but occasionally detach to inspect detail, then return to the guide’s current location.

---

## 10. User Stories

### Guide stories
- As a guide, I want to start a live session and get a short code so participants can join quickly.
- As a guide, I want my current perspective, route, focus, and location to be broadcast so participants can follow me.
- As a guide, I want to know which participants are present and whether they are following.
- As a guide, I want to review participant questions anchored to the content I am presenting.

### Participant stories
- As a participant, I want to join a session with a simple code and a display name.
- As a participant, I want to follow the guide automatically.
- As a participant, I want to stop following temporarily and explore on my own.
- As a participant, I want a clear “return to tour” action that takes me back to where the guide is now.
- As a participant, I want to ask a question attached to the specific entity or waypoint we are discussing.
- As a participant, I want to optionally leave a sticky note attached to a canvas point or entity.

---

## 11. MVP Scope

The MVP should be narrow and focused.

### Included
- start session
- generate join code
- join by code + display name
- participant roster
- guide presence
- participant follow mode
- participant breakaway
- return to tour
- guide state broadcast
- synchronization of:
  - perspective
  - active route
  - active waypoint
  - selected entity
  - focus targets
  - viewport state or viewport anchor
- anchored questions
- lightweight session lifecycle

### Excluded
- full auth
- persistent user identity
- org/team sharing
- rich threaded chat
- arbitrary multi-user editing
- broad note management systems
- session recording/replay
- advanced moderation
- enterprise audit model

---

## 12. Product Model

## 12.1 Session
A live collaboration container.

Proposed fields:
- sessionId
- joinCode
- status: active, ended
- guideParticipantId
- corpusId
- createdAt
- endedAt
- currentGuideState
- participantCount

## 12.2 Participant
A live session participant.

Proposed fields:
- participantId
- sessionId
- displayName
- role: guide, participant
- followMode: following, detached
- joinedAt
- lastSeenAt
- currentLocalState
- isActive

## 12.3 Guide State
The authoritative location participants may follow.

Proposed fields:
- perspectiveId
- routeId
- waypointId
- selectedEntityId
- selectedEntityType
- focusTargets
- viewport
- timestamp
- revision

## 12.4 Question
An anchored participant question.

Proposed fields:
- questionId
- sessionId
- participantId
- body
- anchorType: entity, waypoint, perspective, route
- anchorId
- createdAt
- status: open, acknowledged, resolved

## 12.5 Sticky Note
Later-phase annotation object.

Proposed fields:
- noteId
- sessionId
- participantId
- body
- anchorType: entity, canvas
- anchorId or canvasPosition
- visibility
- createdAt

---

## 13. Follow Model

Follow behavior is the heart of the feature.

### Following
When a participant is following:
- guide state changes update the participant view automatically
- participant UI indicates that they are synced to the guide
- transitions should feel intentional and stable, not jittery

### Detached / breakaway
When a participant detaches:
- they navigate freely
- their local state is not overwritten by guide changes
- they still see that the guide is elsewhere
- a visible “return to tour” affordance remains present

### Return to tour
When the participant selects return to tour:
- their current local state is replaced by the latest guide state
- perspective, focus, route, waypoint, and viewport move to the guide’s current location
- the UI clearly indicates they are following again

### Follow edge cases
Need to define behavior for:
- participant joins in the middle of a route
- guide changes route while participant is detached
- guide ends the session
- network interruptions
- stale guide state revisions

---

## 14. Functional Requirements

## 14.1 Session creation
- Guide can create a live walkthrough session from the GuideRail UI.
- System generates a short join code.
- Guide can copy/share the code.
- Session begins in active state.

## 14.2 Session join
- Participant can enter a join code.
- Participant supplies a display name.
- Participant enters the session without auth.
- Participant is placed into following mode by default unless configured otherwise.

## 14.3 Presence
- Guide sees active participants in a roster.
- Participants see the guide and optional roster presence.
- Presence updates as participants join, leave, or become inactive.

## 14.4 Guide state broadcast
- Guide navigation changes emit a session event.
- Broadcast includes current shared context needed for follower sync.

## 14.5 Follow mode
- Participants can toggle follow on/off.
- Following applies guide state updates in near real time.

## 14.6 Breakaway mode
- Participant can navigate independently while detached.
- Detached mode should be visually clear.

## 14.7 Return to tour
- Participant has a one-click action to return to the current guide state.
- This action is available prominently while detached.

## 14.8 Anchored questions
- Participant can create a question attached to:
  - entity
  - route
  - waypoint
  - perspective
- Guide can view questions in session context.

## 14.9 Sticky notes
Not required for MVP, but planned.
- Participants can drop anchored notes on an entity or canvas location.
- Notes should be bounded enough to avoid clutter.

## 14.10 Session ending
- Guide can end the session.
- Participants are notified the session has ended.
- Session state becomes read-only or unavailable depending on final design.

---

## 15. UX Concepts

### 15.1 Guide entry
Possible UI:
- “Start Live Session” in top bar or route controls
- modal with join code + copy link/code action
- participant roster panel

### 15.2 Join experience
Possible UI:
- join screen with code entry
- display name input
- optional small explainer: “You will join in follow mode”

### 15.3 Follow indicator
Participants need a strong but lightweight signal for:
- following the guide
- detached from guide
- guide moved to a new location while detached

Possible UI:
- pill/status bar
- presenter avatar/chip
- “Following Alex”
- “Detached — Return to Tour”

### 15.4 Return to tour affordance
Must be obvious and persistent while detached.

Possible UI:
- pinned button
- pill with guide current location summary
- mini banner: “Guide is now in Process > Perspective Switch with Shared Context”

### 15.5 Anchored question UX
Could be:
- ask question from entity detail panel
- ask question from waypoint panel
- ask question from contextual menu on selected entity

### 15.6 Sticky note UX
Later phase:
- drop note on canvas
- attach note to selected entity
- notes render with constrained visual style and visibility rules

---

## 16. Technical Direction

Your intuition is correct: even a lightweight version likely introduces real server-side work.

At minimum, the product will need some shared session backend capability for:
- session creation
- join code validation
- presence tracking
- guide state publication
- participant follow state
- anchored question persistence
- near-real-time event delivery

## 16.1 Likely technical components
- lightweight session service
- session store
- real-time event channel
- client session state manager
- annotation/question store
- join code generator/validator

## 16.2 Real-time model
This likely wants websocket or equivalent real-time pub/sub behavior.

Session event examples:
- session_created
- participant_joined
- participant_left
- guide_state_updated
- participant_follow_toggled
- participant_returned_to_tour
- question_created
- sticky_note_created
- session_ended

## 16.3 Client responsibilities
GuideRail client should:
- publish guide state changes when acting as guide
- subscribe to session events
- apply guide state when participant is following
- preserve local state when participant is detached
- reconcile return-to-tour transitions
- render participant/session UI

## 16.4 Data consistency concerns
Need to manage:
- ordering of guide state updates
- stale or dropped events
- reconnect behavior
- detached participant local state vs guide state
- session cleanup on disconnect

---

## 17. Architecture Implications

This feature is likely the first meaningful step from a local/single-user product into a networked shared-state product.

That has implications for:

### 17.1 State model
GuideRail currently centers around local navigation context. Live sessions introduce:
- session state
- participant state
- shared guide state
- follow reconciliation

### 17.2 Eventing
GuideRail will need explicit publish/subscribe semantics around guide actions and participant updates.

### 17.3 Persistence
Even lightweight anchored questions imply some persistence model if they are not purely ephemeral.

### 17.4 Role boundaries
Guide vs participant behavior becomes a product-level distinction even before full auth exists.

### 17.5 Future auth compatibility
The initial session model should be built in a way that can later layer in:
- authenticated identity
- org/workspace ownership
- role-based permissions
- durable history

---

## 18. Canonical GuideRail Alignment

This feature should stay deeply aligned with GuideRail’s existing model.

The shared state should be based on GuideRail primitives, not invented parallel abstractions.

The canonical shared session state should map cleanly to:
- perspective
- selection
- focus targets
- route
- waypoint
- viewport anchor
- entity IDs
- annotation anchors

This is important because collaboration should reinforce the GuideRail model rather than bypass it.

---

## 19. Phased Rollout

## Phase 1: Live follow sessions
Purpose: prove the core collaboration loop.

Scope:
- create session
- join by code
- display name only
- participant roster
- guide state broadcast
- follow mode
- detach/breakaway
- return to tour
- session end

Success criteria:
- a guide can lead participants through a walkthrough live
- participants stay in sync reliably
- breakaway and return-to-tour feel natural
- no auth required

## Phase 2: Anchored questions
Purpose: add collaborative discussion without introducing generic chat sprawl.

Scope:
- create question
- anchor to entity, perspective, route, or waypoint
- question list for guide
- open/acknowledged/resolved states

Success criteria:
- participant questions remain tied to the actual content being discussed
- guide can collect and respond to context-aware questions

## Phase 3: Sticky notes and lightweight annotations
Purpose: expand collaboration to light annotation.

Scope:
- entity-attached notes
- optional canvas-attached notes
- visibility constraints
- note styling and clutter guardrails

Success criteria:
- notes are useful and discoverable without overwhelming the canvas

## Phase 4: Persistence and identity
Purpose: evolve the feature toward durable collaboration.

Scope:
- optional auth
- saved sessions
- stronger permissions
- session history
- moderator/admin controls

Success criteria:
- sessions can support more formal review and organizational workflows

---

## 20. Guardrails

### Product guardrails
- Do not turn the first version into generic chat.
- Do not treat this as full collaborative canvas editing.
- Do not require full auth before proving the value of live walkthrough sessions.
- Do not overload the MVP with sticky-note systems before follow mode works well.

### UX guardrails
- Return to tour must always be obvious.
- Detached state must always be clear.
- Anchored discussion should prefer model anchors over freeform discussion.
- Participant UI should be lightweight and not overwhelm the walkthrough.

### Technical guardrails
- Keep the first release server-side footprint as small as possible while still reliable.
- Prefer explicit event models over hidden synchronization magic.
- Preserve a clean path to future auth and persistence.
- Avoid coupling collaboration logic too tightly to every existing canvas component.

---

## 21. Risks

### 21.1 Scope creep
This idea can easily expand into full collaboration, auth, moderation, notes, and workspace features too early.

### 21.2 Real-time complexity
Even lightweight follow mode introduces ordering, reconnect, and synchronization challenges.

### 21.3 UI clutter
Roster, follow state, questions, and notes can pollute the core GuideRail experience if not disciplined.

### 21.4 Ambiguous participant expectations
Participants may assume they can fully collaborate or edit if the experience looks too open-ended.

### 21.5 Annotation sprawl
Sticky notes can become noisy and degrade the clarity of the canvas.

---

## 22. Open Questions

- Should join code sessions be entirely ephemeral?
- Should participants join in follow mode by default?
- How much viewport synchronization is required for follow to feel right?
- Should detached participants still receive a mini-preview of where the guide is now?
- Should questions be visible to all participants or only the guide at first?
- Should sticky notes be guide-only in early versions?
- Should route/waypoint sync be stronger than free exploration sync?
- Should a participant be allowed to request the guide’s attention to a detached location?
- What is the right server-side architecture for lightweight real-time sessions in early GuideRail?

---

## 23. Success Metrics

### MVP success signals
- number of live sessions created
- participant join completion rate
- average participants per session
- follow mode adoption rate
- detach → return-to-tour completion rate
- number of anchored questions per session
- guide satisfaction in walkthrough/demo scenarios

### Qualitative success signals
- guides report the feature makes walkthroughs easier
- participants do not get lost when detaching and returning
- questions stay attached to the right content
- the feature feels like GuideRail, not like bolted-on chat

---

## 24. Recommended Naming Options

Primary candidate:
- **Live Walkthrough Sessions**

Other reasonable names:
- Participant Join
- Follow Mode
- Guided Session Mode
- Shared Walkthroughs
- Multiplayer Walkthroughs

Recommendation:
Use **Live Walkthrough Sessions** as the product concept and **Follow Mode** as the participant behavior term.

---

## 25. Final Recommendation

Proceed with this as a serious GuideRail feature exploration.

The correct first framing is:

**GuideRail needs a lightweight live collaboration mode centered on guided presence, follow behavior, and anchored discussion.**

The MVP should prove:
- one guide can lead
- many participants can join
- participants can follow
- participants can break away safely
- participants can return to tour instantly
- participants can ask context-aware questions

That is enough to validate the feature without prematurely building the entire collaboration platform around it.

---

## 26. Closing Framing

This feature matters because it extends GuideRail from a single-user guided explorer into a shared guided experience.

That is a meaningful product step.

It allows GuideRail to become not only a tool for understanding modeled systems, but a place where teams can explore those systems together in real time.

The core idea is simple and strong:

- the guide leads
- the participants follow
- the model stays anchored
- the discussion stays attached to the work
- the experience remains unmistakably GuideRail
