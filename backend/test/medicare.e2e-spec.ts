import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Repository, DataSource } from 'typeorm';
import { Doctor } from '../src/models/doctor.entity';
import { Patient } from '../src/models/patient.entity';
import { User } from '../src/models/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('MediCare End-to-End API integration', () => {
  let app: INestApplication<App>;
  let doctorId: string;
  let patientId: string;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Reset database schema cleanly for E2E isolation
    const dataSource = app.get(DataSource);
    await dataSource.synchronize(true);

    const doctorRepo = dataSource.getRepository(Doctor);
    const patientRepo = dataSource.getRepository(Patient);
    const userRepo = dataSource.getRepository(User);

    // Register active Admin user for JWT guard bypass
    const adminUser = await userRepo.save({
      id: 'USR-ADMIN-E2E',
      email: 'admin@medicare.com',
      passwordHash: '$2a$10$dummyhashvalforpasswordsinvalidation',
      role: 'ADMIN',
      isActive: true,
      isPendingApproval: false,
    });

    const jwtService = app.get(JwtService);
    token = jwtService.sign({
      sub: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    });

    const doctor = await doctorRepo.save({
      firstName: 'Minh',
      lastName: 'Nguyễn',
      specialization: 'Nội khoa',
      licenseNumber: 'LIC-001',
      consultationFee: 200000,
      isAvailable: true,
    });

    const patient = await patientRepo.save({
      firstName: 'An',
      lastName: 'Nguyễn Văn',
      dateOfBirth: '1990-05-15',
      gender: 'M',
      phone: '+84901111111',
    });

    doctorId = doctor.id;
    patientId = patient.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Patients Endpoint (/patients)', () => {
    let createdPatientId: string;

    it('POST /patients - should create a new patient record', async () => {
      const response = await request(app.getHttpServer())
        .post('/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Văn B',
          lastName: 'Nguyễn',
          dateOfBirth: '1995-02-12',
          gender: 'M',
          phone: '+84909876543',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.firstName).toBe('Văn B');
      createdPatientId = response.body.id;
    });

    it('GET /patients - should return a list of patients containing the created patient', async () => {
      const response = await request(app.getHttpServer())
        .get('/patients')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBeGreaterThanOrEqual(1);

      const found = response.body.data.find((p: any) => p.id === createdPatientId);
      expect(found).toBeDefined();
    });

    it('GET /patients/:id - should retrieve a specific patient', async () => {
      const response = await request(app.getHttpServer())
        .get(`/patients/${createdPatientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.firstName).toBe('Văn B');
    });

    it('DELETE /patients/:id - should soft-delete the patient and reject subsequent GETs with 404', async () => {
      await request(app.getHttpServer())
        .delete(`/patients/${createdPatientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/patients/${createdPatientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('PATCH /patients/:id/restore - should restore the patient and allow GETs again', async () => {
      await request(app.getHttpServer())
        .patch(`/patients/${createdPatientId}/restore`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/patients/${createdPatientId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('Appointments Endpoint (/appointments)', () => {
    it('POST /appointments - should book a slot successfully', async () => {
      const randomDay = String(Math.floor(Math.random() * 25) + 1).padStart(2, '0');
      const response = await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          doctorId,
          patientId,
          appointmentDate: `2026-08-${randomDay}`,
          appointmentTime: '09:00',
          durationMinutes: 30,
          status: 'SCHEDULED',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('SCHEDULED');
    });

    it('POST /appointments - booking same doctor at same time should trigger conflict', async () => {
      const randomDay = String(Math.floor(Math.random() * 25) + 1).padStart(2, '0');
      const appointmentDate = `2026-09-${randomDay}`;
      // First booking
      await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          doctorId,
          patientId,
          appointmentDate,
          appointmentTime: '10:00',
          status: 'SCHEDULED',
        })
        .expect(201);

      // Conflicting booking
      await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          doctorId,
          patientId,
          appointmentDate,
          appointmentTime: '10:00',
          status: 'SCHEDULED',
        })
        .expect(409);
    });
  });

  describe('Admin Backup & Restore Endpoint (/admin)', () => {
    it('GET /admin/backup - should download a sqlite backup file or return 400 if in-memory', async () => {
      const response = await request(app.getHttpServer())
        .get('/admin/backup')
        .set('Authorization', `Bearer ${token}`);

      const options = app.get(DataSource).options as any;
      if (options.database === ':memory:') {
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('bộ nhớ');
      } else {
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/x-sqlite3');
        expect(response.headers['content-disposition']).toContain('attachment; filename=');
      }
    });

    it('POST /admin/restore - should upload and restore sqlite database file or return 400 if in-memory', async () => {
      const response = await request(app.getHttpServer())
        .post('/admin/restore')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('fake-db-content'), 'medicare_test.sqlite');

      const options = app.get(DataSource).options as any;
      if (options.database === ':memory:') {
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('bộ nhớ');
      } else {
        expect(response.status).toBe(201);
        expect(response.body.message).toContain('thành công');
      }
    });
  });
});
