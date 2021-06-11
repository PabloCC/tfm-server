import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { Student } from '../entities/student.entity';
import { StudentController } from '../student.controller';
import { StudentModule } from '../student.module';
import { StudentService } from '../student.service';
import { StudentMockRepository } from './student.mock.repository';

describe('StudentController', () => {
  let controller: StudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
