# Phase 0 Architecture Assessment

**Conclusion:** the repository is a coherent, server-rendered React UI prototype with file-based routes and a shared shell. It is not yet a production application architecture for a multi-organization youth-sports ecosystem. This conclusion is evidence about the checked-in implementation, not a judgment against unavailable requirements.

## Current architecture

| Layer                       | Observed implementation                                                                                                                                           | Status                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Presentation and navigation | React route components, shared `AppShell`, custom UI kit, generated TanStack route tree                                                                           | **VERIFIED**                                                                           |
| Client navigation role      | `RoleProvider`, hard-coded role/person catalog, URL route ownership and browser `localStorage`                                                                    | **PARTIAL:** UX role selection only; no authenticated principal or policy enforcement. |
| Client/server data boundary | TanStack Query provider exists; inspected routes consume constants from `mock-data.ts`; no query functions, server functions, route loaders, or API clients found | **NOT VERIFIED** as a server-backed business data boundary.                            |
| Domain/application services | No service/use-case layer found; route components own UI state and workflow-shaped handlers                                                                       | **NOT VERIFIED** in the checked-in source.                                             |
| Persistence                 | Mock data states it is not persisted; no schema or database client found                                                                                          | **NOT VERIFIED** in checkout; external persistence is outside repository evidence.     |
| Validation                  | Zod and React Hook Form are declared; inspected flows use component state/native fields without business schemas                                                  | **PARTIAL** at dependency level; no business validation implementation evidenced.      |
| Server runtime              | TanStack Start SSR entry, middleware and error wrapper                                                                                                            | **VERIFIED** infrastructure capability; no domain endpoint is evidenced.               |
| Tests                       | One route-matching test                                                                                                                                           | **PARTIAL** infrastructure; domain and security behavior are untested.                 |

Evidence: [src/router.tsx](../../src/router.tsx#L1-L17); [src/routes/__root.tsx](../../src/routes/__root.tsx#L78-L146); [src/lib/roles.tsx](../../src/lib/roles.tsx#L17-L37), [src/lib/roles.tsx](../../src/lib/roles.tsx#L209-L250); [src/lib/mock-data.ts](../../src/lib/mock-data.ts#L1-L4); [src/start.ts](../../src/start.ts#L1-L33); [src/test/app-routing.test.tsx](../../src/test/app-routing.test.tsx#L1-L17).

## Domain alignment

The following status describes domain behavior in code, not simply visual language.

| Domain concept              | Evidence in prototype                                                                             | Status      | Production gap                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Person to multiple roles    | Eight role entries describe different personas; role is changed in UI and stored in localStorage. | **PARTIAL** | No person/account model, authentication, role grant, scoped actor, or authorization check. Demo personas sometimes represent organizations rather than people. |
| Football ID                 | Player fixture has a string ID; ID card renders it and a deterministic faux QR grid.              | **PARTIAL** | No issuer, uniqueness constraint, lifecycle, verification proof, recovery/merge process, or real QR token/signature.                                           |
| Guardian relationship       | Player fixture stores guardian name and `verified: true`; parent screen lists two children.       | **PARTIAL** | No account-to-child relationship, verification evidence, custody/delegation, revocation, or multi-guardian model.                                              |
| Organization membership     | Organization names/IDs and SSB registration UI exist.                                             | **PARTIAL** | No organization/member records, invite/approval lifecycle, membership role, status, or cross-organization policy.                                              |
| Player organization history | Journey fixture contains SSB and selection/tournament/academy entries.                            | **PARTIAL** | No event provenance, membership start/end, transfer approval, immutable history, or disputes/corrections.                                                      |
| Team membership             | Teams and roster are fixture arrays; team selector drives a local filter.                         | **PARTIAL** | No effective-dated membership, age/category eligibility, or season boundary.                                                                                   |
| Competition                 | Tournament summary, registrations, fixtures and standings are static objects.                     | **PARTIAL** | No competition lifecycle, rules/versioning, registration workflow, divisions, schedule authority, or calculated standings.                                     |
| Match                       | Fixture summaries and referee assignment sample exist.                                            | **PARTIAL** | No canonical match entity, participant constraints, assignment/rescheduling, venue/timezone, or status state machine.                                          |
| Match events                | Local event types and local scoreboard are rendered for a report.                                 | **PARTIAL** | No durable, attributed, ordered event log, official submission, correction/audit procedure, or score reconciliation.                                           |
| Player development          | Static rating categories, timeline, template, coach note and local sliders.                       | **PARTIAL** | No assessment period/version/author, calibrated rubric, persistence, visibility/consent, history, review or dispute lifecycle.                                 |
| Consent                     | Three local toggles and hard-coded audit list; scout pool contains local boolean consent.         | **PARTIAL** | No purpose/version/subject/actor/source/time/legal basis, guardian verification, withdrawal propagation, evidence or server policy enforcement.                |
| Audit trail                 | UI renders seeded activity descriptions and toasts claim changes were recorded.                   | **PARTIAL** | No append-only server audit event, actor/tenant/subject, correlation, retention, tamper controls or review process.                                            |

Relevant evidence: [src/lib/mock-data.ts](../../src/lib/mock-data.ts#L1-L33), [src/lib/mock-data.ts](../../src/lib/mock-data.ts#L67-L116), [src/lib/mock-data.ts](../../src/lib/mock-data.ts#L147-L174), [src/lib/mock-data.ts](../../src/lib/mock-data.ts#L278-L287), [src/lib/mock-data.ts](../../src/lib/mock-data.ts#L314-L328); [src/components/football-id-card.tsx](../../src/components/football-id-card.tsx#L5-L25); [src/routes/parent.tsx](../../src/routes/parent.tsx#L30-L33), [src/routes/parent.tsx](../../src/routes/parent.tsx#L176-L201).

## Requirement-to-domain trace

The status values below use the accepted [BRB-001 baseline](../product/BLUEPRINT-REQUIREMENT-BASELINE.md#L1-L56). `PARTIAL` means the concept appears in UI/sample data but is not a complete domain implementation. Detailed acceptance criteria not present in BRB-001 remain `UNDEFINED`.

| BR ID        | Required domain alignment                                                       | Current evidence                                          | Status           |
| ------------ | ------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------------- |
| BR-01, BR-02 | Player-owned journey and persistent Football ID                                 | Static journey and ID card                                | **PARTIAL**      |
| BR-03        | Historical player-organization relationships                                    | Journey labels imply history; no relationship lifecycle   | **PARTIAL**      |
| BR-04        | One person with multiple roles                                                  | Browser role/person catalog                               | **PARTIAL**      |
| BR-05        | Organization types and membership                                               | Organization labels in fixture data                       | **PARTIAL**      |
| BR-06        | Player-guardian relationship                                                    | Mock parent/child selection and guardian display          | **PARTIAL**      |
| BR-07        | Consent, privacy, access control, audit, revocation and minimization            | Local toggles, browser scout filter, seeded audit display | **PARTIAL**      |
| BR-08, BR-09 | Competition lifecycle and SSB operations                                        | Broad route coverage with static data/local state         | **PARTIAL**      |
| BR-10        | Technical, tactical, physical, psychological/behavioural and social development | Sample assessment template/ratings; no persistence        | **PARTIAL**      |
| BR-11        | API-first integration direction                                                 | No API/use-case boundary found in checked-in source       | **NOT VERIFIED** |
| BR-12        | MVP priority: Football Identity + Competition + SSB; Player/Parent central      | Corresponding screens exist, but no production workflow   | **PARTIAL**      |

## Architectural findings

| ID / severity        | Finding                                                                                                                                                     | Evidence                                                                                                                                                 | Risk / recommendation                                                                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AR-01 / **High**     | BRB-001 is present, but original Blueprint text, detailed workflow acceptance criteria and an approved technical architecture are not in the live checkout. | [BRB-001](../product/BLUEPRINT-REQUIREMENT-BASELINE.md#L1-L28) records Blueprint v0.1 as the sole requirement baseline and identifies undefined details. | Use BR-01 through BR-12 for traceability. Obtain owner decisions for undefined requirements and approve architecture; do not describe proposed PostgreSQL/REST choices from preliminary notes as requirements. |
| AR-02 / **High**     | UI routes directly consume a broad mock-data module and hold write-shaped state in components.                                                              | `mock-data.ts` declares all sample areas; route examples show local `setPaid`, `setConsent`, attendance/event state.                                     | UI and domain behavior are coupled; no durable transaction boundary. Introduce server-side use cases behind explicit contracts, not direct database calls from components.                                     |
| AR-03 / **Critical** | Application identity and role model is a client-side persona selector, not a security principal.                                                            | `roles.tsx` role catalog and `localStorage` persistence.                                                                                                 | Any future protected data exposed by these screens would lack an evidenced trusted authorization decision. Keep authorization server-side and deny by default.                                                 |
| AR-04 / **High**     | No persistence/API boundary was evidenced in the inspected application source.                                                                              | Route imports and repository-wide searches found mock imports and no data API/server function calls.                                                     | Consistency, concurrent writes, idempotency, and server validation are not established. Select backend and data ownership with owners, then establish a domain application boundary.                           |
| AR-05 / **High**     | Domain invariants are not represented as a coherent model.                                                                                                  | Domain data is flat, static objects/string IDs/booleans in `mock-data.ts`.                                                                               | Identity uniqueness, consent propagation, membership history, match/competition lifecycle, and audit invariants cannot be guaranteed. Model and test invariants before implementation.                         |
| AR-06 / **Medium**   | `QueryClientProvider` is present without observable remote query use.                                                                                       | Root route wraps the app; routes read fixture constants.                                                                                                 | Can create a misleading impression that data fetching/caching is already architected. Document the intended cache and server invalidation strategy before adding mutation workflows.                           |
| AR-07 / **Medium**   | Route test coverage does not exercise domain or multi-role workflows.                                                                                       | The only discovered test checks matching `/`.                                                                                                            | Regressions in role resolution, children/consent, payments, match reporting, and access policies are undetected by current tests.                                                                              |

## Dependencies and system boundaries

The visible app requires a trusted server boundary for authentication, organization membership, age-sensitive access, consent enforcement, money movement, and official competition records. No backend selection can be inferred from the current source. `src/start.ts` comments explicitly describe auth middleware conditionally for a future Supabase connection; do not treat that comment or a dependency name as a connected service.

External dependencies to decide/verify:

- Identity/authentication and account recovery, including guardian verification.
- Authoritative transactional datastore and migration ownership (Lovable rules reserve schema changes to Lovable-managed workflow).
- Payment provider, webhook/callback verification and reconciliation operations.
- Object storage and delivery controls if photos, identity documents, or certificates are in scope.
- Email/SMS/WhatsApp/push delivery provider and consent/preferences for each channel.
- Operational logging, alerting, backup/restore and incident response.
- Deployment environment, secret handling, data residency/retention and privacy/legal review.

These external dependencies are **NOT VERIFIED** in this repository. `AGENTS.md` says database/schema changes are managed through Lovable and must not be added manually to migration directories. The supplied preliminary architecture proposed PostgreSQL, modular monolith and versioned REST; BRB-001 only states API-first direction, so the former remain `ARCHITECTURE DECISION REQUIRED`, not settled baseline constraints.

## Recommended architecture direction (not approved)

See [PHASE-0-RECOMMENDED-TARGET-ARCHITECTURE.md](PHASE-0-RECOMMENDED-TARGET-ARCHITECTURE.md). At minimum, keep the current route layer as presentation; use authenticated server actions/use cases for business operations; enforce a centralized policy using principal, organization, resource, action, relationship, consent and purpose; persist consent/audit/membership facts as domain records; and validate on the server. Select actual technologies only after owner decision.

## Owner decisions required

See the [Owner Decision Register](PHASE-0-IMPLEMENTATION-READINESS.md#owner-decision-register) for the complete list of open choices, options, impacts, recommendations, and approval status. No owner decision is made by this assessment.
