# Phase 0 Recommended Target Architecture

**Decision status: BLOCKED.** This is an unapproved proposal. BRB-001 accepts Blueprint v0.1 as the sole initial product baseline; no separate PRD is assumed. The original Blueprint source text and an approved technical architecture were not found in the live checkout. This document does not select a vendor, database, schema, deployment platform or final domain policy. Obtain owner approval before implementation. See [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md).

## Design goals

1. A person can hold multiple individually granted roles; role selection is never authorization.
2. Football ID identifies a player record without transferring ownership to an organization.
3. Guardian authority and consent are verifiable, purpose-scoped, reviewable and revocable under owner-approved rules.
4. Organization and team membership are explicit, effective-dated relationships; access is scoped to active membership and assigned responsibilities.
5. Competition, match, lineup, event and result transitions are attributable and validated.
6. Child data is minimized in every response, protected by server-side authorization, and auditable.
7. Prototype routes remain the presentation experience while their data access moves behind contracts.

These goals operationalize requirement themes BR-01 through BR-12 as design questions; they do not add acceptance criteria. BRB-001 leaves workflow details undefined, and only BR-11 explicitly calls for API-first direction. Provider, persistence, API protocol and deployment choices are `ARCHITECTURE DECISION REQUIRED`.

## Proposed logical layers

| Layer          | Responsibility                                                                                                                                          | Boundary                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Experience     | TanStack routes, shared shell, accessible UI state and view composition                                                                                 | No trust decisions; no authoritative mutation. Keep `src/routes/` and shared UI focused on interaction/rendering.        |
| Application    | Use cases such as create consent, request membership, record attendance, submit assessment, create payment request, assign referee, submit match report | Authenticate actor; validate input; authorize resource/tenant/purpose; coordinate transaction; return typed result.      |
| Domain         | Identity, guardian authority, organization membership, team, competition, match, consent, assessment, payment and audit invariants                      | Independent of React; explicit state transitions and domain events; no direct UI dependencies.                           |
| Infrastructure | Database, authentication provider, payment provider, file storage, notifications, telemetry                                                             | Implement only approved interfaces; isolate secrets and provider-specific callbacks; use environment-scoped credentials. |
| Policy         | Centralized RBAC plus resource/relationship/attribute/consent checks                                                                                    | Run server-side for every protected read/write. Deny by default; validate tenant and purpose from trusted state.         |
| Operations     | Audit, monitoring, backups, deployment, incident/privacy request response                                                                               | Define owners, retention, alerts, restore tests and incident procedures before production.                               |

**Integration recommendation:** use TanStack Start server functions/loaders or a separately approved API as the only business-data boundary. The owner must choose; do not create both patterns without a contract. Keep TanStack Query only where client caching/freshness improves the workflow, with identity/tenant-aware cache lifecycle and invalidation. Do not assume the framework's CSRF middleware provides access control.

## Proposed domain concepts and relationships

These are conceptual nouns, not database tables or an approved schema.

- **Person** represents an individual. **Account/Identity** represents how the individual authenticates. A person may have multiple **Role Grants**, each with scope and lifecycle; organization-level grants must not imply global access.
- **Player Profile** is linked to a person and receives a stable **Football ID** from an explicitly authorized issuer. Define uniqueness, proof, merge/correction, suspension and retirement policies.
- **Guardian Relationship** links a guardian person/account and player with relationship type, verification status/evidence reference, valid dates, permissions, and revocation/dispute states. Multiple guardians and delegated authority require explicit rules.
- **Organization** may be a club/SSB, tournament organizer, academy, association or governing body. **Organization Membership** has role, status, scope and effective dates. Hierarchy/delegation is an owner decision.
- **Player Organization History** records membership and participation events without giving the organization ownership of the player profile. Preserve provenance and correction history.
- **Team Membership** links player and team for a season/date range; enforce eligibility and transfer rules defined by product owners.
- **Competition** owns categories/divisions, rules/version, registration period, status and participant teams. **Match** belongs to a competition/category and has scheduled venue/time, participants, officials, lifecycle and result status.
- **Match Event** is an attributed event associated with a match and participant, with validation, ordered time, submission status, correction reason and audit link. Standings should be derived from approved results or updated transactionally under the chosen source-of-truth model.
- **Development Assessment** includes subject, authorized assessor, rubric/version, period, ratings, comments, visibility, consent/policy basis, submitted/corrected lifecycle and immutable history.
- **Consent Decision** records notice/purpose/version, subject, authorized decision-maker, collection channel, date, scope, state and withdrawal/supersession. It should be queryable by policy but not be a bare boolean.
- **Audit Event** captures authenticated actor, organization scope, action, resource, purpose, outcome, event time and correlation metadata. Sensitive values should be minimized/redacted; events need controlled access and retention.
- **Invoice/Payment Attempt/Payment Evidence** must distinguish an issued amount, provider attempt, provider-confirmed result, settlement/reconciliation and refund/reversal. A client button never sets paid status.
- **Document/Media Asset** if needed, stores metadata and access policy; object storage remains private, and server issues limited access only after authorization.

## Authorization and child-safety model

Proposed decision inputs for each operation:

`principal + active role grant + organization/team/competition scope + resource relationship + action + purpose + consent/guardian authority + data classification`

- Principal, membership and verification status come from server-validated identity and records, never browser role state.
- Apply the same policy to list, detail, search, aggregate, export, download, contact request and mutation paths.
- Evaluate consent at the data boundary; do not send denied records to a browser and hide them there.
- Return the minimum role-specific projection. Avoid exposing full legal names, contact details, exact birth dates, stable IDs or raw assessment notes unless the approved purpose requires them.
- Treat aggregate association data as potentially re-identifiable at small group sizes; define suppression thresholds and scope.
- Verify all organization/team/competition IDs against the principal's permitted scopes to prevent cross-tenant access.
- Record sensitive reads and writes with purpose/outcome and avoid recording secrets or excess personal data in application logs.

## Workflow/state contract guidance

Define state machines and transaction boundaries before server work:

- Consent: presented to granted/declined to superseded/withdrawn/expired, with version and proof.
- Organization membership: invited/requested to guardian/player approval if required to active to suspended/ended; transfer does not erase player history.
- Opportunity application: draft to guardian approval pending to submitted to reviewed to accepted/declined/withdrawn.
- Payment: invoice issued to payment pending to provider-confirmed/failed/expired to reconciled/refunded as applicable.
- Referee assignment: proposed to accepted/declined to reassigned/cancelled; detect conflicts and preserve assignment history.
- Match reporting: draft/live to submitted to approved/published to correction requested/amended, with immutable event history and computed score.
- Assessment: draft to submitted to visible under policy to corrected/superseded; retain rubric and author provenance.

Use server-side schema validation, authorization before mutation, transactionality for coupled writes, idempotency keys for retried external operations, and explicit error/retry/conflict states. Exact transitions require product and operations approval.

## Recommended repository organization (illustrative)

Do not create this structure until owners approve the boundary:

```text
src/
  routes/                 # experience and route-level composition
  features/<workflow>/    # UI, typed contracts, feature-specific presentation
  server/<domain>/        # authenticated use cases and policy checks
  domain/<concept>/       # invariants, value objects, state transitions
  infrastructure/         # approved provider adapters
  lib/                    # cross-cutting utilities only
```

The current UI kit and shared shell can remain; mock fixtures should stay visibly synthetic until replaced by approved service contracts. Do not place a data-access SDK in browser code where it can bypass the intended server policy.

## Non-functional requirements to ratify

- Availability, performance and scale targets for nationwide read/search and event-day match reporting.
- Data retention, backups, restore objectives, privacy request handling, and Indonesian data/privacy review.
- Offline match reporting expectations, conflict resolution and queued write integrity for low-connectivity venues.
- Accessibility targets, mobile/network constraints, supported browsers/devices and Indonesian-language requirements.
- Observability, incident severity/on-call, provider outage handling, audit retention and log redaction.
- Payment reconciliation ownership, accounting evidence, refund/dispute handling and notification delivery guarantees.

## Decisions required before architecture approval

1. Confirm the controlled Blueprint text behind BRB-001 and define release boundaries/workflow acceptance criteria; no separate PRD is assumed by the current owner decision.
2. Authentication/identity provider, Football ID issuer and guardian proof model.
3. Backend, database, migration ownership, deployment and data-region constraints.
4. Organization hierarchy and role-grant model; authorization vocabulary and policy owner.
5. Consent purposes, age rules, retention, withdrawal propagation and guardian/player rights.
6. Payment provider and source of truth; tournament/match result source of truth.
7. Storage/media scope, notification channels and privacy controls.
8. Audit requirements and operational ownership.

Until these decisions are approved, this architecture remains **BLOCKED for implementation**. See [PHASE-0-IMPLEMENTATION-READINESS.md](PHASE-0-IMPLEMENTATION-READINESS.md).
