import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { Student } from '../entities/student.entity';
import { StudentController } from '../student.controller';
import { StudentModule } from '../student.module';
import { StudentService } from '../student.service';
import { StudentMockRepository } from './student.mock.repository';

describe('StudentController', () => {
  let controller: StudentController;
  let service: StudentService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        StudentModule,
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          dropSchema: true,
          entities: [Student, User, Classroom],
          synchronize: true,
          logging: false
      })
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
      jest.spyOn(service, 'findOne').mockImplementation(async () => await student);

      expect(await controller.findOne("1")).toStrictEqual(result);
    });
  });

  describe('create', () => {
    it('should return a student', async () => {
      const student: Student = new Student();
      const result = student;

      jest.spyOn(service, 'create').mockImplementation(async () => await student);

      expect(await controller.create(student)).toStrictEqual(result);
    });
  });
  
  describe('update', () => {
    it('should return a student', async () => {
      const student: Student = new Student();
      const result = student;
      
      jest.spyOn(service, 'update').mockImplementation(async () => await student);

      expect(await controller.update("1", student)).toStrictEqual(result);
    });
  });
  
  describe('delete', () => {
    it('should return a object', async () => {
      const result = new DeleteResult();

      jest.spyOn(service, 'remove').mockImplementation(async () => await result);

      expect(await controller.remove("1")).toStrictEqual(result);
    });
  });

  afterEach(async () => {
    await module.close();
  });
});
