# Frontend Code Call Flow

## Scope
- Snapshot date: 2026-04-11
- Source scanned: frontend/app and frontend/src
- Goal: show which function in which file calls or depends on which file/function.

## Function Call Matrix

| File | Function / Export | Calls / Uses | Target File |
|---|---|---|---|
| app/layout.tsx | RootLayout | renders AppShell and route children | src/components/layout/AppShell.tsx |
| app/page.tsx | HomePage | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/admin/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/appointments/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/audit/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/book-appointment/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/doctor/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/inventory/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/medical-records/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/my-appointments/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/nurse/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/patient/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/patients/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/pharmacist/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/prescriptions/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/receptionist/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| app/reports/page.tsx | Page | renders RoutePlaceholder | src/components/layout/RoutePlaceholder.tsx |
| src/components/layout/AppShell.tsx | AppShell | uses useState; renders SidebarNav and children | src/components/layout/SidebarNav.tsx |
| src/components/layout/SidebarNav.tsx | SidebarNav | uses usePathname; maps NAV_ITEMS; renders Link list | next/navigation, next/link |
| src/components/layout/RoutePlaceholder.tsx | RoutePlaceholder | renders title + description block | internal only |
| src/components/ui/Button.tsx | Button | resolves variant styles and renders button | internal only |
| src/components/ui/Card.tsx | Card | renders section container | internal only |
| src/components/ui/Field.tsx | Field, TextInput | renders form field wrapper and input | internal only |
| src/components/ui/EmptyState.tsx | EmptyState | renders empty state block | internal only |
| src/components/ui/LoadingState.tsx | LoadingState | renders loading block | internal only |
| src/components/ui/ListRow.tsx | ListRow | renders list row block | internal only |
| src/components/ui/index.ts | barrel exports | re-exports UI components | src/components/ui/* |
| src/types/patient.ts | getPatientDisplayName | computes full display name | internal only |
| src/types/appointment.ts | type exports | shape declarations only | internal only |
| src/utils/roles.ts | constants exports | role keys and labels | internal only |
| src/utils/statuses.ts | constants exports | status constants and labels | internal only |

## Readability Notes
- Diagrams were split into smaller blocks to avoid tiny text and visual overload.
- Mermaid config below increases font size and node spacing.
- If still small in your editor, open Markdown preview and zoom browser/editor to 125% to 150%.

## Runtime Flow A: Boot and Shell

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontSize':'18px'},'flowchart':{'nodeSpacing':40,'rankSpacing':55,'curve':'basis'}}}%%
flowchart TD
        A[Next.js Runtime]
        B[app/layout.tsx: RootLayout]
        C[src/components/layout/AppShell.tsx: AppShell]
        D[src/components/layout/SidebarNav.tsx: SidebarNav]
        E[next/navigation: usePathname]
        F[next/link: Link]

        A --> B --> C --> D
        D --> E
        D --> F
```

## Runtime Flow B: Route Group Mapping

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontSize':'18px'},'flowchart':{'nodeSpacing':35,'rankSpacing':50,'curve':'basis'}}}%%
flowchart LR
        R[All app/*/page.tsx routes]
        G0[Home route<br/>app/page.tsx]
        G1[Role routes<br/>admin doctor nurse receptionist pharmacist patient]
        G2[Care routes<br/>appointments book-appointment my-appointments medical-records prescriptions]
        G3[Ops routes<br/>patients inventory reports audit]
        P[src/components/layout/RoutePlaceholder.tsx]

        R --> G0
        R --> G1
        R --> G2
        R --> G3

        G0 --> P
        G1 --> P
        G2 --> P
        G3 --> P
```

## Static Dependency Flow: Shared Modules

```mermaid
%%{init: {'theme':'base','themeVariables':{'fontSize':'18px'},'flowchart':{'nodeSpacing':40,'rankSpacing':55,'curve':'basis'}}}%%
flowchart TD
        subgraph UI Barrel
            U0[src/components/ui/index.ts]
            U1[Button.tsx]
            U2[Card.tsx]
            U3[Field.tsx]
            U4[EmptyState.tsx]
            U5[LoadingState.tsx]
            U6[ListRow.tsx]
            U0 --> U1
            U0 --> U2
            U0 --> U3
            U0 --> U4
            U0 --> U5
            U0 --> U6
        end

        subgraph Types
            T0[src/types/patient.ts]
            T1[getPatientDisplayName]
            T2[src/types/appointment.ts]
            T0 --> T1
            T2 --> T3[AppointmentSummary and AppointmentStatus]
        end

        subgraph Utils
            V0[src/utils/roles.ts]
            V1[ROLE_KEYS and ROLE_LABELS]
            V2[src/utils/statuses.ts]
            V3[APPOINTMENT_STATUSES PAYMENT_STATUSES STATUS_LABELS]
            V0 --> V1
            V2 --> V3
        end
```

## Notes
- Current route pages are scaffolds, so they all call the same RoutePlaceholder.
- Shared UI and type modules are prepared for next issues and are mostly not consumed by route pages yet.
- When Issue 3+ is implemented, this flow should be updated because pages will start calling service/store/form modules directly.
