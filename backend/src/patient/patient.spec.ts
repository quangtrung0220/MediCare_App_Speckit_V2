import { Test } from '@nestjs/testing';
import { PatientController } from '../controllers/patient.controller';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.entity';
import { PATIENT_REPOSITORY } from '../services/contracts';
import { PatientRepository } from '../services/repositories/patient.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository } from '../../test/utils/test-helpers';

describe('Patient System Unit Tests', () => {
  describe('PatientService & PatientController', () => {
    let controller: PatientController;
    let service: PatientService;
    let mockRepo: any;

    beforeEach(async () => {
      mockRepo = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        search: jest.fn(),
        count: jest.fn(),
      };

      const module = await Test.createTestingModule({
        controllers: [PatientController],
        providers: [
          PatientService,
          { provide: PATIENT_REPOSITORY, useValue: mockRepo },
        ],
      }).compile();

      controller = module.get<PatientController>(PatientController);
      service = module.get<PatientService>(PatientService);
    });

    it('should retrieve patients list', async () => {
      const mockPatient = { id: 'PAT-1', firstName: 'Trung' } as Patient;
      mockRepo.findAll.mockResolvedValue([mockPatient]);
      mockRepo.count.mockResolvedValue(1);

      const result = await controller.findAll();
      expect(result.data).toEqual([mockPatient]);
      expect(result.total).toBe(1);
    });

    it('should find patient by ID', async () => {
      const mockPatient = { id: 'PAT-1', firstName: 'Trung' } as Patient;
      mockRepo.findById.mockResolvedValue(mockPatient);

      const result = await controller.findById('PAT-1');
      expect(result).toEqual(mockPatient);
    });

    it('should search patients', async () => {
      const mockPatient = { id: 'PAT-1', firstName: 'Trung' } as Patient;
      mockRepo.search.mockResolvedValue([mockPatient]);

      const result = await controller.search('Trung');
      expect(result).toEqual([mockPatient]);
    });

    it('should create patient', async () => {
      const mockPatient = { id: 'PAT-1', firstName: 'Trung' } as Patient;
      mockRepo.create.mockResolvedValue(mockPatient);

      const result = await controller.create({ firstName: 'Trung' });
      expect(result).toEqual(mockPatient);
    });
  });

  describe('PatientRepository', () => {
    let repository: PatientRepository;
    let mockTypeOrmRepo: any;

    beforeEach(async () => {
      mockTypeOrmRepo = createMockRepository();
      const module = await Test.createTestingModule({
        providers: [
          PatientRepository,
          {
            provide: getRepositoryToken(Patient),
            useValue: mockTypeOrmRepo,
          },
        ],
      }).compile();

      repository = module.get<PatientRepository>(PatientRepository);
    });

    it('should call find with correct parameters in findAll', async () => {
      mockTypeOrmRepo.find.mockResolvedValue([]);
      await repository.findAll({ skip: 5, take: 10 });
      expect(mockTypeOrmRepo.find).toHaveBeenCalledWith({
        skip: 5,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });

    it('should call findOneBy in findById', async () => {
      mockTypeOrmRepo.findOneBy.mockResolvedValue(null);
      await repository.findById('PAT-1');
      expect(mockTypeOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 'PAT-1' });
    });
  });
});
