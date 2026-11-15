# Phase 0 Owner Decision Record

## 1. Document metadata

- **Document:** Phase 0 Owner Decision Record
- **Scope:** Documentation-only record of approved Phase 0 owner decisions for GARUDA MUDA.
- **Status:** Authoritative record for OD-01 through OD-10.
- **Authority:** This record is subordinate to the approved requirements baseline in [BLUEPRINT-REQUIREMENT-BASELINE.md](../product/BLUEPRINT-REQUIREMENT-BASELINE.md).
- **Baseline:** BRB-001, Blueprint v0.1, accepted as the sole initial requirements baseline.
- **Decision date:** 2026-11-11
- **Documentation-only statement:** This record records approved direction only. It does not establish implementation, deployment, or verification evidence.

## 2. Purpose and scope

This document records the approved owner decisions for the Phase 0 architecture and governance baseline. It exists to:

- provide a single source of truth for OD-01 through OD-10;
- differentiate approved direction from implemented or verified capability;
- anchor Phase 1 planning to explicit, approved decisions;
- preserve evidence and traceability to the current requirement baseline and audit package.

This record does not authorize production implementation, deployment, or database/schema changes. It does not replace evidence from tests, security reviews, or configuration audits.

## 3. Document authority and precedence

This document is authoritative for the approved Phase 0 owner decisions. It is subordinate to, and traceable from, the approved initial requirements baseline in [BLUEPRINT-REQUIREMENT-BASELINE.md](../product/BLUEPRINT-REQUIREMENT-BASELINE.md).

The following precedence applies:

1. [BLUEPRINT-REQUIREMENT-BASELINE.md](../product/BLUEPRINT-REQUIREMENT-BASELINE.md) — accepted initial requirement baseline.
2. This owner decision record — authoritative for OD-01 through OD-10.
3. Existing Phase 0 audit documents — evidence and findings, not requirement authority.
4. Project implementation evidence — must be evaluated against these decisions and the approved baseline.

The decisions in this record are not a separate PRD. Missing workflow details remain `UNDEFINED` unless they are explicitly specified in the requirements baseline or explicitly approved here.

## 4. Owner decision summary

| Decision ID | Decision                                                                                                       | Status       |
| ----------- | -------------------------------------------------------------------------------------------------------------- | ------------ |
| OD-01       | npm is the sole official package manager.                                                                      | **APPROVED** |
| OD-02       | LF is the repository-wide standard line ending.                                                                | **APPROVED** |
| OD-03       | Managed Backend using Supabase.                                                                                | **APPROVED** |
| OD-04       | Supabase is the database service; schema and migrations are managed through the official repository workflow.  | **APPROVED** |
| OD-05       | Supabase Auth is the sole official authentication service.                                                     | **APPROVED** |
| OD-06       | Many-to-many guardian-player relationship.                                                                     | **APPROVED** |
| OD-07       | Purpose-specific, recorded, reviewable, revocable consent.                                                     | **APPROVED** |
| OD-08       | Shared multi-tenant PostgreSQL with Row Level Security (RLS) as the primary data-isolation control.            | **APPROVED** |
| OD-09       | RBAC + Resource-Based + Relationship-Based + Attribute-Based + Purpose-Based Authorization, with default-deny. | **APPROVED** |
| OD-10       | Centralized, append-oriented audit logging with restricted access and documented retention policies.           | **APPROVED** |

## 5. Detailed OD-01 through OD-10 records

### OD-01 — Package Manager

- **Status:** `APPROVED`
- **Owner decision:** npm is the sole official package manager.
- **Implications:**
  - npm is the official dependency installation and execution workflow.
  - `package-lock.json` is the canonical lockfile.
  - README and CI documentation must consistently describe npm.
  - Existing `bun.lock` and `bunfig.toml` require separate inspection and an explicitly authorized cleanup decision.
  - Their existence must not be treated as permission to delete them.
- **Implementation note:** This decision is approved direction only; it is not evidence that the repository has a single, clean npm-based setup or that package configuration is fully compliant.

### OD-02 — Line Endings and Formatting

- **Status:** `APPROVED`
- **Owner decision:** LF is the repository-wide standard line ending.
- **Implications:**
  - LF (`\n`) is the required line ending for repository text files.
  - Future formatting and Git configuration should consistently enforce LF.
  - Existing CRLF files must be identified during a separately authorized implementation task.
  - This decision does not authorize modifying `.editorconfig`, Prettier, Git attributes, or existing files.
- **Implementation note:** This decision resolves the line-ending standard but does not claim the repo currently conforms to it.

### OD-03 — Backend Architecture and Provider

- **Status:** `APPROVED`
- **Owner decision:** Managed Backend using Supabase.
- **Approved services:**
  - Supabase PostgreSQL.
  - Supabase Auth.
  - Supabase Storage.
- **Implications:**
  - Supabase is the approved backend provider.
  - Backend capabilities must be designed around the approved Supabase services.
  - Security, operational, deployment, backup, and recovery details still require implementation planning and verification.
  - Provider approval does not establish that any Supabase project is configured or operational.
- **Implementation note:** This is an architecture direction. No project configuration, credential, or deployment state is inferred here.

### OD-04 — Database and Migration Ownership

- **Status:** `APPROVED`
- **Owner decision:** Supabase is the database service, while database schema and migrations are managed through the official repository workflow.
- **Implications:**
  - Repository-controlled migrations are the source of truth for database changes.
  - Schema changes must be versioned, reviewable, and traceable.
  - Supabase is the database deployment target.
  - Migration application must follow a controlled and reviewed workflow.
  - Existing `AGENTS.md` instructions stating that Lovable manages schema and migrations must be reconciled before implementation.
- **Outstanding documentation/workflow item:** Do not edit `AGENTS.md` or migrations in this task. Record the existing instruction conflict as an outstanding reconciliation item.
- **Implementation note:** Approved direction exists; migration workflow execution remains unverified.

### OD-05 — Authentication Strategy

- **Status:** `APPROVED`
- **Owner decision:** Supabase Auth is the sole official authentication service.
- **Implications:**
  - Supabase Auth is the authoritative identity authentication provider.
  - No alternative authentication provider may be introduced without owner approval.
  - Authentication must be distinguished from authorization.
  - Server-side authorization remains mandatory.
  - Guardian-player relationship verification must not be inferred from successful login.
  - Session lifecycle, account recovery, and account security require detailed design.
- **Implementation note:** This approves the provider but does not confirm the repository has an implemented or configured Supabase Auth deployment.

### OD-06 — Guardian-Player Relationship

- **Status:** `APPROVED`
- **Owner decision:** Many-to-many relationship.
- **Rules:**
  - One player may have multiple verified guardians.
  - One guardian may manage multiple players.
  - Every guardian-player relationship must be independently verifiable.
- **Required design capabilities:**
  - Relationship type.
  - Individual guardian permissions.
  - Invitation.
  - Acceptance.
  - Rejection.
  - Revocation.
  - Dispute handling.
  - Relationship status.
  - Audit trail.
- **Outstanding detail:** The exact verification authority, accepted evidence, dispute resolution process, and detailed permissions remain unresolved unless supported by existing approved documentation.
- **Implementation note:** This is approved relationship semantics, not proof that the data model or access controls exist.

### OD-07 — Consent Lifecycle and Revocation

- **Status:** `APPROVED`
- **Owner decision:** Consent must be purpose-specific, recorded, reviewable, and revocable.
- **Required design implications:**
  - Record the consent giver and authority.
  - Record consent timestamp.
  - Record notice or policy version.
  - Maintain consent history.
  - Support review and renewal.
  - Support revocation with an audit trail.
  - Stop processing that depends on revoked consent unless another lawful basis applies.
  - Support future age/status transition review.
- **Outstanding details:**
  - Consent categories and purposes.
  - Validity periods.
  - Age transition thresholds.
  - Renewal conditions.
  - Dispute handling.
  - Lawful retention exceptions.
- **Implementation note:** These requirements are approved but remain `UNDEFINED` where the baseline and this record do not supply exact details.

### OD-08 — Organization Tenancy and Data Isolation

- **Status:** `APPROVED`
- **Owner decision:** Shared multi-tenant PostgreSQL with Row Level Security (RLS) as the primary data-isolation control.
- **Implications:**
  - Multiple organizations share a PostgreSQL database.
  - Organization-owned resources must have clear tenant ownership.
  - RLS is the primary database-level isolation mechanism.
  - Policies must cover relevant SELECT, INSERT, UPDATE, and DELETE operations.
  - Cross-organization access requires explicit authorization.
  - Administrative and privileged access paths must be controlled.
- **Implementation note:** RLS is approved as the primary isolation mechanism but must not be described as implemented or secure until actual policies and negative tests are verified.

### OD-09 — Authorization Strategy

- **Status:** `APPROVED`
- **Owner decision:** RBAC + Resource-Based + Relationship-Based + Attribute-Based + Purpose-Based Authorization, with default-deny.
- **Authorization dimensions:**
  1. RBAC — user role.
  2. Resource-based — resource ownership and access rights.
  3. Relationship-based — valid guardian-player and organization relationships.
  4. Attribute-based — relevant attributes and conditions.
  5. Purpose-based — permitted data usage purpose.
- **Rules:**
  - Access must be enforced server-side.
  - PostgreSQL RLS must support database-level enforcement.
  - Access must be denied when required conditions cannot be verified.
  - Frontend role selection is never an authorization boundary.
- **Required negative tests:**
  - Unauthenticated access.
  - Unauthorized roles.
  - Cross-tenant access.
  - Revoked guardian relationships.
  - Revoked consent.
  - Resource ID manipulation.
  - Direct API access bypassing frontend controls.
- **Implementation note:** This states approved authorization direction only; it does not imply the authorization model is implemented or tested.

### OD-10 — Audit Logging and Data Retention

- **Status:** `APPROVED`
- **Owner decision:** Centralized, append-oriented audit logging with restricted access and documented retention policies.
- **Required capabilities:**
  - Actor identity.
  - Event timestamp.
  - Action type.
  - Affected resource.
  - Related organization/tenant.
  - Action outcome, including successful and denied actions.
  - Relevant change context.
- **Additional requirements:**
  - Ordinary users must not modify or delete audit logs.
  - Guardian-player relationship changes must be recorded.
  - Consent changes and revocations must be recorded.
  - Administrative and sensitive data access must be traceable.
  - Retention, deletion, and legal hold must be documented.
  - Passwords, tokens, and unnecessary sensitive information must not be logged.
- **Implementation note:** This approves the event model and retention direction, but does not claim tamper-proof or immutable logging without implementation evidence.

## 6. Architecture baseline resulting from approved decisions

The approved logical architecture is as follows:

GARUDA MUDA Application
→ Supabase Auth
→ Server-side Authorization
→ Supabase PostgreSQL with shared multi-tenant RLS
→ Supabase Storage
→ Centralized Audit Logging

Repository workflow:

- npm.
- `package-lock.json` as canonical lockfile.
- LF as repository-wide line ending standard.
- Repository-managed database schema and migrations.

This is an approved architectural direction, not a verified deployed architecture. It does not imply that a Supabase project is configured, connected, or operating in the current checkout. It also does not authorize implementation changes in this task.

## 7. Decision dependencies

The following dependencies are approved and must be treated as connected design constraints:

- **OD-03** establishes the backend provider.
- **OD-04** establishes database and migration ownership.
- **OD-05** establishes authentication.
- **OD-06** establishes guardian-player relationship requirements.
- **OD-07** establishes consent requirements.
- **OD-08** establishes tenant isolation.
- **OD-09** establishes authorization enforcement.
- **OD-10** establishes audit and retention requirements.

These relationships are foundational for secure handling of youth-player data. In particular:

- **OD-06** and **OD-07** are foundational to guardian handling and consent.
- **OD-08** and **OD-09** must be designed and tested together.
- **OD-10** must capture security-relevant events from the other controls.

These dependencies do not claim the underlying technical work is complete or implemented.

## 8. Outstanding implementation details

The following remain unresolved unless supported by separate approved implementation documentation or evidence:

- Exact authentication flows and account-recovery policy.
- Exact guardian verification authority and accepted evidence.
- Consent categories, time windows, and renewal policy.
- Detailed role and permission matrix by organization and function.
- Exact database schema, indexes, triggers, constraints, and migration sequencing.
- RLS policy content and negative test evidence.
- Security logging retention and legal-hold process.
- Storage and upload policy details for identity or media records.
- Recovery, backup, and operational resilience policy.

These items remain `UNDEFINED` unless expressly approved or evidenced elsewhere.

## 9. Existing documentation conflicts

The following known documentation conflict exists and must be reconciled in future implementation planning:

- [AGENTS.md](../../AGENTS.md) states that Lovable manages database schema and migrations.
- The approved OD-04 direction requires repository-managed database schema and migration ownership through the official repository workflow.

This record documents the conflict as an outstanding documentation/workflow reconciliation item. It does not modify `AGENTS.md` in this task.

## 10. Phase 0 Exit Criteria impact

The new approved decisions resolve the owner-decision portion of the Phase 0 exit criteria, but they do not resolve implementation, verification, or environment evidence.

The exit criteria in [PHASE-0-IMPLEMENTATION-READINESS.md](PHASE-0-IMPLEMENTATION-READINESS.md) remain as follows:

- **Architecture decisions:** owner decision portion can be marked as resolved by approval, but implementation and workflow evidence remain outstanding.
- **Security baseline:** principles are approved, but implementation and negative-test evidence remain outstanding.
- **Repository readiness:** npm and LF decisions are approved, but repository configuration and lint status remain unchanged.
- **Runtime verification:** do not change previous test results.
- **Browser/E2E:** do not claim verification without actual evidence.
- **Documentation consistency:** preserve historical findings and update references only where necessary.
- **Owner approvals:** OD-01 through OD-10 are approved, but this record does not invent named reviewers or legal/security approval evidence.

The overall Phase 0 status remains a function of actual evidence, not the number of approved decisions.

## 11. Evidence and traceability

Primary traceability sources:

- [BLUEPRINT-REQUIREMENT-BASELINE.md](../product/BLUEPRINT-REQUIREMENT-BASELINE.md)
- [PHASE-0-IMPLEMENTATION-READINESS.md](PHASE-0-IMPLEMENTATION-READINESS.md)
- [PHASE-0-ARCHITECTURE-ASSESSMENT.md](PHASE-0-ARCHITECTURE-ASSESSMENT.md)
- [PHASE-0-SECURITY-GAP-ANALYSIS.md](PHASE-0-SECURITY-GAP-ANALYSIS.md)
- [PHASE-0-REPOSITORY-INVENTORY.md](PHASE-0-REPOSITORY-INVENTORY.md)
- [PHASE-0-ROUTE-FUNCTIONAL-AUDIT.md](PHASE-0-ROUTE-FUNCTIONAL-AUDIT.md)

This record is an authoritative owner-direction document, not a proof that the repository complies with those directions.

## 12. Change log

| Date       | Change                                                                           | Authority                                              |
| ---------- | -------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 2026-11-11 | Created the official Phase 0 Owner Decision Record covering OD-01 through OD-10. | Owner-approved direction documented in this repository |
