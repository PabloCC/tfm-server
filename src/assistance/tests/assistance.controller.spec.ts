import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { Role } from '../../auth/enums/user-role.enum';
import { DeleteResult } from 'typeorm';
import { typeOrmTestConfig } from '../../config/typeorm.test.config';
import { Assistance } from '../entities/assistance.entity';
import { AssistanceController } from '../assistance.controller';
import { AssistanceModule } from '../assistance.module';
import { AssistanceService } from '../assistance.service';
import { AssistanceMockRepository } from './assistance.mock.repository';
import { StudentModule } from '../../student/student.module';
import { Student } from '../../student/entities/student.entity';
import { StudentMockRepository } from '../../student/tests/student.mock.repository';

describe('AssistanceController', () => {
  let controller: AssistanceController;
  let service: AssistanceService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        AssistanceModule,
        StudentModule,
        TypeOrmModule.forRoot(typeOrmTestConfig)
      ],
      controllers: [AssistanceController],
      providers: [
        AssistanceService,
        {
          provide: getRepositoryToken(Assistance),
          useValue: AssistanceMockRepository
        },
        {
          provide: getRepositoryToken(Student),
          useValue: StudentMockRepository
        },
      ],
    }).compile();

    controller = module.get<AssistanceController>(AssistanceController);
    service = module.get<AssistanceService>(AssistanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of assistance', async () => {
      const assistance: Assistance = new Assistance();
      const result = [assistance];
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'findAll').mockImplementation(async () => await [assistance]);
      expect(await controller.findAll(mockUser)).toStrictEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return an array of assistance', async () => {
      const assistance: Assistance = new Assistance();
      const result = assistance;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'findOne').mockImplementation(async () => await assistance);
      expect(await controller.findOne("1", mockUser)).toStrictEqual(result);
    });
  });

  describe('create', () => {
    it('should return a assistance', async () => {
      const assistance: Assistance = new Assistance();
      const result = assistance;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;
      
      jest.spyOn(service, 'create').mockImplementation(async () => await assistance);
      expect(await controller.create(assistance, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const assistance: Assistance = new Assistance();
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.create(assistance, mockUser) }).toThrowError(unauthorized);
    });
  });
  
  describe('update', () => {
    it('should return a assistance', async () => {
      const assistance: Assistance = new Assistance();
      const result = assistance;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'update').mockImplementation(async () => await assistance);
      expect(await controller.update("1", assistance, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const assistance: Assistance = new Assistance();
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.update("1", assistance, mockUser) }).toThrowError(unauthorized);
    });
  });
  
  describe('delete', () => {
    it('should return a object', async () => {
      const result = new DeleteResult();
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'remove').mockImplementation(async () => await result);
      expect(await controller.remove("1", mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.remove("1", mockUser) }).toThrowError(unauthorized);
    });
  });

  afterEach(async () => {
    await module.close();
  });
});
