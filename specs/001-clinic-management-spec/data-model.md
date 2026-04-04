# Data Model: MediCare End-to-End Clinic Management

## Entity: User
- Purpose: Identity and access principal for all authenticated actors.
- Key fields: id, email, passwordHash, role, isActive, isPendingApproval, lastLoginAt, createdAt, updatedAt.
- Validation:
  - email unique and valid format
  - password policy enforced
  - role in approved role set
- Relationships:
  - 1:1 with Patient/Doctor/Staff profile depending on role
  - 1:N with AuditLog entries

## Entity: Patient
- Purpose: Clinical subject and billing recipient.
- Key fields: id, userId, firstName, lastName, dateOfBirth, gender, phone, address, bloodType, allergies, emergency contact, insuranceNumber.
- Validation:
  - phone format constraints
  - required demographic and emergency fields
- Relationships:
  - 1:N Appointment
  - 1:N MedicalRecord
  - 1:N Payment

## Entity: Doctor
- Purpose: Clinician profile used in scheduling and care delivery.
- Key fields: id, userId, specialization, licenseNumber, consultationFee, isAvailable.
- Validation:
  - licenseNumber unique
  - consultationFee >= 0
- Relationships:
  - 1:N Appointment
  - 1:N MedicalRecord
  - 1:N DoctorSchedule

## Entity: DoctorSchedule
- Purpose: Defines available booking windows per doctor.
- Key fields: id, doctorId, dayOfWeek, startTime, endTime, durationMinutes, isActive.
- Validation:
  - startTime < endTime
  - durationMinutes > 0
- Relationships:
  - N:1 Doctor

## Entity: Appointment
- Purpose: Reservable clinical encounter slot.
- Key fields: id, patientId, doctorId, appointmentDate, appointmentTime, durationMinutes, type, status, notes, reminderSent, reminderSentAt, cancelledAt.
- Validation:
  - must be future timestamp by minimum lead time
  - conflict check must pass before create/reschedule
- State transitions:
  - SCHEDULED -> COMPLETED
  - SCHEDULED -> CANCELLED
  - SCHEDULED -> NO_SHOW
- Relationships:
  - N:1 Patient
  - N:1 Doctor
  - 0..1:1 MedicalRecord
  - 0..1:1 Payment

## Entity: MedicalRecord
- Purpose: Versioned clinical documentation for a visit.
- Key fields: id, patientId, doctorId, appointmentId, visitDate, symptoms, diagnosis, treatment, vitalSigns, notes, followUpDate, attachments, isConfidential, version, previousVersion.
- Validation:
  - patient/doctor required
  - version monotonic per record lineage
- Relationships:
  - N:1 Patient
  - N:1 Doctor
  - 1:N Prescription
  - 1:N AuditLog (access/change events)

## Entity: Prescription
- Purpose: Medication order generated from clinical care.
- Key fields: id, medicalRecordId, prescribedDate, status, instructions, refillable, refillsRemaining, expiryDate.
- Validation:
  - expiryDate after prescribedDate
  - refillsRemaining >= 0
- State transitions:
  - PENDING -> DISPENSED
  - DISPENSED -> COMPLETED
  - PENDING -> CANCELLED
- Relationships:
  - N:1 MedicalRecord
  - 1:N PrescriptionItem

## Entity: PrescriptionItem
- Purpose: Line item for medication and dosage.
- Key fields: id, prescriptionId, inventoryItemId, quantity, unit, dosage, frequency, duration, notes.
- Validation:
  - quantity > 0
  - inventory reference exists and active
- Relationships:
  - N:1 Prescription
  - N:1 InventoryItem

## Entity: InventoryItem
- Purpose: Managed stock unit for medicine/supplies.
- Key fields: id, name, code, category, quantity, unit, minQuantity, maxQuantity, unitPrice, supplier, batchNumber, expiryDate, manufacturingDate, isActive.
- Validation:
  - code unique
  - quantity >= 0
  - minQuantity <= maxQuantity
- Relationships:
  - 1:N PrescriptionItem

## Entity: Payment
- Purpose: Settlement and invoicing record.
- Key fields: id, patientId, appointmentId, amount, currency, paymentMethod, status, invoiceNumber, description, notes, completedAt.
- Validation:
  - amount > 0
  - invoiceNumber unique
- State transitions:
  - PENDING -> COMPLETED
  - PENDING -> FAILED
  - COMPLETED -> REFUNDED
- Relationships:
  - N:1 Patient
  - 0..1 N:1 Appointment

## Entity: Staff
- Purpose: Non-doctor clinic employee profile.
- Key fields: id, userId, firstName, lastName, position, phone, hireDate, isActive.
- Validation:
  - position in approved enum
- Relationships:
  - 1:1 User

## Entity: AuditLog
- Purpose: Immutable compliance event ledger.
- Key fields: id, userId, entity, entityId, action, changes, ipAddress, userAgent, timestamp, createdAt.
- Validation:
  - append-only write policy
  - timestamp generated server-side
- Relationships:
  - N:1 User

## Cross-Entity Invariants
- Appointment slot uniqueness by doctor + datetime window.
- Prescription dispensing cannot complete if required inventory is insufficient.
- Role constraints enforced before any sensitive read/write.
- Audit log entries generated for all sensitive CREATE/READ/UPDATE/DELETE/EXPORT actions.
- Personal data workflows (export/deletion request) are tracked without violating legal traceability.
