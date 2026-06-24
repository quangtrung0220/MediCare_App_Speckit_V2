# Tasks: MediCare End-to-End Clinic Management

**Input**: Design docs from `/specs/001-clinic-management-spec/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md, contracts/openapi.yaml

**Tests**: Unit tests are required for every module. For this project, TypeScript modules use Jest.
Google Test is not scheduled because no native/C++ modules are in scope for the current plan.

**Organization**: Tasks are grouped by user story to preserve independent delivery and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize workspace conventions, shared configuration, and test scaffolding.

- [x] T001 Create feature documentation baseline in `specs/001-clinic-management-spec/` with plan, spec, research, data-model, quickstart, contracts, and tasks files
- [x] T002 [P] Configure root-level frontend and backend environment examples for free-database-first development in `.env.example` files
- [x] T003 [P] Configure Jest test scaffolding for frontend and backend modules in `frontend/jest.config.*` and `backend/jest.config.*`
- [x] T004 [P] Add reusable test utilities for mocked API, router, and form state in `frontend/src/tests/` and `backend/test/utils/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish portability, shared UX primitives, and data-access foundations required by all stories.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [x] T005 Define shared role and status constants in `frontend/src/utils/roles.ts` and `frontend/src/utils/statuses.ts`
- [x] T006 [P] Build shared responsive shell and navigation framework in `frontend/src/components/layout/` for Android, iOS, and Windows targets
- [x] T007 [P] Build shared form, loading, error, and empty-state components in `frontend/src/components/ui/`
- [x] T008 Define free-database-compatible ORM base configuration in `backend/src/database/data-source.ts`
- [x] T009 [P] Create database-agnostic repository interfaces in `backend/src/services/contracts/`
- [x] T010 [P] Add initial TypeORM entities for `User`, `Patient`, `Doctor`, and `DoctorSchedule` in `backend/src/models/`
- [x] T011 Add foundational unit tests for shared frontend shell and UI primitives in `frontend/src/components/__tests__/`
- [x] T012 Add foundational unit tests for database configuration and repository abstractions in `backend/test/unit/`

**Checkpoint**: Shared UI, DB portability, and test scaffolding are ready.

---

## Phase 3: User Story 1 - Patient Booking and Reminder Journey (Priority: P1)

**Goal**: Deliver a frontend-first patient booking experience with mock APIs, then validate it with unit tests before backend integration.

**Independent Test**: A patient can open the app, browse doctor availability, book a slot, and see confirmation/reminder state using mocked data only.

### Implementation for User Story 1

- [x] T013 [P] [US1] Build patient booking dashboard page in `frontend/app/book-appointment/page.tsx`
- [x] T014 [P] [US1] Build doctor availability selector and time-slot picker in `frontend/src/components/booking/`
- [x] T015 [P] [US1] Build appointment confirmation and reminder status components in `frontend/src/components/booking/`
- [x] T016 [US1] Create mock booking API adapter in `frontend/src/services/appointment.service.ts`
- [x] T017 [US1] Add booking state store for selected doctor, slot, and confirmation state in `frontend/src/stores/appointmentStore.ts`
- [x] T018 [US1] Add responsive booking flow styling for Android, iOS, and Windows layouts in `frontend/app/globals.css` and booking component styles
- [x] T019 [US1] Add unit tests for booking dashboard, slot picker, and confirmation state in `frontend/src/components/booking/__tests__/`
- [x] T020 [US1] Add unit tests for booking store and mock API adapter in `frontend/src/stores/__tests__/` and `frontend/src/services/__tests__/`

**Checkpoint**: Patient booking flow is clickable, testable, and works with mocked data.

---

## Phase 4: User Story 2 - Clinical Encounter and Prescription Flow (Priority: P2)

**Goal**: Introduce the database schema, migration path, and repository layer that remain portable from SQLite/free PostgreSQL to production PostgreSQL.

**Independent Test**: The project can create, query, and validate core clinical records using SQLite locally or a free PostgreSQL tier without changing business logic.

### Implementation for User Story 2

- [x] T021 [P] [US2] Add TypeORM entity definitions for `Appointment`, `MedicalRecord`, `Prescription`, `PrescriptionItem`, `InventoryItem`, `Payment`, `Staff`, and `AuditLog` in `backend/src/models/`
- [x] T022 [P] [US2] Create initial migrations for core tables and indexes in `backend/src/database/migrations/`
- [x] T023 [P] [US2] Add portable repository implementations for appointment, record, prescription, inventory, and payment access in `backend/src/services/repositories/`
- [x] T024 [P] [US2] Add database seeding scripts for roles, doctor schedules, sample patients, and starter inventory in `backend/src/database/seeders/`
- [x] T025 [US2] Add unit tests for entity validation, repository behavior, and migration helpers in `backend/test/unit/`
- [x] T026 [US2] Add integration tests that run against SQLite/free PostgreSQL-compatible configuration in `backend/test/integration/`
- [x] T027 [US2] Document the PostgreSQL upgrade path and schema compatibility notes in `specs/001-clinic-management-spec/data-model.md`

**Checkpoint**: Database layer is free-tier ready, portable, and upgrade-friendly.

---

## Phase 5: User Story 3 - Billing, Reporting, and Audit Compliance (Priority: P3)

**Goal**: Implement backend APIs and business logic that connect the frontend and database for clinical workflows, billing, reporting, and compliance.

**Independent Test**: A scheduled patient can be processed end-to-end through check-in, record creation, prescription issuance, payment creation, and report export.

### Implementation for User Story 3

- [x] T028 [P] [US3] Implement authentication and role-based access guards in `backend/src/guards/`
- [x] T029 [P] [US3] Implement booking, medical record, prescription, inventory, and payment services in `backend/src/services/`
- [x] T030 [P] [US3] Implement REST controllers for auth, appointments, medical records, prescriptions, inventory, payments, reports, and health in `backend/src/controllers/`
- [x] T031 [P] [US3] Wire frontend service adapters from mocked endpoints to real API calls in `frontend/src/services/`
- [x] T032 [US3] Implement audit-log emission for sensitive reads and writes in `backend/src/middleware/` and `backend/src/services/`
- [x] T033 [US3] Add notification/reminder orchestration for appointment confirmation and reminder status in `backend/src/queues/`
- [x] T034 [US3] Add unit tests for services, guards, and controller helpers in `backend/test/unit/`
- [x] T035 [US3] Add integration tests for RBAC, appointment flow, prescription dispensing, and billing/reporting in `backend/test/integration/`
- [x] T036 [US3] Add contract tests for the OpenAPI endpoints in `backend/test/contract/`

**Checkpoint**: Backend integration is complete and frontend is connected to live APIs.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Strengthen portability, performance, and release readiness.

- [x] T037 [P] Add performance checks for booking, record retrieval, and report export targets in `backend/test/performance/` and `frontend/tests/performance/`
- [x] T038 [P] Validate responsive behavior for Android, iOS, and Windows layouts in `frontend/src/components/__tests__/`
- [x] T039 [P] Add migration rollback verification and restore drill notes in `specs/001-clinic-management-spec/quickstart.md`
- [x] T040 Refactor shared modules to remove any SQLite-specific assumptions before production upgrade in `backend/src/` and `frontend/src/`
- [x] T041 Run final documentation pass for `specs/001-clinic-management-spec/plan.md`, `specs/001-clinic-management-spec/research.md`, and `specs/001-clinic-management-spec/quickstart.md`