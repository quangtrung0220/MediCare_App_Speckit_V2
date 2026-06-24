import { Test } from '@nestjs/testing';
import { AppointmentController } from '../controllers/appointment.controller';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/appointment.entity';
import { APPOINTMENT_REPOSITORY } from '../services/contracts';
import { AppointmentRepository } from '../services/repositories/appointment.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository } from '../../test/utils/test-helpers';
import { ConflictException } from '@nestjs/common';

describe('Appointment System Unit Tests', () => {
  describe('AppointmentService & AppointmentController', () => {
    let controller: AppointmentController;
    let service: AppointmentService;
    let mockRepo: any;

    beforeEach(async () => {
      mockRepo = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findByPatientId: jest.fn(),
        findByDoctorId: jest.fn(),
        findConflicting: jest.fn(),
        count: jest.fn(),
      };

      const module = await Test.createTestingModule({
        controllers: [AppointmentController],
        providers: [
          AppointmentService,
          { provide: APPOINTMENT_REPOSITORY, useValue: mockRepo },
        ],
      }).compile();

      controller = module.get<AppointmentController>(AppointmentController);
      service = module.get<AppointmentService>(AppointmentService);
    });

    it('should create appointment when no conflict exists', async () => {
      const aptData = { doctorId: 'DOC-1', appointmentDate: '2026-06-25', appointmentTime: '10:00' };
      const createdApt = { id: 'APT-1', ...aptData, status: 'SCHEDULED' } as Appointment;
      
      mockRepo.findConflicting.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(createdApt);

      const result = await controller.create(aptData);
      expect(result).toEqual(createdApt);
      expect(mockRepo.findConflicting).toHaveBeenCalledWith('DOC-1', '2026-06-25', '10:00', 30);
    });

    it('should throw ConflictException on conflicting booking time', async () => {
      const aptData = { doctorId: 'DOC-1', appointmentDate: '2026-06-25', appointmentTime: '10:00' };
      mockRepo.findConflicting.mockResolvedValue({ id: 'APT-EXISTS' } as Appointment);

      await expect(controller.create(aptData)).rejects.toThrow(ConflictException);
    });

    it('should transition scheduled appointment to cancelled', async () => {
      const mockApt = { id: 'APT-1', status: 'SCHEDULED' } as Appointment;
      mockRepo.findById.mockResolvedValue(mockApt);
      mockRepo.update.mockResolvedValue({ ...mockApt, status: 'CANCELLED' });

      const result = await controller.cancel('APT-1');
      expect(result.status).toBe('CANCELLED');
    });

    it('should transition scheduled appointment to completed', async () => {
      const mockApt = { id: 'APT-1', status: 'SCHEDULED' } as Appointment;
      mockRepo.findById.mockResolvedValue(mockApt);
      mockRepo.update.mockResolvedValue({ ...mockApt, status: 'COMPLETED' });

      const result = await controller.complete('APT-1');
      expect(result.status).toBe('COMPLETED');
    });
  });

  describe('AppointmentRepository', () => {
    let repository: AppointmentRepository;
    let mockTypeOrmRepo: any;

    beforeEach(async () => {
      mockTypeOrmRepo = createMockRepository();
      const module = await Test.createTestingModule({
        providers: [
          AppointmentRepository,
          {
            provide: getRepositoryToken(Appointment),
            useValue: mockTypeOrmRepo,
          },
        ],
      }).compile();

      repository = module.get<AppointmentRepository>(AppointmentRepository);
    });

    it('should call findOne with conflict filters', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);
      await repository.findConflicting('DOC-1', '2026-06-25', '10:00', 30);
      expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({
        where: {
          doctorId: 'DOC-1',
          appointmentDate: '2026-06-25',
          appointmentTime: '10:00',
          status: 'SCHEDULED',
        },
      });
    });
  });
});
