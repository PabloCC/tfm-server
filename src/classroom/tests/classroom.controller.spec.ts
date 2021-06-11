import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../auth/enums/user-role.enum';
import { DeleteResult } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ClassroomController } from '../classroom.controller';
import { ClassroomService } from '../classroom.service';
import { Classroom } from '../entities/classroom.entity';
import { ClasssroomMockRepository } from './classroom.mock.repository';
import { UnauthorizedException } from '@nestjs/common';

describe('ClassroomController', () => {
  let controller: ClassroomController;
  let service: ClassroomService;
  let module: TestingModule;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PassportModule],
      controllers: [ClassroomController],
      providers: [
        ClassroomService,
        {
          provide: getRepositoryToken(Classroom),
          useValue: ClasssroomMockRepository,
        },
      ],
    }).compile();

    controller = module.get<ClassroomController>(ClassroomController);
    service = module.get<ClassroomService>(ClassroomService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of classrooms', async () => {
      const classroom: Classroom = new Classroom();
      const mockUser: User = new User();
      const result = [classroom];
      jest.spyOn(service, 'findAll').mockImplementation(async () => await [classroom]);

      expect(await controller.findAll(mockUser)).toStrictEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return an array of classrooms', async () => {
      const classroom: Classroom = new Classroom();
      const result = classroom;
      jest.spyOn(service, 'findOne').mockImplementation(async () => await classroom);

      expect(await controller.findOne("1")).toStrictEqual(result);
    });
  });
  
  describe('create', () => {
    it('should return a classroom', async () => {
      const classroom: Classroom = new Classroom();
      const result = classroom;
      const mockUser: User = new User();
      mockUser.email = 'test@email.com';
      mockUser.role = Role.ADMIN;

      jest.spyOn(service, 'create').mockImplementation(async () => await classroom);

      expect(await controller.create(classroom, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const unauthorized = new UnauthorizedException()
      const result = new Classroom();;
      const mockUser: User = new User();
      mockUser.email = 'test@email.com';
      mockUser.role = Role.TEACHER;

      expect(() => { controller.create(result, mockUser) }).toThrowError(unauthorized);
    });
  });
  
  describe('update', () => {
    it('should return a classroom', async () => {
      const classroom: Classroom = new Classroom();
      const result = classroom;
      const mockUser: User = new User();
      mockUser.email = 'test@email.com';
      mockUser.role = Role.ADMIN;

      jest.spyOn(service, 'update').mockImplementation(async () => await classroom);

      expect(await controller.update("1", classroom, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const unauthorized = new UnauthorizedException()
      const result = new Classroom();;
      const mockUser: User = new User();
      mockUser.email = 'test@email.com';
      mockUser.role = Role.TEACHER;
      
      expect(() => { controller.update("1", result, mockUser) }).toThrowError(unauthorized);
    });
  });
  
  describe('delete', () => {
    it('should return a object', async () => {
      const result = new DeleteResult();
      const mockUser: User = new User();
      mockUser.email = 'test@email.com';
      mockUser.role = Role.ADMIN;

      jest.spyOn(service, 'remove').mockImplementation(async () => await result);

      expect(await controller.remove("1", mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.email = 'test@email.com';
      mockUser.role = Role.TEACHER;

      expect(()=> { controller.remove("1", mockUser) }).toThrowError(unauthorized);
    });
  });

  afterEach(async () => {
    await module.close();
  });

});
