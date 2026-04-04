# Implementation Plan: MediCare End-to-End Clinic Management

**Branch**: `001-clinic-management-spec` | **Date**: 2026-04-04 | **Spec**: /specs/001-clinic-management-spec/spec.md
**Input**: Feature specification from `/specs/001-clinic-management-spec/spec.md`

## Summary

Deliver a complete clinic management flow covering patient booking and reminders,
clinical encounter and prescription workflows, and billing/reporting/compliance traces.
Implementation follows a modular web-application structure (NestJS backend + Next.js frontend)
with strict RBAC, immutable auditability, required test coverage, and explicit
UX/performance acceptance gates. Delivery priority is Frontend-first, then Database,
then Backend integration/hardening.
The initial phase uses only SQLite or free PostgreSQL tiers so the project can start
with zero/near-zero database cost, while preserving an easy upgrade path to paid
production PostgreSQL later.

## Beginner-Friendly Execution Mode

Because the project owner is new to the selected stack, implementation will follow
a learning-first delivery mode while preserving long-term architecture goals.

### Principle

- Build in small vertical slices with working demos each week.
- Prefer managed services and templates first; custom infrastructure later.
- Keep TypeScript but allow temporary JavaScript in learning branches for rapid progress,
  then convert to TypeScript incrementally.

### Simplified Learning Path (Recommended)

1. Week 1: Frontend fundamentals only
  - Learn React/Next basics by building static role dashboards and shared components.
  - Use mock JSON data (no backend calls).
2. Week 2: Frontend with API simulation
  - Add client-side form validation, loading/error states, and fake API adapters.
  - Validate UX consistency across all roles.
3. Week 3: Database basics
  - Learn PostgreSQL essentials (tables, relations, indexes, constraints).
  - Run migrations and seed scripts with sample clinical data.
4. Week 4: Backend basics
  - Implement minimum NestJS modules for auth + appointments + health.
  - Replace frontend mocks for P1 flow only.
5. Week 5+: Expand module-by-module
  - Add medical records, prescriptions, inventory, payments, and reports in priority order.

### Guardrails for New Developers

- Do not start all modules at once; complete P1 (booking flow) before P2/P3.
- Keep each pull request small (single feature or single bug fix).
- Every new endpoint must include at least one passing test and one failure case test.
- Record short notes after each task: what worked, what failed, what to improve.

### Reduced-Complexity Options (Until Comfortable)

- Use SQLite or a free PostgreSQL tier for all early-phase development and demos.
- Prefer SQLite for fully local learning branches when offline work is needed.
- Keep ORM mappings, migrations, and SQL usage PostgreSQL-compatible so the later
  upgrade to production PostgreSQL is low-friction.
- Use managed PostgreSQL only after the project outgrows the free-tier limits.
- Defer RabbitMQ workers to a later phase; start with synchronous flows where acceptable.
- Defer Electron packaging until web version is stable on Windows/macOS/Linux browsers.

## Technical Context

**Language/Version**: TypeScript 5.x (backend/frontend), Node.js 20 LTS runtime  
**Primary Dependencies**: NestJS 11.x, Next.js 16.x, React 19.x, TypeORM 0.3, JWT/Passport,
Redis 7, RabbitMQ 3.12, Tailwind CSS 4.x, Axios 1.13  
**Storage**: SQLite for local learning, free PostgreSQL tier for early dev/demo,
PostgreSQL 15+ for later production; Redis cache/session, object storage for files/exports  
**Testing**: Jest 30.x (unit/integration), Supertest 7.x (API contract/integration),
Playwright (planned E2E), React Testing Library (planned component tests); Google Test
for any native/C++ modules or desktop helpers where applicable  
**Target Platform**: Android, iOS, and Windows devices; browser-based access for mobile and desktop,
with optional Electron packaging for Windows desktop distribution  
**Project Type**: Web application with backend + frontend modules in monorepo layout  
**Performance Goals**: booking and availability p95 <= 3s, record retrieval p95 <= 3s,
dashboard interactive <= 2s, report export p95 <= 60s  
**Constraints**: strict RBAC, immutable audit logs for sensitive actions, GDPR-oriented
data rights flows, daily backup/recovery objectives (RTO/RPO 48h), role-based UX consistency  
**Scale/Scope**: medium clinic workload; six operational roles plus patient portal; core modules
for appointments, clinical records, prescriptions, inventory, payments, reports, compliance

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Gate Review

- Code Quality Gate: PASS
  - Policy: lint/format/type checks required in CI before merge.
  - Review: PRs include risk notes, rationale, and changed-file intent.
- Test Strategy Gate: PASS
  - Required suites: unit tests for every module, integration (workflow/RBAC), contract/API tests.
  - Execution framework: Jest for TypeScript modules; Google Test only for native/C++ modules or
    desktop helpers if introduced later.
  - Regression policy: bug fixes must include failing-then-passing regression tests.
- UX Consistency Gate: PASS
  - Role-aware navigation and shared interaction model defined in spec UX requirements.
- Performance Gate: PASS
  - Explicit measurable budgets defined in spec performance requirements.
- Security & Auditability Gate: PASS
  - RBAC, immutable audit trails, and data protection requirements captured in scope.

### Post-Design Gate Review (after Phase 1 artifacts)

- Code Quality Gate: PASS
  - Design artifacts keep module boundaries and ownership clear for review and maintainability.
- Test Strategy Gate: PASS
  - Research and quickstart include concrete test layers and execution order.
  - All modules have unit-test coverage in the chosen framework for their implementation language.
- UX Consistency Gate: PASS
  - Data model and API contract preserve consistent role semantics and status vocabulary.
- Performance Gate: PASS
  - Contract and quickstart include measurable verification expectations for latency budgets.
- Security & Auditability Gate: PASS
  - Data model includes audit immutability and least-privilege-aligned entities/flows.

## Project Structure

### Documentation (this feature)

```text
specs/001-clinic-management-spec/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── auth/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── guards/
│   ├── queues/
│   └── database/
└── test/

frontend/
├── app/
├── src/
│   ├── components/
│   ├── services/
│   ├── stores/
│   └── utils/
└── tests/

electron/
└── [desktop wrapper artifacts]
```

**Structure Decision**: Use the web-application structure with backend and frontend modules,
keeping Electron optional for packaging and distribution.

## Implementation Priority & Rollout Order

### Priority 1: Frontend First (UI/UX Foundation)

- Build role-based navigation shells for ADMIN/DOCTOR/NURSE/RECEPTIONIST/PHARMACIST/PATIENT.
- Implement core screens and consistent interaction patterns (form validation,
  loading/error/empty states, status labels, smart back navigation).
- Wire frontend service layers with mock/stub APIs to validate full user journeys
  before backend completion.
- Add unit tests for every frontend component/module introduced in this phase.
- Exit criteria:
  - End-to-end role journeys are clickable/testable on desktop, tablet, mobile.
  - UX consistency gate passes with shared component behavior.

### Priority 2: Database Next (Schema and Data Reliability)

- Implement PostgreSQL schema/migrations for all core entities from data model.
- Enforce indexes, unique constraints, and transactional conflict prevention rules.
- Implement backup/recovery jobs and audit-log immutability strategy.
- Add unit tests for database access wrappers, repositories, and migration helpers.
- Exit criteria:
  - Migration and rollback scripts are validated.
  - Seed data supports all role journeys.
  - Backup/restore drill meets RTO/RPO target assumptions.

### Priority 3: Backend Then (Business Logic and Integration)

- Implement modular services/controllers to satisfy contract endpoints.
- Replace frontend mocks with real APIs incrementally by user story priority.
- Complete RBAC enforcement, queue workers, and observability integration.
- Add unit tests for every backend service, guard, queue processor, and controller helper.
- Exit criteria:
  - Contract/API/integration suites pass.
  - Frontend-to-backend flows are fully integrated for P1 -> P2 -> P3 stories.

## Multi-OS Deployment Strategy

### Supported Operating Systems

- Android: supported as a primary mobile client target.
- iOS: supported as a primary mobile client target.
- Windows: supported as a primary desktop client target and local development platform.
- Linux: supported for server-side runtime, CI, and backend/database workloads.
- macOS: supported for development and CI when packaging desktop/mobile assets.

### Deployment Approach by Layer

- Frontend (Next.js): browser delivery for Android, iOS, and Windows clients;
  optional Electron packaging for Windows desktop distribution.
- Backend (NestJS): containerized deploy (Linux), horizontal scaling via orchestrator.
- Database:
  - Early phase uses only SQLite or free-tier PostgreSQL.
  - SQLite is allowed for offline/local prototyping when a network database is not needed.
  - Managed PostgreSQL remains the production target once the project has budget.
- Desktop App (Electron, optional): CI builds for Windows/macOS/Linux artifacts.

### Unit Test Framework Policy

- TypeScript modules (frontend/backend): use Jest for all unit tests.
- Native/C++ modules, if added later for desktop/helper functionality: use Google Test.
- Every module introduced in this project must have unit test coverage in the framework
  appropriate to its implementation language.

### Free Database Strategy

Recommended zero-budget path for the current phase:

1. Local learning branch
  - Use SQLite for rapid iteration and offline development.
  - Suitable for frontend-first work and simple CRUD validation.
2. Shared free cloud database
  - Use a free PostgreSQL tier for team/shared development and demo environments.
  - Candidates: Neon free tier or Supabase free tier, subject to current limits.
3. Production later
  - Move to paid managed PostgreSQL only when data volume, uptime, or backup needs exceed
    free-tier constraints.

### Upgrade-Readiness Rules

- Model entities in a database-agnostic way in the service layer so switching from SQLite
  to PostgreSQL changes configuration and migrations, not business workflows.
- Avoid SQLite-specific SQL features in application code.
- Use TypeORM migrations and repository abstractions from the beginning so schema changes
  remain portable.
- Keep datetime, enum, and relation handling aligned with PostgreSQL behavior to reduce
  production migration surprises.

### Free-Tier Constraints

- Free databases may sleep, rate-limit, or cap storage/compute.
- Free tiers are suitable for learning, demos, and small-scale testing, not reliable
  high-availability production.
- Backup retention and point-in-time recovery are limited or unavailable on some free plans.
- Because of those limits, the codebase must stay portable so the eventual production
  upgrade is a deployment/migration step rather than a rewrite.

### Cross-Platform Delivery Requirements

- CI pipeline must run lint/test/build on Windows and Linux at minimum; macOS build
  is required when Electron packaging is enabled.
- Runtime config must be environment-driven (no OS-specific hardcoded paths).
- Database migration tooling must run reproducibly across Windows/macOS/Linux dev machines.

## Database Deployment Cost Estimate (Detailed)

All values are estimated in USD/month and should be validated with current cloud pricing
before procurement. Estimates focus on PostgreSQL primary workloads.

### Option A: Managed PostgreSQL (Recommended for Production)

| Environment | Instance/Capacity (example) | Est. Compute+Storage | Backup/PITR | Network/Egress | Total Est./Month |
|-------------|------------------------------|----------------------|-------------|----------------|------------------|
| Dev         | 1 vCPU, 1-2 GB RAM, 20-30 GB | 25-45                | 5-10        | 2-5            | 32-60            |
| Staging     | 2 vCPU, 4 GB RAM, 50 GB      | 70-120               | 15-25       | 5-15           | 90-160           |
| Prod        | 4 vCPU, 8-16 GB RAM, 150 GB  | 220-420              | 40-80       | 20-70          | 280-570          |

### Option B: Self-Managed PostgreSQL on VM

| Environment | VM + Disk (example)          | Ops/Monitoring Tooling | Backup Storage | Total Est./Month |
|-------------|------------------------------|------------------------|----------------|------------------|
| Dev         | 15-35                        | 5-15                   | 5-10           | 25-60            |
| Staging     | 45-90                        | 15-30                  | 10-20          | 70-140           |
| Prod        | 140-280                      | 40-90                  | 30-70          | 210-440          |

### Cost Notes and Planning Assumptions

- Managed DB has higher direct infra cost but lower operational risk/time.
- Self-managed can look cheaper at low scale but requires more engineering effort
  for patching, failover, and recovery validation.
- Free-tier database options can reduce cost to near-zero for development and demo usage,
  but they trade away uptime, storage, and recovery guarantees.
- The database layer should stay portable from day one so the production upgrade is
  mostly a move from free tier to managed PostgreSQL, not a redesign.
- Production estimates exclude major incident/DR drills and team labor cost.
- Recommended budgeting baseline for current scope:
  - Development + Staging + Production managed setup: ~402 to 790 USD/month.
  - Add 10-20% contingency for data growth and egress variability.

### Zero-Budget Planning Baseline

- Current learning phase target: 0 USD/month database cost by using SQLite locally
  or a free PostgreSQL tier.
- Acceptable compromise: 0-10 USD/month for incidental support services if a free tier
  requires a minimal add-on.
- When moving beyond free tier, upgrade only the database layer first; do not scale
  other infrastructure prematurely.
- Keep the schema and repository layer compatible with PostgreSQL during the free phase
  so the upgrade is configuration plus migration, not a rewrite.

## Phase Deliverables

### Phase 0: Research

- Completed: /specs/001-clinic-management-spec/research.md
- Outcome: architecture, conflict prevention, compliance model, test strategy,
  UX consistency approach, and performance baseline confirmed.

### Phase 1: Design & Contracts

- Completed: /specs/001-clinic-management-spec/data-model.md
- Completed: /specs/001-clinic-management-spec/contracts/openapi.yaml
- Completed: /specs/001-clinic-management-spec/quickstart.md

### Phase 2: Task Planning Readiness

- Ready for /speckit.tasks generation with no unresolved clarifications.
- Tasks must include unit-test work for every module, not only selected hotspots.

## Complexity Tracking

No constitution violations identified. No complexity exceptions required.
