import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { Role } from '../../auth/enums/user-role.enum';
import { DeleteResult } from 'typeorm';
import { typeOrmTestConfig } from '../../config/typeorm.test.config';
import { Goal } from '../entities/goal.entity';
import { GoalController } from '../goal.controller';
import { GoalModule } from '../goal.module';
import { GoalService } from '../goal.service';
import { GoalMockRepository } from './goal.mock.repository';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { ClasssroomMockRepository } from '../../classroom/tests/classroom.mock.repository';
import { ClassroomModule } from '../../classroom/classroom.module';

describe('GoalController', () => {
  let controller: GoalController;
  let service: GoalService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        GoalModule,
        ClassroomModule,
        TypeOrmModule.forRoot(typeOrmTestConfig)
      ],
      controllers: [GoalController],
      providers: [
        GoalService,
        {
          provide: getRepositoryToken(Goal),
          useValue: GoalMockRepository
        },
        {
          provide: getRepositoryToken(Classroom),
          useValue: ClasssroomMockRepository
        }
      ],
    }).compile();

    controller = module.get<GoalController>(GoalController);
    service = module.get<GoalService>(GoalService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of goal', async () => {
      const goal: Goal = new Goal();
      const result = [goal];
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'findAll').mockImplementation(async () => await [goal]);
      expect(await controller.findAll(mockUser)).toStrictEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return an array of goal', async () => {
      const goal: Goal = new Goal();
      const result = goal;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'findOne').mockImplementation(async () => await goal);
      expect(await controller.findOne("1", mockUser)).toStrictEqual(result);
    });
  });

  describe('create', () => {
    it('should return a goal', async () => {
      const goal: Goal = new Goal();
      const result = goal;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;
      
      jest.spyOn(service, 'create').mockImplementation(async () => await goal);
      expect(await controller.create(goal, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const goal: Goal = new Goal();
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.create(goal, mockUser) }).toThrowError(unauthorized);
    });
  });
  
  describe('update', () => {
    it('should return a goal', async () => {
      const goal: Goal = new Goal();
      const result = goal;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'update').mockImplementation(async () => await goal);
      expect(await controller.update("1", goal, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const goal: Goal = new Goal();
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.update("1", goal, mockUser) }).toThrowError(unauthorized);
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
