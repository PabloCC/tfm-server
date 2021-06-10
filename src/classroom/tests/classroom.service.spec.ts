import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClassroomService } from '../classroom.service';
import { Classroom } from '../entities/classroom.entity';
import { ClasssroomMockRepository } from './classroom.mock.repository';

describe('ClassroomService', () => {
  let service: ClassroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
      ],
      providers: [
        ClassroomService,
        {
          provide: getRepositoryToken(Classroom),
          useValue: ClasssroomMockRepository,
        },
      ],
    }).compile();

    service = module.get<ClassroomService>(ClassroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
