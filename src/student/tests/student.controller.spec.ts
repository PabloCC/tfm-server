import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../auth/enums/user-role.enum';
import { DeleteResult } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Student } from '../entities/student.entity';
import { StudentController } from '../student.controller';
import { StudentModule } from '../student.module';
import { StudentService } from '../student.service';
import { StudentMockRepository } from './student.mock.repository';
import { UnauthorizedException } from '@nestjs/common';
import { typeOrmTestConfig } from '../../config/typeorm.test.config';

describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        StudentModule,
        TypeOrmModule.forRoot(typeOrmTestConfig)
      ],
      controllers: [StudentController],
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useValue: StudentMockRepository
        }
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of student', async () => {
      const student: Student = new Student();
      const result = [student];

      jest.spyOn(service, 'findAll').mockImplementation(async () => await [student]);
      expect(await controller.findAll()).toStrictEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return an array of student', async () => {
      const student: Student = new Student();
      const result = student;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'findOne').mockImplementation(async () => await student);
      expect(await controller.findOne("1", mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.findOne("1", mockUser) }).toThrowError(unauthorized);
    });
  });

  describe('create', () => {
    it('should return a student', async () => {
      const student: Student = new Student();
      const result = student;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;
      
      jest.spyOn(service, 'create').mockImplementation(async () => await student);
      expect(await controller.create(student, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const student: Student = new Student();
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.create(student, mockUser) }).toThrowError(unauthorized);
    });
  });
  
  describe('update', () => {
    it('should return a student', async () => {
      const student: Student = new Student();
      const result = student;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'update').mockImplementation(async () => await student);
      expect(await controller.update("1", student, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const student: Student = new Student();
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.update("1", student, mockUser) }).toThrowError(unauthorized);
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
