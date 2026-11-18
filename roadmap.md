# Migration roadmap

- [x] Inspect the uploaded archive without executing its scripts.
- [x] Record the archive’s capabilities, missing data and migration status.
- [x] Recreate all routes, shared modules, prototype fixtures and design assets.
- [x] Verify all route rendering, core interactions, tests and current preview build.
- [ ] Confirm that the bundled player fixtures are synthetic before any real-world use.
- [ ] Add coach-entered assessment and training records with private persistent storage.
- [ ] Generate individualized development plans through AI Gateway from minimal performance data.
- [ ] Verify signed-in record saves, plan generation, reload behavior, and relevant tests.
- [x] Add Cloud sign-in and account profiles for persistent records.
- [ ] Persist owned player, assessment, training-session, and attendance records with row-level privacy.
- [ ] Connect roster, assessment, and training screens; verify signed-in saves and reloads.
- [x] Add secure organizer accounts, persisted match rosters, QR passport scanning, and shared check-in records.
- [ ] Assign the first organizer account (waiting for the user's account email).

## Opsi A — SSB & pelatih
- [ ] Coach role (designated accounts only) with read access to players and training records.
- [ ] Persisted SSB roster: list players by team and register new players with generated Football ID.
- [ ] Coach assessment form saved to the database with history per player.
- [ ] AI development plan from assessments + attendance (no names/IDs sent to AI), saved per player.
- [ ] Verify saves, reload, AI generation and access denial with a temporary coach account.
- [ ] Assign the first coach account (waiting for the user's account email).
