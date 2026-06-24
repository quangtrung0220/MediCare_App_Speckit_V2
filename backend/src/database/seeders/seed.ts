/*
 * Created: 2026-06-24
 * Purpose: Database seed script for roles, doctors, schedules, patients, and inventory (T024).
 * Owner: Quang Trung
 */
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from '../data-source';
import { User } from '../../models/user.entity';
import { Patient } from '../../models/patient.entity';
import { Doctor } from '../../models/doctor.entity';
import { DoctorSchedule } from '../../models/doctor-schedule.entity';
import { InventoryItem } from '../../models/inventory-item.entity';

async function seed() {
  const ds = new DataSource({
    ...buildDataSourceOptions(),
    synchronize: true, // Auto-create tables for seeding
  });

  await ds.initialize();
  console.log('📦 Database connected for seeding...');

  const userRepo = ds.getRepository(User);
  const patientRepo = ds.getRepository(Patient);
  const doctorRepo = ds.getRepository(Doctor);
  const scheduleRepo = ds.getRepository(DoctorSchedule);
  const inventoryRepo = ds.getRepository(InventoryItem);

  // --- Users ---
  const users = await userRepo.save([
    { email: 'admin@medicare.vn', passwordHash: '$placeholder_hash', role: 'ADMIN' as const, isActive: true },
    { email: 'doctor.minh@medicare.vn', passwordHash: '$placeholder_hash', role: 'DOCTOR' as const, isActive: true },
    { email: 'doctor.huong@medicare.vn', passwordHash: '$placeholder_hash', role: 'DOCTOR' as const, isActive: true },
    { email: 'nurse.mai@medicare.vn', passwordHash: '$placeholder_hash', role: 'NURSE' as const, isActive: true },
    { email: 'receptionist.hoa@medicare.vn', passwordHash: '$placeholder_hash', role: 'RECEPTIONIST' as const, isActive: true },
    { email: 'pharmacist.tuan@medicare.vn', passwordHash: '$placeholder_hash', role: 'PHARMACIST' as const, isActive: true },
    { email: 'patient.an@medicare.vn', passwordHash: '$placeholder_hash', role: 'PATIENT' as const, isActive: true },
    { email: 'patient.binh@medicare.vn', passwordHash: '$placeholder_hash', role: 'PATIENT' as const, isActive: true },
  ]);
  console.log(`✅ Seeded ${users.length} users`);

  // --- Doctors ---
  const doctorUser1 = users.find(u => u.email === 'doctor.minh@medicare.vn')!;
  const doctorUser2 = users.find(u => u.email === 'doctor.huong@medicare.vn')!;

  const doctors = await doctorRepo.save([
    { userId: doctorUser1.id, firstName: 'Minh', lastName: 'Nguyễn', specialization: 'Nội khoa', licenseNumber: 'LIC-001', consultationFee: 200000, isAvailable: true },
    { userId: doctorUser2.id, firstName: 'Hương', lastName: 'Trần', specialization: 'Nhi khoa', licenseNumber: 'LIC-002', consultationFee: 250000, isAvailable: true },
  ]);
  console.log(`✅ Seeded ${doctors.length} doctors`);

  // --- Doctor Schedules ---
  const schedules = await scheduleRepo.save([
    // Doctor 1: Mon-Fri, 08:00-12:00, 13:00-17:00
    { doctorId: doctors[0].id, dayOfWeek: 1, startTime: '08:00', endTime: '12:00', durationMinutes: 30, isActive: true },
    { doctorId: doctors[0].id, dayOfWeek: 1, startTime: '13:00', endTime: '17:00', durationMinutes: 30, isActive: true },
    { doctorId: doctors[0].id, dayOfWeek: 2, startTime: '08:00', endTime: '12:00', durationMinutes: 30, isActive: true },
    { doctorId: doctors[0].id, dayOfWeek: 3, startTime: '08:00', endTime: '17:00', durationMinutes: 30, isActive: true },
    { doctorId: doctors[0].id, dayOfWeek: 4, startTime: '08:00', endTime: '12:00', durationMinutes: 30, isActive: true },
    { doctorId: doctors[0].id, dayOfWeek: 5, startTime: '08:00', endTime: '17:00', durationMinutes: 30, isActive: true },
    // Doctor 2: Tue-Sat, 09:00-16:00
    { doctorId: doctors[1].id, dayOfWeek: 2, startTime: '09:00', endTime: '16:00', durationMinutes: 30, isActive: true },
    { doctorId: doctors[1].id, dayOfWeek: 3, startTime: '09:00', endTime: '16:00', durationMinutes: 30, isActive: true },
    { doctorId: doctors[1].id, dayOfWeek: 4, startTime: '09:00', endTime: '16:00', durationMinutes: 30, isActive: true },
    { doctorId: doctors[1].id, dayOfWeek: 5, startTime: '09:00', endTime: '16:00', durationMinutes: 30, isActive: true },
    { doctorId: doctors[1].id, dayOfWeek: 6, startTime: '09:00', endTime: '14:00', durationMinutes: 30, isActive: true },
  ]);
  console.log(`✅ Seeded ${schedules.length} doctor schedules`);

  // --- Patients ---
  const patientUser1 = users.find(u => u.email === 'patient.an@medicare.vn')!;
  const patientUser2 = users.find(u => u.email === 'patient.binh@medicare.vn')!;

  const patients = await patientRepo.save([
    { userId: patientUser1.id, firstName: 'An', lastName: 'Nguyễn Văn', dateOfBirth: '1990-05-15', gender: 'M', phone: '+84901111111', address: 'Hà Nội', bloodType: 'A+' },
    { userId: patientUser2.id, firstName: 'Bình', lastName: 'Trần Thị', dateOfBirth: '1985-12-20', gender: 'F', phone: '+84902222222', address: 'Hồ Chí Minh', bloodType: 'O+' },
    { userId: null, firstName: 'Cường', lastName: 'Phạm', dateOfBirth: '2000-03-10', gender: 'M', phone: '+84903333333', address: 'Đà Nẵng' },
  ]);
  console.log(`✅ Seeded ${patients.length} patients`);

  // --- Inventory ---
  const inventory = await inventoryRepo.save([
    { name: 'Paracetamol 500mg', code: 'MED-001', category: 'PAIN', quantity: 500, unit: 'tablet', minQuantity: 100, maxQuantity: 2000, unitPrice: 2000 },
    { name: 'Amoxicillin 500mg', code: 'MED-002', category: 'ANTIBIOTIC', quantity: 300, unit: 'capsule', minQuantity: 50, maxQuantity: 1000, unitPrice: 5000 },
    { name: 'Vitamin C 1000mg', code: 'MED-003', category: 'VITAMIN', quantity: 1000, unit: 'tablet', minQuantity: 200, maxQuantity: 5000, unitPrice: 3000 },
    { name: 'Bandage Roll 10cm', code: 'SUP-001', category: 'SUPPLY', quantity: 200, unit: 'roll', minQuantity: 50, maxQuantity: 500, unitPrice: 15000 },
    { name: 'Surgical Gloves (M)', code: 'SUP-002', category: 'SUPPLY', quantity: 500, unit: 'pair', minQuantity: 100, maxQuantity: 2000, unitPrice: 8000 },
  ]);
  console.log(`✅ Seeded ${inventory.length} inventory items`);

  await ds.destroy();
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
