import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClassroomController } from '../classroom.controller';
import { ClassroomService } from '../classroom.service';
import { Classroom } from '../entities/classroom.entity';
import { ClasssroomMockRepository } from './classroom.mock.repository';

describe('ClassroomController', () => {
  let controller: ClassroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
