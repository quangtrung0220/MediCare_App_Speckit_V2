# Phase 0 Research: MediCare End-to-End Clinic Management

## Decision 1: Architecture style and service boundaries
- Decision: Use a modular monorepo with backend modules (NestJS), frontend app (Next.js), and optional Electron wrapper while preserving clear domain boundaries.
- Rationale: Current project documentation already defines this shape, allowing independent delivery by domain (appointments, records, inventory, billing) without introducing migration risk.
- Alternatives considered: Full microservices split now was rejected due to higher operational complexity for a learning-stage project.

## Decision 2: Scheduling and conflict prevention
- Decision: Enforce appointment uniqueness with transactional conflict checks at booking and reschedule time, plus indexed lookup by doctor/time window.
- Rationale: Functional goals require zero accepted duplicate slots and reliable real-time scheduling.
- Alternatives considered: Cache-only conflict checks were rejected because they are vulnerable to race conditions under concurrent writes.

## Decision 3: Clinical record versioning and auditability
- Decision: Version medical records and keep immutable audit logs for sensitive read/write actions.
- Rationale: Supports compliance intent (GDPR/HIPAA-like controls) and safe clinical traceability.
- Alternatives considered: Mutable-in-place records only were rejected because they reduce forensic and clinical accountability.

## Decision 4: Prescription and inventory coupling
- Decision: Couple dispensing workflow to inventory decrement with explicit prescription status transitions.
- Rationale: Prevents stock drift and supports pharmacy traceability.
- Alternatives considered: Manual inventory updates after dispensing were rejected due to high risk of stale stock and reporting inaccuracy.

## Decision 5: Performance budget baseline
- Decision: Keep feature-level budgets from specification and constitution as baseline:
  - Booking and availability checks p95 <= 3s (feature)
  - Record retrieval p95 <= 3s (feature)
  - Role dashboards interactive <= 2s (feature/constitution)
  - Daily report exports p95 <= 60s
- Rationale: Budgets are already tied to measurable outcomes and user-perceived workflow responsiveness.
- Alternatives considered: No explicit budgets were rejected because constitutional gates require measurable performance targets.

## Decision 6: Testing strategy by risk tier
- Decision: Require unit tests for domain services, integration tests for RBAC and workflow transitions, and contract tests for public API surfaces.
- Rationale: Constitution requires mandatory test coverage and regression protection for high-impact workflows.
- Alternatives considered: Unit-only strategy was rejected because cross-module failures (auth, queue, persistence) would remain undetected.

## Decision 7: UX consistency model
- Decision: Standardize role-aware navigation, form validation, status vocabulary, loading/error/empty states, and smart back-navigation behavior.
- Rationale: Project goals emphasize operational consistency across ADMIN/DOCTOR/NURSE/RECEPTIONIST/PHARMACIST/PATIENT roles.
- Alternatives considered: Team-by-team UI variation was rejected due to increased training burden and user errors.

## Decision 8: Data protection and recovery controls
- Decision: Encrypt sensitive data in transit/at rest, enforce least-privilege RBAC, retain immutable audit logs, and validate daily backup/recovery routines against RTO/RPO requirements.
- Rationale: Aligns with security/compliance requirements and documented recovery objectives.
- Alternatives considered: Best-effort controls without explicit verification were rejected because they fail constitutional compliance gates.
