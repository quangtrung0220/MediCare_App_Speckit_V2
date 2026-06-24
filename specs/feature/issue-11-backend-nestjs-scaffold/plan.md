# Implementation Plan: MediCare E2E Screen UI/UX Design

**Branch**: `feature/issue-11-backend-nestjs-scaffold` | **Date**: 2026-06-24 | **Spec**: [spec.md](file:///f:/Study/Trung/SpecKit/MediCare_App%20new/specs/feature/issue-11-backend-nestjs-scaffold/spec.md)
**Input**: Feature specification from `/specs/feature/issue-11-backend-nestjs-scaffold/spec.md`

## Summary

This plan outlines the UI/UX architecture and layout specifications for all role-based dashboards (Patient, Doctor, Nurse, Receptionist, Pharmacist, Admin) in the MediCare Clinic Management System. The design uses Next.js 16.x + React 19.x with Vanilla CSS Modules to deliver responsive layout experiences across Android, iOS, and Windows browsers. The system utilizes client-side stores (like React State / Context / Zustand-like hooks) to manage workflow states, with dynamic mock/real API switches for local prototyping and production backend integration.

## Technical Context

- **Language/Version**: TypeScript 5.x (Frontend/Backend)
- **Primary Dependencies**: Next.js 16.x, React 19.x, Vanilla CSS Modules
- **Testing**: Jest 30.x, React Testing Library, Mock Router wrappers
- **Target Platform**: Desktop (Windows/Linux/macOS), Mobile (Android/iOS web browsers)
- **UX Goal**: Load dashboards in < 2 seconds, with consistent error, empty, validation, and loading animations across all screens.

## Constitution Check

- **Code Quality Gate: PASS**
  - Uses CSS Modules (`*.module.css`) to ensure stylesheet isolation.
  - Strict linting, Prettier format, and type checks are run before testing.
- **Test Strategy Gate: PASS**
  - Every UI module and dashboard page must have corresponding component tests in `test/components/` using React Testing Library.
- **UX Consistency Gate: PASS**
  - Defined consistent role-aware sidebar navigation and header workspaces.
  - Standardized form validation, loading spinner overlays, empty lists, and error toast alerts.
- **Performance Gate: PASS**
  - Page interactivity <= 2 seconds on baseline mobile devices.
  - Static generation used for shell frameworks where possible.
- **Security & Auditability Gate: PASS**
  - Client routing restricts access using role checks matching the authenticated user role.

---

## Screen Layout Specs by Role

### 1. Shared Layout: App Shell & Workspace Navigation
- **Location**: `frontend/src/components/layout/AppShell.tsx`, `SidebarNav.tsx`
- **Layout**:
  - **Sidebar (Desktop)**: Sidebar listing allowed modules based on user role (Admin, Doctor, Nurse, Receptionist, Pharmacist, Patient). Current route highlighted.
  - **Header**: Displays "Clinic Workspace", user profile avatar, active role label, and Logout button.
  - **Mobile Layout**: Sidebar collapses into a slide-over drawer triggered by a header burger icon.

---

### 2. Patient Portal
- **Dashboard / Book Appointment (`/book-appointment`)**:
  - *Step 1: Doctor Select*: Grid of available clinician cards with name, specialty, fee, availability badge.
  - *Step 2: Slot Picker*: Datepicker input with availability grid showing 30-minute intervals (e.g. 08:00, 08:30). Disabled states for booked slots.
  - *Step 3: Confirmation*: Summary card showing selected doctor, date, time, and patient consent warning.
  - *Step 4: Success Screen*: Success checkmark icon, booking reference ID, and appointment reminder status.
- **My Appointments (`/my-appointments`)**:
  - Table of historical and upcoming appointments showing Doctor, Date, Time, Fee, Status badge (Scheduled, Completed, Cancelled) and Reminder confirmation.

---

### 3. Doctor Portal
- **Patient Search & Intake Queue (`/doctor`)**:
  - Main landing listing checked-in patients for today. Includes search filter (name, phone) and patient list rows with vital check indicators.
- **Clinical Encounter Workspace (`/doctor/encounter/[id]`)**:
  - Split-screen workspace:
    - *Left Panel*: Patient demographic card, allergies checklist, and history of past encounters.
    - *Right Panel*: Interactive editor containing tabs for:
      - **Diagnosis & Symptoms**: Vital stats review, text areas for clinical notes and symptoms.
      - **Prescription Builder**: Real-time inventory search box, medication name, dosage frequency selectors, and a list of added items.
      - **Billing/Actions**: Final fee summaries, checkout buttons.

---

### 4. Nurse Portal
- **Intake Queue & Vitals Intake (`/nurse`)**:
  - List of scheduled appointments for today showing check-in time. Clicking patient opens a side-drawer or modal intake form:
    - Inputs: Systolic/Diastolic blood pressure, Heart rate, Body temperature (°C), Weight (kg), Respiratory rate.
    - Basic allergy note updates.

---

### 5. Receptionist Portal
- **Scheduler & Appointments Grid (`/receptionist`)**:
  - Master scheduler showing doctor grids side-by-side or a daily calendar view.
  - *Actions*: "Book Appointment" floating button opens patient lookup and scheduling wizard.
- **Check-in Desk (`/receptionist/check-in`)**:
  - Search by phone or code. Single-click check-in updates status to `CHECKED_IN`, alerting the nurse intake queue.

---

### 6. Pharmacist Portal
- **Prescription Dispensing Queue (`/pharmacist` or `/prescriptions`)**:
  - List of approved patient prescriptions in `PENDING` status.
  - Clicking item opens detail card showing patient, prescribing doctor, and list of medications.
  - Action buttons: "Dispense" (reduces inventory quantities) or "Hold".
- **Inventory Stock Manager (`/inventory`)**:
  - Grid of medicine stock levels showing name, code, quantity in stock, and critical low-stock warning banners (e.g., alert if quantity < minQuantity).

---

### 7. Admin & Auditor Portal
- **User Account Management (`/admin`)**:
  - Grid of system users, their login roles, approval status (pending, active), and creation dates.
- **Audit Log Viewer (`/audit`)**:
  - Read-only paginated table showing timestamp, actor email, action performed (e.g. READ_MEDICAL_RECORD), IP address, and browser agent string.

---

### 8. Billing & Payments Screen (`/billing`)
- **Location**: `frontend/app/billing/page.tsx`
- **Layout**:
  - Searchable list of patient encounter billing records.
  - Detail pane showing invoice receipt templates, total consulting fees, medication fees, and a dropdown selector for payment methods (Cash, Card, Insurance).
  - Status badges showing PAYMENT_PENDING, COMPLETED, or REFUNDED.

---

### 9. Operational Reports Dashboard (`/reports`)
- **Location**: `frontend/app/reports/page.tsx`
- **Layout**:
  - Grid of summary cards: Total appointments booked, checked-in patient count, total daily revenue, and low inventory items.
  - Export buttons to download CSV/PDF reports for specific date ranges.

---

### 10. Data Privacy & GDPR Settings (`/profile/privacy`)
- **Location**: `frontend/app/profile/privacy/page.tsx`
- **Layout**:
  - Settings page allowing authenticated users (Patients or Staff) to view their active personal data constraints.
  - Dual action prompts: "Request Data Export" (downloads a structured JSON package of patient demographic and health files) and "Request Profile Deletion" (files a request while maintaining medical history integrity).

---

## Project Structure (UI Focus)

```text
frontend/
├── app/
│   ├── book-appointment/      # Patient booking screen
│   ├── my-appointments/       # Patient appointments history
│   ├── doctor/                # Doctor dashboard & encounter editor
│   ├── nurse/                 # Nurse intake dashboard
│   ├── receptionist/          # Receptionist check-in & calendar
│   ├── pharmacist/            # Pharmacist dispensing queue
│   ├── inventory/             # Inventory stock levels
│   ├── billing/               # Billing and invoices queue
│   ├── reports/               # Operational reporting dashboard
│   ├── profile/
│   │   └── privacy/           # GDPR data privacy settings
│   ├── admin/                 # Admin user settings
│   ├── audit/                 # Auditor security logs
│   └── layout.tsx             # Root template loading AppShell
├── src/
│   ├── components/
│   │   ├── booking/           # UI cards, time grids
│   │   ├── layout/            # AppShell, SidebarNav
│   │   └── ui/                # Form fields, Buttons, Loading states
│   ├── services/              # API and mock handlers
│   └── stores/                # State management hooks
└── test/
    ├── components/            # Layout, UI components tests
    └── stores/                # State stores tests
```

## Verification Plan

### Automated Tests
- Run React Testing Library component tests in `frontend/test/components/`:
  `npm run test`
- Verify production bundles compile without TypeScript errors:
  `npm run build`

### Manual Verification
- Visual layout verification by loading pages inside local preview (`npm run dev`) and checking layouts on:
  - Windows browsers (Chrome, Edge)
  - Android web browsers (Chrome)
  - iOS web browsers (Safari)
