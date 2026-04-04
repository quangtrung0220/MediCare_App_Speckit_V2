<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
	- Template Principle 1 -> I. Code Quality Is a Release Gate
	- Template Principle 2 -> II. Test Coverage Is Mandatory
	- Template Principle 3 -> III. User Experience Must Be Consistent Across Roles
	- Template Principle 4 -> IV. Performance Budgets Are Enforced
	- Template Principle 5 -> V. Security, Auditability, and Data Protection by Default
- Added sections:
	- Engineering Standards
	- Delivery Workflow & Quality Gates
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ⚠ pending: .specify/templates/commands/*.md (directory not present in repository)
	- ⚠ pending: runtime guidance docs (README.md, docs/quickstart.md not present)
- Deferred TODOs:
	- None
-->

# MediCare App Constitution

## Core Principles

### I. Code Quality Is a Release Gate
All production code MUST pass static analysis, formatting, and peer review before merge.
Every pull request MUST include clear intent, risk notes, and changed-file rationale.
Complexity-increasing changes MUST include justification and a simpler alternative that
was considered and rejected. Rationale: healthcare workflows require predictable,
maintainable behavior and safe long-term evolution.

### II. Test Coverage Is Mandatory
Every functional change MUST include automated tests at the appropriate level:
unit tests for domain logic, integration tests for module boundaries, and contract/API
tests for external interfaces. Bug fixes MUST ship with a regression test that fails
before the fix and passes after. Merging is blocked when required tests fail in CI.
Rationale: clinical and billing flows demand repeatable correctness under change.

### III. User Experience Must Be Consistent Across Roles
All user-facing changes MUST preserve role-aware navigation consistency across ADMIN,
DOCTOR, NURSE, RECEPTIONIST, PHARMACIST, and PATIENT journeys. Shared interactions
(forms, validation, status, loading, errors, and back navigation) MUST follow one
design language on desktop and mobile. Any intentional deviation MUST be documented
in the specification with accessibility and usability impact. Rationale: consistent UX
reduces training overhead and operational mistakes in high-pressure environments.

### IV. Performance Budgets Are Enforced
Features MUST define measurable performance targets in the spec and verify them before
release. As default budgets unless overridden by approved feature constraints:
- API read operations MUST meet p95 <= 300 ms under expected load.
- API write operations MUST meet p95 <= 500 ms under expected load.
- Critical UI routes MUST reach interactive state within 2 seconds on baseline hardware.
- Scheduled/background workflows MUST publish completion or failure telemetry.
Rationale: appointment, billing, and record workflows are time-sensitive and degrade
care quality when latency is uncontrolled.

### V. Security, Auditability, and Data Protection by Default
All data flows MUST enforce least-privilege RBAC and preserve immutable audit trails
for sensitive access and mutation events. Personal and medical data MUST be protected
in transit and at rest, and recovery controls MUST satisfy documented backup and restore
objectives. Rationale: project goals explicitly target healthcare-grade trust and
compliance readiness.

## Engineering Standards

- Specifications MUST include functional requirements, measurable success criteria,
	explicit assumptions, UX consistency notes, and performance budgets.
- Plans MUST document quality gates tied to this constitution before implementation.
- Tasks MUST include concrete work for tests, UX consistency validation, and performance
	verification for each user story.
- Done criteria for any story MUST include passing tests, documented UX acceptance,
	and evidence that performance budgets were validated.

## Delivery Workflow & Quality Gates

1. Specification Gate: feature spec approved with test strategy, UX impact, and
	 performance targets.
2. Planning Gate: implementation plan passes Constitution Check with no unresolved
	 mandatory gate.
3. Build Gate: lint/format/type checks and required test suites pass in CI.
4. Experience Gate: role-based UX flows validated for consistency and accessibility.
5. Performance Gate: performance evidence recorded in PR notes or attached reports.

No gate may be bypassed without documented exception approved by project maintainers.

## Governance

This constitution is the highest-priority engineering policy for this repository.
Amendments require: (1) a pull request describing the change and rationale,
(2) explicit impact notes for templates and workflow, and (3) approval from project
maintainers. Versioning policy follows semantic versioning for governance:

- MAJOR: removal or incompatible redefinition of a principle or enforcement rule.
- MINOR: addition of a new principle/section or materially expanded guidance.
- PATCH: clarifications, wording improvements, and non-semantic refinements.

Compliance review is REQUIRED in every feature plan and pull request. Reviewers MUST
verify evidence for code quality, testing, UX consistency, and performance requirements.

**Version**: 1.0.0 | **Ratified**: 2026-04-04 | **Last Amended**: 2026-04-04
