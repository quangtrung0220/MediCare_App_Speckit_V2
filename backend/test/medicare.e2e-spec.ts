import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Repository, DataSource } from 'typeorm';
import { Doctor } from '../src/models/doctor.entity';
import { Patient } from '../src/models/patient.entity';

describe('MediCare End-to-End API integration', () => {
  let app: INestApplication<App>;
  let doctorId: string;
  let patientId: string;

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
        .expect(200);

      expect(response.body.firstName).toBe('Văn B');
    });

    it('DELETE /patients/:id - should soft-delete the patient and reject subsequent GETs with 404', async () => {
      await request(app.getHttpServer())
        .delete(`/patients/${createdPatientId}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/patients/${createdPatientId}`)
        .expect(404);
    });

    it('PATCH /patients/:id/restore - should restore the patient and allow GETs again', async () => {
      await request(app.getHttpServer())
        .patch(`/patients/${createdPatientId}/restore`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/patients/${createdPatientId}`)
        .expect(200);
    });
  });

  describe('Appointments Endpoint (/appointments)', () => {
    it('POST /appointments - should book a slot successfully', async () => {
      const randomDay = String(Math.floor(Math.random() * 25) + 1).padStart(2, '0');
      const response = await request(app.getHttpServer())
        .post('/appointments')
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
});
