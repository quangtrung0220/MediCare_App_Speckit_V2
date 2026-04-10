# Tasks: MediCare End-to-End Clinic Management

**Input**: Design docs from `/specs/001-clinic-management-spec/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/openapi.yaml

**Tests**: Unit tests are required for every module. For this project, TypeScript modules use Jest.
Google Test is not scheduled because no native/C++ modules are in scope for the current plan.

**Organization**: Tasks are grouped by user story to preserve independent delivery and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize workspace conventions, shared configuration, and test scaffolding.

- [ ] T001 Create feature documentation baseline in `specs/001-clinic-management-spec/` with plan, spec, research, data-model, quickstart, contracts, and tasks files
- [ ] T002 [P] Configure root-level frontend and backend environment examples for free-database-first development in `.env.example` files
- [ ] T003 [P] Configure Jest test scaffolding for frontend and backend modules in `frontend/jest.config.*` and `backend/jest.config.*`
- [ ] T004 [P] Add reusable test utilities for mocked API, router, and form state in `frontend/src/tests/` and `backend/test/utils/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish portability, shared UX primitives, and data-access foundations required by all stories.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [X] T005 Define shared role and status constants in `frontend/src/utils/roles.ts` and `frontend/src/utils/statuses.ts`
- [X] T006 [P] Build shared responsive shell and navigation framework in `frontend/src/components/layout/` for Android, iOS, and Windows targets
- [ ] T007 [P] Build shared form, loading, error, and empty-state components in `frontend/src/components/ui/`
- [ ] T008 Define free-database-compatible ORM base configuration in `backend/src/database/data-source.ts`
- [ ] T009 [P] Create database-agnostic repository interfaces in `backend/src/services/contracts/`
- [ ] T010 [P] Add initial TypeORM entities for `User`, `Patient`, `Doctor`, and `DoctorSchedule` in `backend/src/models/`
- [ ] T011 Add foundational unit tests for shared frontend shell and UI primitives in `frontend/src/components/__tests__/`
- [ ] T012 Add foundational unit tests for database configuration and repository abstractions in `backend/test/unit/`

**Checkpoint**: Shared UI, DB portability, and test scaffolding are ready.

---

## Phase 3: User Story 1 - Patient Booking and Reminder Journey (Priority: P1)

**Goal**: Deliver a frontend-first patient booking experience with mock APIs, then validate it with unit tests before backend integration.

**Independent Test**: A patient can open the app, browse doctor availability, book a slot, and see confirmation/reminder state using mocked data only.

### Implementation for User Story 1

- [ ] T013 [P] [US1] Build patient booking dashboard page in `frontend/app/book-appointment/page.tsx`
- [ ] T014 [P] [US1] Build doctor availability selector and time-slot picker in `frontend/src/components/booking/`
- [ ] T015 [P] [US1] Build appointment confirmation and reminder status components in `frontend/src/components/booking/`
- [ ] T016 [US1] Create mock booking API adapter in `frontend/src/services/appointment.service.ts`
- [ ] T017 [US1] Add booking state store for selected doctor, slot, and confirmation state in `frontend/src/stores/appointmentStore.ts`
- [ ] T018 [US1] Add responsive booking flow styling for Android, iOS, and Windows layouts in `frontend/app/globals.css` and booking component styles
- [ ] T019 [US1] Add unit tests for booking dashboard, slot picker, and confirmation state in `frontend/src/components/booking/__tests__/`
- [ ] T020 [US1] Add unit tests for booking store and mock API adapter in `frontend/src/stores/__tests__/` and `frontend/src/services/__tests__/`

**Checkpoint**: Patient booking flow is clickable, testable, and works with mocked data.

---

## Phase 4: User Story 2 - Clinical Encounter and Prescription Flow (Priority: P2)

**Goal**: Introduce the database schema, migration path, and repository layer that remain portable from SQLite/free PostgreSQL to production PostgreSQL.

**Independent Test**: The project can create, query, and validate core clinical records using SQLite locally or a free PostgreSQL tier without changing business logic.

### Implementation for User Story 2

- [ ] T021 [P] [US2] Add TypeORM entity definitions for `Appointment`, `MedicalRecord`, `Prescription`, `PrescriptionItem`, `InventoryItem`, `Payment`, `Staff`, and `AuditLog` in `backend/src/models/`
- [ ] T022 [P] [US2] Create initial migrations for core tables and indexes in `backend/src/database/migrations/`
- [ ] T023 [P] [US2] Add portable repository implementations for appointment, record, prescription, inventory, and payment access in `backend/src/services/repositories/`
- [ ] T024 [P] [US2] Add database seeding scripts for roles, doctor schedules, sample patients, and starter inventory in `backend/src/database/seeders/`
- [ ] T025 [US2] Add unit tests for entity validation, repository behavior, and migration helpers in `backend/test/unit/`
- [ ] T026 [US2] Add integration tests that run against SQLite/free PostgreSQL-compatible configuration in `backend/test/integration/`
- [ ] T027 [US2] Document the PostgreSQL upgrade path and schema compatibility notes in `specs/001-clinic-management-spec/data-model.md`

**Checkpoint**: Database layer is free-tier ready, portable, and upgrade-friendly.

---

## Phase 5: User Story 3 - Billing, Reporting, and Audit Compliance (Priority: P3)

**Goal**: Implement backend APIs and business logic that connect the frontend and database for clinical workflows, billing, reporting, and compliance.

**Independent Test**: A scheduled patient can be processed end-to-end through check-in, record creation, prescription issuance, payment creation, and report export.

### Implementation for User Story 3

- [ ] T028 [P] [US3] Implement authentication and role-based access guards in `backend/src/guards/`
- [ ] T029 [P] [US3] Implement booking, medical record, prescription, inventory, and payment services in `backend/src/services/`
- [ ] T030 [P] [US3] Implement REST controllers for auth, appointments, medical records, prescriptions, inventory, payments, reports, and health in `backend/src/controllers/`
- [ ] T031 [P] [US3] Wire frontend service adapters from mocked endpoints to real API calls in `frontend/src/services/`
- [ ] T032 [US3] Implement audit-log emission for sensitive reads and writes in `backend/src/middleware/` and `backend/src/services/`
- [ ] T033 [US3] Add notification/reminder orchestration for appointment confirmation and reminder status in `backend/src/queues/`
- [ ] T034 [US3] Add unit tests for services, guards, and controller helpers in `backend/test/unit/`
- [ ] T035 [US3] Add integration tests for RBAC, appointment flow, prescription dispensing, and billing/reporting in `backend/test/integration/`
- [ ] T036 [US3] Add contract tests for the OpenAPI endpoints in `backend/test/contract/`

**Checkpoint**: Backend integration is complete and frontend is connected to live APIs.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Strengthen portability, performance, and release readiness.

- [ ] T037 [P] Add performance checks for booking, record retrieval, and report export targets in `backend/test/performance/` and `frontend/tests/performance/`
- [ ] T038 [P] Validate responsive behavior for Android, iOS, and Windows layouts in `frontend/src/components/__tests__/`
- [ ] T039 [P] Add migration rollback verification and restore drill notes in `specs/001-clinic-management-spec/quickstart.md`
- [ ] T040 Refactor shared modules to remove any SQLite-specific assumptions before production upgrade in `backend/src/` and `frontend/src/`
- [ ] T041 Run final documentation pass for `specs/001-clinic-management-spec/plan.md`, `specs/001-clinic-management-spec/research.md`, and `specs/001-clinic-management-spec/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; delivers the first visible MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and supports the free-database path.
- **User Story 3 (Phase 5)**: Depends on User Story 2 data layer plus the shared frontend from User Story 1.
- **Polish (Phase 6)**: Depends on completion of the desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories; can ship as mock-driven frontend MVP.
- **User Story 2 (P2)**: Depends on the foundational shared data-access layer; keeps upgrade path to PostgreSQL portable.
- **User Story 3 (P3)**: Depends on User Story 2 for persistence and User Story 1 for shared UI shell usage.

### Within Each User Story

- Build shared components before feature-specific screens.
- Write unit tests alongside each module.
- Use mock APIs for frontend-first work, then replace them with real APIs later.
- Keep schema, repository, and service boundaries portable so SQLite/free PostgreSQL can be upgraded without rewriting business logic.

### Parallel Opportunities

- All tasks marked [P] can run in parallel when they touch different files.
- Frontend component tasks, database schema tasks, and backend controller tasks can be split across contributors once foundational work is complete.
- Unit tests for a module can be developed in parallel with its implementation when they target different files.

---

## Parallel Example: User Story 1

```bash
Task: "Build doctor availability selector and time-slot picker in frontend/src/components/booking/"
Task: "Build appointment confirmation and reminder status components in frontend/src/components/booking/"
Task: "Create mock booking API adapter in frontend/src/services/appointment.service.ts"
```

---

## Implementation Strategy

### MVP First (Frontend Booking Flow)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Validate the patient booking flow independently using mocked data.
5. Demo the UI on Android, iOS, and Windows browsers before backend work begins.

### Incremental Delivery

1. Ship frontend-first booking MVP.
2. Add SQLite/free PostgreSQL-compatible schema and repositories.
3. Replace mocked APIs with live backend endpoints.
4. Expand into prescriptions, inventory, payments, and reporting.
5. Upgrade to managed PostgreSQL later without rewriting the business layer.

### Free Database Upgrade Strategy

1. Start with SQLite or free PostgreSQL tier.
2. Keep TypeORM entities, migrations, and repositories PostgreSQL-compatible from day one.
3. When budget exists, switch connection settings and migrate data to managed PostgreSQL.
4. Keep the upgrade as configuration plus migration, not a redesign.

---

## Notes

- [P] tasks = different files, no dependencies.
- Every module introduced in this plan must have unit tests.
- TypeScript unit tests use Jest in the current stack.
- Google Test is reserved for future native/C++ modules only.
- The early phase intentionally avoids paid database infrastructure.