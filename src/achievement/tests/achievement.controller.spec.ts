import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { Role } from '../../auth/enums/user-role.enum';
import { DeleteResult } from 'typeorm';
import { typeOrmTestConfig } from '../../config/typeorm.test.config';
import { Achievement } from '../entities/achievement.entity';
import { AchievementController } from '../achievement.controller';
import { AchievementModule } from '../achievement.module';
import { AchievementService } from '../achievement.service';
import { AchievementMockRepository } from './achievement.mock.repository';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { ClasssroomMockRepository } from '../../classroom/tests/classroom.mock.repository';
import { ClassroomModule } from '../../classroom/classroom.module';

describe('AchievementController', () => {
  let controller: AchievementController;
  let service: AchievementService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        AchievementModule,
        ClassroomModule,
        TypeOrmModule.forRoot(typeOrmTestConfig)
      ],
      controllers: [AchievementController],
      providers: [
        AchievementService,
        {
          provide: getRepositoryToken(Achievement),
          useValue: AchievementMockRepository
        },
        {
          provide: getRepositoryToken(Classroom),
          useValue: ClasssroomMockRepository
        }
      ],
    }).compile();

    controller = module.get<AchievementController>(AchievementController);
    service = module.get<AchievementService>(AchievementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of achievement', async () => {
      const achievement: Achievement = new Achievement();
      const result = [achievement];
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'findAll').mockImplementation(async () => await [achievement]);
      expect(await controller.findAll(mockUser)).toStrictEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return an array of achievement', async () => {
      const achievement: Achievement = new Achievement();
      const result = achievement;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'findOne').mockImplementation(async () => await achievement);
      expect(await controller.findOne("1", mockUser)).toStrictEqual(result);
    });
  });

  describe('create', () => {
    it('should return a achievement', async () => {
      const achievement: Achievement = new Achievement();
      const result = achievement;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;
      
      jest.spyOn(service, 'create').mockImplementation(async () => await achievement);
      expect(await controller.create(achievement, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const achievement: Achievement = new Achievement();
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.create(achievement, mockUser) }).toThrowError(unauthorized);
    });
  });
  
  describe('update', () => {
    it('should return a achievement', async () => {
      const achievement: Achievement = new Achievement();
      const result = achievement;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'update').mockImplementation(async () => await achievement);
      expect(await controller.update("1", achievement, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const achievement: Achievement = new Achievement();
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.update("1", achievement, mockUser) }).toThrowError(unauthorized);
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
