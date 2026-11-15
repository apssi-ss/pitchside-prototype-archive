# Blueprint Requirement Baseline

- **Baseline ID:** `BRB-001`
- **Product:** Youth Football Ecosystem Platform (working brand in prototype: BolaID)
- **Version:** Blueprint v0.1 — Indonesia
- **Status:** ACCEPTED AS THE SOLE INITIAL REQUIREMENT BASELINE
- **Owner decision:** 2026-11-11, user confirmed that this Blueprint is the only requirement baseline currently available.

## 1. Authority

For Phase 0 and subsequent implementation, the supplied Blueprint v0.1 is the sole initial source of product requirements. No separate PRD is assumed to exist.

The Blueprint is authoritative for:

- Product vision and positioning.
- Stakeholder ecosystem.
- Football ID and identity principles.
- Person-to-multiple-roles model.
- Organization and membership concepts.
- Player journey and organization history.
- MVP direction: Football Identity + Competition + SSB, with Player and Parent central to the ecosystem.
- Consent, privacy, access-control, and governance principles.
- Long-term product layers and roadmap direction.

## 2. Interpretation rules

1. Existing source code is implementation evidence, not a requirement authority.
2. UI labels, demo data, route names, and placeholder interactions do not create new product requirements.
3. Requirements not stated or sufficiently implied by the Blueprint must be recorded as `UNDEFINED`.
4. Technical choices not made in the Blueprint must be recorded as `ARCHITECTURE DECISION REQUIRED`.
5. Copilot must not invent business rules, legal interpretations, pricing rules, verification policies, or acceptance criteria.
6. Where a requirement is ambiguous, record the ambiguity and request an owner decision.
7. Any change to this baseline requires an explicit product-owner decision and a dated change-log entry.

## 3. Requirement themes extracted from the Blueprint

| ID    | Requirement theme        | Baseline statement                                                                                                                                     |
| ----- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| BR-01 | Player journey ownership | Player journey and persistent football identity must not be owned by an SSB or tournament organizer.                                                   |
| BR-02 | Persistent Football ID   | A player identity must persist across organizations and activities.                                                                                    |
| BR-03 | Historical relationships | Player-organization membership must preserve historical periods rather than overwrite prior affiliation.                                               |
| BR-04 | Person and roles         | One person may hold multiple roles; avoid separate person accounts for each role.                                                                      |
| BR-05 | Organization model       | Support organization types including SSB, club, academy, tournament organizer, association, and federation.                                            |
| BR-06 | Guardian relationship    | A youth player must be connectable to a parent/guardian.                                                                                               |
| BR-07 | Consent and privacy      | Consent, access control, audit trail, revocation, and data minimization are foundational.                                                              |
| BR-08 | Competition              | Competition lifecycle includes registration, roster, groups/draw, schedule, venue, referee, matches, results, standings, statistics, and certificates. |
| BR-09 | Football operations      | SSB operations include player registration, teams, training, attendance, staff, and finance.                                                           |
| BR-10 | Player development       | Development includes technical, tactical, physical, psychological/behavioural, and social dimensions.                                                  |
| BR-11 | API-first direction      | The platform should be designed to integrate with external football organizations and systems.                                                         |
| BR-12 | MVP focus                | Initial focus is Football Identity + Competition + SSB; Player and Parent are central users.                                                           |

## 4. Explicitly undefined at this baseline

The Blueprint does not fully specify:

- Detailed user stories and acceptance criteria for every workflow.
- Account creation, authentication provider, OTP policy, account recovery, and identity proofing.
- Exact Football ID issuance, uniqueness, collision handling, correction, merge, and duplicate-resolution rules.
- Guardian verification and contested guardianship procedures.
- Consent purposes, granularity, duration, age/guardian transition, withdrawal effects, and evidence format.
- Detailed role/permission matrix and regional authority boundaries.
- Competition formats, tie-break rules, eligibility, age cut-offs, roster locks, transfers, disciplinary rules, and match finalization rules.
- Payment provider, reconciliation, refunds, fees, taxes, and financial ledger requirements.
- Data retention, deletion, export, backup, and disaster-recovery policies.
- Availability, performance, accessibility, localization, and service-level objectives.
- Deployment topology, hosting provider, Redis necessity, storage provider, and observability stack.
- Legal/compliance interpretation and policy wording. These require qualified owner/legal review; they must not be inferred by Copilot.

## 5. Change log

| Date       | Change                                                             | Authority              |
| ---------- | ------------------------------------------------------------------ | ---------------------- |
| 2026-11-11 | Blueprint v0.1 confirmed as the sole initial requirement baseline. | Explicit user decision |
