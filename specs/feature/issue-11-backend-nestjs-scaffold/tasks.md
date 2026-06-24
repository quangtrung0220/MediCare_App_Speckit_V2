# Tasks: MediCare E2E Screen UI/UX Design

**Input**: Design documents from `/specs/feature/issue-11-backend-nestjs-scaffold/`
**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: Unit tests for React components are required using React Testing Library.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each portal and role dashboard.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and styling setup

- [x] T001 Initialize frontend UI directory structure for custom routing under `frontend/app/`
- [x] T002 Configure mock service adapters for new modules in `frontend/src/services/`
- [x] T003 [P] Setup CSS styling assets and main variables in `frontend/app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core UI shell and navigational components

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Build responsive layout AppShell inside `frontend/src/components/layout/AppShell.tsx` and custom navigation links in `SidebarNav.tsx`
- [x] T005 [P] Implement core button primitive styling in `frontend/src/components/ui/Button.tsx` and standard forms wrapper in `Field.tsx`
- [x] T006 [P] Add shared loading overlay spinner in `frontend/src/components/ui/LoadingState.tsx` and empty list placeholders in `EmptyState.tsx`
- [x] T007 Add foundational component tests for AppShell layout and Button primitive inside `frontend/test/components/AppShell.test.tsx` and `Button.test.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Patient Booking and Reminders (Priority: P1) 🎯 MVP

**Goal**: Deliver a patient-facing booking dashboard and a personal appointments history log.

**Independent Test**: Patient can navigate to `/book-appointment`, complete the 4-step booking wizard, and verify it in `/my-appointments` with mock services.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create booking wizard state store in `frontend/src/stores/appointmentStore.ts`
- [x] T009 [P] [US1] Create appointment list view hook in `frontend/src/hooks/useAppointments.ts`
- [x] T010 [P] [US1] Implement DoctorCard component in `frontend/src/components/booking/DoctorCard.tsx`
- [x] T011 [P] [US1] Build TimeSlotPicker slot selection grid in `frontend/src/components/booking/TimeSlotPicker.tsx`
- [x] T012 [P] [US1] Build ConfirmPreview check details view in `frontend/src/components/booking/BookingConfirmation.tsx`
- [x] T013 [US1] Integrate multi-step wizard page in `frontend/app/book-appointment/page.tsx`
- [x] T014 [US1] Build My Appointments list layout in `frontend/app/my-appointments/page.tsx`
- [x] T015 [P] [US1] Add unit tests for booking store in `frontend/test/stores/appointmentStore.test.ts`
- [x] T016 [P] [US1] Add unit tests for booking components in `frontend/test/components/BookingComponents.test.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Clinical Encounter and Intake Flow (Priority: P2)

**Goal**: Provide doctors and nurses workspace panels to record vitals, write diagnosis notes, and prescribe medicine.

**Independent Test**: Nurse registers vital stats for a patient, Doctor views the record, writes diagnosis notes, and selects prescription items from search inventory.

### Implementation for User Story 2

- [x] T017 [P] [US2] Create intake vital stats state store in `frontend/src/stores/intakeStore.ts`
- [x] T018 [P] [US2] Create patient clinical records search store in `frontend/src/stores/clinicalStore.ts`
- [x] T019 [P] [US2] Build intake vitals form component in `frontend/src/components/nurse/IntakeForm.tsx`
- [x] T020 [P] [US2] Build prescription builder component in `frontend/src/components/doctor/PrescriptionBuilder.tsx`
- [x] T021 [US2] Implement Nurse Intake Queue page in `frontend/app/nurse/page.tsx`
- [x] T022 [US2] Implement Doctor Clinical encounter workspace screen in `frontend/app/doctor/encounter/[id]/page.tsx`
- [x] T023 [P] [US2] Add unit tests for intake forms and prescription builder in `frontend/test/components/ClinicalComponents.test.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Receptionist, Pharmacist & Admin Flow (Priority: P3)

**Goal**: Receptionist manages scheduler calendars, pharmacist dispenses inventory, and admins audit system actions.

**Independent Test**: Receptionist checks in a patient, Pharmacist dispenses an approved prescription, Admin lists users and views log entries.

### Implementation for User Story 3

- [x] T024 [P] [US3] Create receptionist check-in service adapter in `frontend/src/services/receptionist.service.ts`
- [x] T025 [P] [US3] Create pharmacist dispensing service adapter in `frontend/src/services/pharmacist.service.ts`
- [x] T026 [P] [US3] Build check-in desk card component in `frontend/src/components/receptionist/CheckInCard.tsx`
- [x] T027 [P] [US3] Build inventory levels table in `frontend/src/components/pharmacist/InventoryTable.tsx`
- [x] T028 [US3] Implement Receptionist scheduling page in `frontend/app/receptionist/page.tsx`
- [x] T029 [US3] Implement Pharmacist dispensing queue dashboard in `frontend/app/pharmacist/page.tsx`
- [x] T030 [US3] Implement Inventory stock overview page in `frontend/app/inventory/page.tsx`
- [x] T031 [US3] Implement Admin settings page in `frontend/app/admin/page.tsx`
- [x] T032 [US3] Implement Auditor security logging table in `frontend/app/audit/page.tsx`
- [x] T033 [US3] Implement Billing and invoices page in `frontend/app/billing/page.tsx`
- [x] T034 [US3] Implement Operational reports dashboard page in `frontend/app/reports/page.tsx`
- [x] T035 [US3] Implement Data privacy and settings page in `frontend/app/profile/privacy/page.tsx`
- [x] T036 [P] [US3] Add unit tests for receptionist, pharmacist, and admin view components in `frontend/test/components/AdminComponents.test.tsx`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T037 Code cleaning and CSS module performance review in `frontend/`
- [x] T038 [P] Run responsive layout tests across Android/iOS viewport resolutions for all dashboards

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete
