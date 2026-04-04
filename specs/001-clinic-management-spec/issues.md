# Issue Plan: MediCare End-to-End Clinic Management

**Source**: [tasks.md](tasks.md)
**Goal**: Convert the current task plan into smaller, beginner-friendly issues that can be created in GitHub or another tracker.

## Issue 1 - Frontend app shell and responsive layout
- **Phase**: Frontend foundation
- **Summary**: Set up the shared app frame, navigation, and route structure so every screen has a consistent place to live.
- **Beginner steps**: create the top-level layout; add basic navigation; verify the UI fits mobile, tablet, desktop, and target wrappers.
- **Acceptance criteria**: the app loads with no layout breakage; the shell is reusable across pages; the layout is ready for later clinic screens.
- **Files likely touched**: frontend layout, routing, shared styles, navigation components.
- **Labels**: frontend, foundation, cross-platform, good-first-issue

## Issue 2 - Shared UI components and data models
- **Phase**: Frontend foundation
- **Summary**: Add the reusable buttons, cards, form fields, table/list row patterns, and basic clinic data types needed by later screens.
- **Beginner steps**: define the shared patient/appointment shapes; build a small UI component set; use the shared pieces in one simple demo view.
- **Acceptance criteria**: common UI pieces are reused instead of duplicated; data shapes are consistent; later screens can import them without extra cleanup.
- **Files likely touched**: frontend shared components, frontend types/models, styling tokens.
- **Labels**: frontend, ui-kit, typescript, good-first-issue

## Issue 3 - Patient list screen
- **Phase**: Frontend patient workflows
- **Summary**: Build the first real clinic screen showing a list of patients with loading and empty states.
- **Beginner steps**: wire the screen to mock data first; add sorting/filter placeholders if needed; show a clear empty state when no records exist.
- **Acceptance criteria**: patient rows render correctly; loading and empty states work; the screen uses shared UI components.
- **Files likely touched**: frontend patient list page, list item components, mock data.
- **Labels**: frontend, patient, good-first-issue

## Issue 4 - Patient detail screen
- **Phase**: Frontend patient workflows
- **Summary**: Build a patient detail view that shows the basic patient record and related summary sections.
- **Beginner steps**: create the detail page; add read-only sections for core patient fields; include links or buttons for edit and back navigation.
- **Acceptance criteria**: a selected patient can be viewed in a detail layout; the screen handles missing data safely; edit/navigation actions are visible.
- **Files likely touched**: frontend patient detail page, detail components, shared formatting helpers.
- **Labels**: frontend, patient, ui, good-first-issue

## Issue 5 - Appointment overview screen
- **Phase**: Frontend appointment workflows
- **Summary**: Add a simple appointment list or schedule overview so users can see clinic activity next.
- **Beginner steps**: build the overview screen with mock appointments; show status badges or time labels; add empty and loading states.
- **Acceptance criteria**: appointments are visible in a readable order; the screen works on small and large viewports; no backend data is required yet.
- **Files likely touched**: frontend appointment page, list/calendar components, mock data.
- **Labels**: frontend, appointment, good-first-issue

## Issue 6 - Patient create/edit form
- **Phase**: Frontend patient workflows
- **Summary**: Build the patient form for creating and updating records with beginner-friendly validation.
- **Beginner steps**: add form fields one group at a time; validate required inputs; show save and cancel actions.
- **Acceptance criteria**: the form supports create and edit modes; validation messages appear clearly; invalid submissions do not pass.
- **Files likely touched**: frontend patient form page, form components, validation helpers.
- **Labels**: frontend, patient, forms, good-first-issue

## Issue 7 - Appointment create/edit form
- **Phase**: Frontend appointment workflows
- **Summary**: Build the appointment form for scheduling and updating visits.
- **Beginner steps**: add time/date and patient selection fields; validate required inputs; confirm the form can save or cancel cleanly.
- **Acceptance criteria**: create and edit modes both work; validation is present; the form is ready to connect to real data later.
- **Files likely touched**: frontend appointment form page, form components, validation helpers.
- **Labels**: frontend, appointment, forms, good-first-issue

## Issue 8 - Database abstraction and SQLite schema with PostgreSQL-ready config
- **Phase**: Database foundation
- **Summary**: Set up the persistence layer using free SQLite first, but keep the config and schema easy to move to PostgreSQL later.
- **Beginner steps**: define the entities or tables; add database config driven by environment variables; make migrations work without SQLite-specific assumptions.
- **Acceptance criteria**: SQLite runs locally; the schema is migration-based; switching to PostgreSQL should only require config changes, not a rewrite.
- **Files likely touched**: backend entities/models, database config, migrations, environment config, connection setup.
- **Labels**: backend, database, sqlite, postgres, foundation

## Issue 9 - Patient repository and service layer
- **Phase**: Backend data access
- **Summary**: Add the patient data access code that reads and writes patient records through the database abstraction.
- **Beginner steps**: implement one read method first; add create/update/delete methods; cover basic edge cases like missing records.
- **Acceptance criteria**: patient CRUD works through the repository/service layer; database logic is isolated from HTTP code; unit tests can target this layer directly.
- **Files likely touched**: backend patient repository/service files, DTOs or mappers, unit tests.
- **Labels**: backend, database, patient, unit-test

## Issue 10 - Appointment repository and service layer
- **Phase**: Backend data access
- **Summary**: Add the appointment data access code and keep it aligned with the same database strategy used for patients.
- **Beginner steps**: implement appointment reads; add create/update/delete behavior; validate relationships to patients where needed.
- **Acceptance criteria**: appointment CRUD works through the repository/service layer; the code remains database-agnostic enough for PostgreSQL later; unit tests cover the main paths.
- **Files likely touched**: backend appointment repository/service files, DTOs or mappers, unit tests.
- **Labels**: backend, database, appointment, unit-test

## Issue 11 - Backend module scaffold and health endpoint
- **Phase**: Backend API foundation
- **Summary**: Create the NestJS module structure and a simple health endpoint before adding business APIs.
- **Beginner steps**: create feature modules; wire the database module in; add one lightweight health check route.
- **Acceptance criteria**: the backend starts cleanly; modules are organized by feature; health checks prove the app is running.
- **Files likely touched**: backend app module, feature modules, health controller, bootstrap files.
- **Labels**: backend, nestjs, foundation, good-first-issue

## Issue 12 - Patient CRUD API
- **Phase**: Backend patient APIs
- **Summary**: Expose patient create, read, update, and delete endpoints using the patient service layer.
- **Beginner steps**: implement the read endpoints first; add create and update; finish with delete and error handling.
- **Acceptance criteria**: the API can manage patient records end to end; validation errors are clear; missing records return consistent responses.
- **Files likely touched**: backend patient controller, DTOs, service integration, API tests.
- **Labels**: backend, api, patient, unit-test

## Issue 13 - Appointment CRUD API
- **Phase**: Backend appointment APIs
- **Summary**: Expose appointment create, read, update, and delete endpoints using the appointment service layer.
- **Beginner steps**: implement list/detail routes first; add create and update; finish with delete and patient relationship checks.
- **Acceptance criteria**: the API manages appointments end to end; invalid patient references are handled safely; responses are predictable for the frontend.
- **Files likely touched**: backend appointment controller, DTOs, service integration, API tests.
- **Labels**: backend, api, appointment, unit-test

## Issue 14 - Frontend unit tests for shared UI and forms
- **Phase**: Quality gates
- **Summary**: Add unit tests for the shared frontend pieces and the patient and appointment forms.
- **Beginner steps**: test one shared component first; add form validation tests next; cover empty and error states.
- **Acceptance criteria**: key frontend modules have unit tests; the tests verify rendering and validation behavior; failures are easy to understand.
- **Files likely touched**: frontend component tests, form tests, test helpers or fixtures.
- **Labels**: frontend, tests, unit-test

## Issue 15 - Database unit tests for repositories and schema behavior
- **Phase**: Quality gates
- **Summary**: Add unit tests for the database layer so SQLite and the PostgreSQL-ready setup stay stable.
- **Beginner steps**: test patient repository reads and writes; test appointment repository behavior; verify config and migration assumptions.
- **Acceptance criteria**: repository behavior is covered by tests; schema changes do not break the suite silently; database setup remains portable.
- **Files likely touched**: backend repository tests, migration tests, database test helpers.
- **Labels**: backend, database, tests, unit-test

## Issue 16 - Backend unit tests for controllers and services
- **Phase**: Quality gates
- **Summary**: Add tests for the HTTP layer and service layer so the API stays correct as features grow.
- **Beginner steps**: test controller success cases; add validation and error cases; cover service logic separately from the database.
- **Acceptance criteria**: controller and service behavior is covered; mocked dependencies are used where appropriate; tests run independently.
- **Files likely touched**: backend controller tests, service tests, API test helpers.
- **Labels**: backend, api, tests, unit-test

## Issue 17 - Platform build and smoke-check support for Android, iOS, and Windows
- **Phase**: Cross-platform readiness
- **Summary**: Verify the app can be built and smoke-tested for the requested targets without breaking the existing web flow.
- **Beginner steps**: define the target build path; add simple smoke checks; confirm the UI and navigation still work on each target.
- **Acceptance criteria**: the target builds are documented and runnable; basic smoke checks pass on Android, iOS, and Windows paths; cross-platform changes do not regress the core app.
- **Files likely touched**: app config, build scripts, platform-specific setup, CI or verification scripts.
- **Labels**: platform, cross-platform, build, verification

## Suggested Creation Order
1. Issue 1
2. Issue 2
3. Issue 11
4. Issue 8
5. Issue 3
6. Issue 4
7. Issue 5
8. Issue 6
9. Issue 7
10. Issue 9
11. Issue 10
12. Issue 12
13. Issue 13
14. Issue 14
15. Issue 15
16. Issue 16
17. Issue 17

## Notes
- These issues are intentionally smaller than the current tasks.md entries.
- The early phase stays on SQLite/free PostgreSQL and avoids paid database infrastructure.
- The later PostgreSQL upgrade should stay configuration-plus-migration, not a rewrite.
