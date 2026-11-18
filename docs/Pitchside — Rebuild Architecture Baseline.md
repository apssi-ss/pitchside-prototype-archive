# Pitchside — Rebuild Architecture Baseline

**Status:** Proposed baseline  
**Development environment:** VS Code + GitHub Copilot  
**Source of truth:** GitHub repository  
**Backend platform:** New Supabase project  
**Legacy data:** Discarded; no migration  
**Frontend strategy:** Retain and selectively refactor existing UI/UX

## 1. Product direction

Pitchside is an Indonesian youth football ecosystem platform.

Its central purpose is to help young players build a trusted football identity and a traceable record of their football journey, opening access to development, competition, and future opportunities.

The primary product success metric is the number of players registering for opportunities using their Football ID each month.

## 2. Rebuild strategy

This is a greenfield backend rebuild with a retained frontend.

Retain:
- Existing visual design and UX patterns.
- Existing page layouts and navigation where appropriate.
- Reusable React components.
- Existing frontend technology where it remains fit for purpose.

Rebuild:
- Database schema.
- Authentication and authorization.
- Row Level Security policies.
- Business logic and server operations.
- Database migrations.
- Data access patterns.
- Audit and verification mechanisms.
- Integrations that depend on the legacy backend.

Legacy data will not be migrated. Legacy implementation may be inspected as reference material but must not be treated as the authoritative business or security design.

## 3. Technology baseline

- React and TypeScript.
- TanStack Start and TanStack Router.
- Tailwind CSS.
- TanStack Query.
- Supabase Auth.
- Supabase PostgreSQL.
- PostgreSQL Row Level Security.
- Supabase Storage.
- Supabase CLI for database migrations.
- Zod for input validation.
- Vitest and Testing Library for automated tests.
- npm as the package manager.

Use TanStack Server Functions for sensitive operations and application-specific business logic. Direct Supabase client access is acceptable only when the operation is correctly protected by RLS and does not expose privileged capabilities.

## 4. Domain invariants

1. Football ID belongs to a player, not an organization.
2. A player may have multiple current or historical organization affiliations.
3. A user may hold multiple roles.
4. A guardian-player relationship must be verified.
5. Consent must be explicit, traceable, scoped, and revocable.
6. Child-related information must receive appropriate privacy and safeguarding protections.
7. Competition and player development histories must be traceable.
8. Organization membership and resource relationships must determine access scope.
9. Frontend role state must never be trusted as authorization.
10. Access must be denied by default unless explicitly permitted.

## 5. Proposed domain areas

- Identity and profiles.
- Organizations and memberships.
- Player identity and Football ID.
- Guardians and consent.
- Teams and team memberships.
- Training sessions and attendance.
- Player assessments and development plans.
- Competitions, registrations, matches, and results.
- Opportunities and applications.
- Verification and audit logs.

This is a conceptual domain map, not an approved physical database schema.

## 6. Security baseline

- Enable RLS on all tables exposed to application users.
- Scope organization data by verified membership and resource relationships.
- Avoid global role-only policies for access to organization-owned resources.
- Keep service-role credentials exclusively on trusted server environments.
- Use private storage buckets for sensitive documents and player information.
- Validate all server inputs with schemas.
- Record sensitive administrative and consent-related actions.
- Test both permitted and denied access paths, including cross-organization access.
- Do not use localStorage or client-side state as an authorization source.

## 7. Database lifecycle

Use Supabase CLI as the sole migration owner.

- Keep SQL migrations in `supabase/migrations/`.
- Develop against a local Supabase environment.
- Review every schema and RLS migration.
- Test migrations on a clean database.
- Apply reviewed migrations to staging before production.
- Never use manual production dashboard edits as a substitute for version-controlled migrations.

## 8. Environment strategy

Maintain separate local, staging, and production environments.

- Never commit `.env` or secret values.
- Commit only safe environment templates such as `.env.example`.
- Keep publishable client configuration separate from server secrets.
- Rotate any credential previously exposed in Git history.
- Do not use production data in local development or AI prompts.

## 9. Development workflow

- `main` is the stable integration branch.
- Create a dedicated branch for each task.
- Require a clear scope and acceptance criteria before implementation.
- Ask Copilot to analyze before modifying files.
- Keep changes focused and reviewable.
- Run relevant tests, type checks, lint, and build before opening a pull request.
- Require human review for database, security, authentication, and authorization changes.

## 10. Definition of done

A feature is not complete merely because its UI works.

It must have:
- Approved business rules.
- Defined data contracts.
- Appropriate server-side validation.
- Correct authorization and RLS.
- Loading, empty, error, and success states.
- Automated tests for critical behavior.
- Updated documentation where necessary.
- No unrelated changes or exposed secrets.

## 11. Explicitly deferred decisions

The following must be resolved before their respective implementations:
- Canonical product and brand naming.
- Final role and permission matrix.
- Organization hierarchy and verification rules.
- Guardian verification process.
- Consent categories, retention, and revocation behavior.
- Football ID issuance and recovery rules.
- Payment provider and payment lifecycle.
- AI provider, cost controls, and data-sharing policy.
- Production hosting and deployment pipeline.

No developer or AI coding assistant may silently invent these policies.