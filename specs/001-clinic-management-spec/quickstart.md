# Quickstart: MediCare End-to-End Clinic Management

## 1. Prerequisites
- Node.js 20+
- pnpm
- Docker + Docker Compose
- PostgreSQL, Redis, RabbitMQ via local containers

## 2. Start Local Dependencies
1. Run database and supporting services with project compose file.
2. Confirm PostgreSQL, Redis, and RabbitMQ health endpoints are reachable.

## 3. Configure Environment
1. Create backend and frontend environment files from examples.
2. Configure DB, Redis, RabbitMQ, JWT, and notification settings.
3. Ensure audit logging and backup jobs are enabled in non-production-safe mode for local testing.

## 4. Install and Run
1. Install workspace dependencies via pnpm.
2. Start backend service in development mode.
3. Start frontend service in development mode.
4. Optionally run Electron wrapper if desktop flow testing is needed.

## 5. Seed Baseline Data
1. Seed roles and test accounts (ADMIN, DOCTOR, NURSE, RECEPTIONIST, PHARMACIST, PATIENT).
2. Seed doctor schedules and inventory starter data.
3. Verify at least one doctor has available slots.

## 6. Execute Core User Flows
1. Patient booking and reminder:
   - Login as patient, book available slot, verify conflict prevention.
   - Verify confirmation/reminder delivery status.
2. Clinical encounter and prescription:
   - Login as receptionist/nurse/doctor/pharmacist to process one encounter end-to-end.
   - Verify medical record version and inventory deduction after dispensing.
3. Billing/reporting/compliance:
   - Record payment, generate invoice, export one report.
   - Verify audit events for sensitive access and changes.

## 7. Test Strategy Run
1. Run unit tests for service/domain logic.
2. Run integration tests for workflow and RBAC transitions.
3. Run contract/API tests for external interfaces.
4. Capture regression evidence for bug fixes introduced during development.

## 8. Performance and UX Validation
1. Verify p95 booking/availability and record retrieval latency targets.
2. Verify role dashboards become interactive within defined budget.
3. Validate consistent navigation, status labels, and responsive behavior across roles.

## 9. Exit Criteria for Planning Completion
- All required artifacts exist: spec.md, plan.md, research.md, data-model.md, quickstart.md, contracts/openapi.yaml.
- Constitution gates are marked PASS with evidence references.
- No unresolved clarification markers remain.
