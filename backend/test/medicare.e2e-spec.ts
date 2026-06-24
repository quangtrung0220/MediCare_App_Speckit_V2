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

    // Fetch existing doctor and patient from seeded DB via DataSource
    const dataSource = app.get(DataSource);
    const doctorRepo = dataSource.getRepository(Doctor);
    const patientRepo = dataSource.getRepository(Patient);

    const doctor = await doctorRepo.findOneOrFail({ where: {} });
    const patient = await patientRepo.findOneOrFail({ where: {} });

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
  });

  describe('Appointments Endpoint (/appointments)', () => {
    it('POST /appointments - should book a slot successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/appointments')
        .send({
          doctorId,
          patientId,
          appointmentDate: '2026-07-01',
          appointmentTime: '09:00',
          durationMinutes: 30,
          status: 'SCHEDULED',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('SCHEDULED');
    });

    it('POST /appointments - booking same doctor at same time should trigger conflict', async () => {
      // First booking
      await request(app.getHttpServer())
        .post('/appointments')
        .send({
          doctorId,
          patientId,
          appointmentDate: '2026-07-02',
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
          appointmentDate: '2026-07-02',
          appointmentTime: '10:00',
          status: 'SCHEDULED',
        })
        .expect(409);
    });
  });
});
