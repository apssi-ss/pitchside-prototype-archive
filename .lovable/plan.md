# Persistent BolaID Records

## Outcome
Save each account’s player, assessment, training-session, and attendance records in Lovable Cloud so they remain available across sessions.

## Work
- Add email/password, Google, and Lovable sign-in with profile creation, confirmation-aware signup, reset-password flow, and session-aware sign-out.
- Add owner-scoped database tables and row policies for profiles, players, assessments, training sessions, and attendance; do not import the prototype’s fictional sample records.
- Connect the roster screen to player create/edit/delete, assessment entry to load and save per-player assessments, and training attendance to load and save per-session marks.
- Keep signed-out prototype browsing intact, but require an account to save; explain that each account currently sees only its own records.

## Technical details
Use the generated Cloud client and auth attachment, public-schema grants plus RLS, user-owned rows, and regenerated database types. Validate the sign-in screens, persistence flows, tests, and preview diagnostics.
