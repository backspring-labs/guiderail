# Data integrity contract

What GuideRail accepts as content, what it rejects, and what it reports. The content loader, the kernel and the web app all follow this document. It describes the entities that exist today; it is not the 1.0 content package design.

The rule behind every section: **nothing is dropped, overwritten or reinterpreted silently.** If input is not used as written, a diagnostic says so.

Implemented in `packages/core/src/content/`.

## 1. Partial datasets

A dataset is a JSON object whose keys are collections (`domains`, `nodes`, `steps`, …).

| Input | Result |
|---|---|
| A collection is omitted | Valid. It loads as an empty array. No diagnostic |
| A collection is present and is an empty array | Valid. No diagnostic |
| A collection is present but is not an array | **Error** `not_an_array`. It loads as empty |
| A key is not a known collection | **Warning** `unknown_section`. Its content is ignored |

The kernel and the UI must work with any subset of collections. A view with nothing to show renders an empty state; it does not fail.

## 2. Malformed entities

Each entity is validated against its schema.

| Input | Result |
|---|---|
| An entity fails its schema | **Error** `invalid_entity`, with the collection and its position. The entity is dropped; the rest of the collection loads |

## 3. Identity

An entity's `id` is its identity. References between entities are by id.

| Rule | Result when broken |
|---|---|
| Ids are unique within a collection | **Error** `duplicate_id`. The first entity with that id is kept; later ones are dropped |
| Merging two datasets keeps ids unique | Same: the entity already present wins, and the collision is reported |
| Ids are stable: an id keeps meaning the same thing across loads | Not checkable by the loader. Content authors must not reuse an id for a different thing |

Different collections may use the same id. `bpmnNodes` and `bpmnEdges` are their own id spaces, separate from `nodes` and `edges`.

## 4. References

A reference is a field holding the id of another entity, such as `step.journeyId` or `edge.sourceNodeId`.

| Input | Result |
|---|---|
| A reference names an id that exists in its target collection | Valid |
| A reference names an id that does not exist, and the target collection is present in the dataset | **Error** `dangling_reference`, naming the entity, the field and the missing id. The entity is **kept** |
| The target collection is omitted from the dataset | Not checked. A partial dataset may refer to entities supplied elsewhere |

A dangling reference does not drop the entity, because dropping could cascade through everything that points at it. Consumers must tolerate a reference that does not resolve:

- Graph queries skip an endpoint that is not a node.
- A stepper skips a missing item rather than holding an index that points at nothing.
- A view shows what it can and omits what it cannot resolve.

`validateContentBundle()` runs the identity and reference checks on a complete dataset, for example after a merge.

Not checked, because the target is not a single collection: `evidenceRef.relatedEntityIds`, `scene.focusTargets`, `orientationItem.links[].entityId`, ids inside `metadata`, and focus targets of type `scene_element`, `artifact_anchor` and `sequence_element`.

## 5. Ordered navigation

Some collections are stepped through in order: a journey's steps, a process's stages, a sequence's messages, a route's waypoints, and the orientation items.

| Rule | Detail |
|---|---|
| Order | Ascending `sequenceNumber`. Ties keep their input order |
| Position | An item's position is its index in that order, starting at 0. **The active item is identified by position, never by matching `sequenceNumber` to an index** |
| Numbering | `sequenceNumber` values do not have to start at 0 or be contiguous. 10, 20, 30 is valid |
| Display | The UI shows position + 1 ("Step 2 of 5"), not the raw `sequenceNumber` |
| Duplicate numbers in one group | **Warning** `duplicate_sequence_number`. Order falls back to input order for the tied items |
| Membership | A group contains the items that exist. A sequence's `messageIds` entry with no matching message is a dangling reference (section 4) and is not a position |

`orderBySequence()` in `@guiderail/core/content` is the one implementation of this order. The kernel and the UI both use it, so they cannot disagree about which item is active.

## Diagnostics

Every diagnostic has a `code`, a `severity`, the collection, and where known the entity's position and id.

| Code | Severity | Meaning |
|---|---|---|
| `not_an_array` | error | A collection was present but unusable |
| `invalid_entity` | error | An entity failed its schema and was dropped |
| `duplicate_id` | error | A later entity reused an id and was dropped |
| `dangling_reference` | error | A reference does not resolve; the entity was kept |
| `unknown_section` | warning | A top-level key was ignored |
| `duplicate_sequence_number` | warning | Two items in one ordered group share a number |

Loading never throws on bad content. The caller decides what to do with errors; a loader that feeds the kernel should surface them rather than render a partial view as if it were complete.

## Trust boundary

This contract is about correctness, not about hostile input. Until the Zod advisory tracked in #23 is remediated, content must come from a trusted source. See `docs/security/controls.md`.
