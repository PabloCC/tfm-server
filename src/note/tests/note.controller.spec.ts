import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { typeOrmTestConfig } from '../../config/typeorm.test.config';
import { Note } from '../entities/note.entity';
import { NoteController } from '../note.controller';
import { NoteModule } from '../note.module';
import { NoteService } from '../note.service';
import { NoteMockRepository } from './note.mock.repository';

describe('NoteController', () => {
  let controller: NoteController;
  let service: NoteService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        NoteModule,
        TypeOrmModule.forRoot(typeOrmTestConfig)
      ],
      controllers: [NoteController],
      providers: [
        NoteService,
        {
          provide: getRepositoryToken(Note),
          useValue: NoteMockRepository
        }
      ],
    }).compile();

    controller = module.get<NoteController>(NoteController);
    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of student', async () => {
      const note: Note = new Note();
      const result = [note];
      const mockUser: User = new User();

      jest.spyOn(service, 'findAll').mockImplementation(async () => await [note]);
      expect(await controller.findAll(mockUser)).toStrictEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return an array of student', async () => {
      const note: Note = new Note();
      const result = note;

      jest.spyOn(service, 'findOne').mockImplementation(async () => await note);
      expect(await controller.findOne("1")).toStrictEqual(result);
    });
  });

  describe('create', () => {
    it('should return a student', async () => {
      const note: Note = new Note();
      const result = note;
      
      jest.spyOn(service, 'create').mockImplementation(async () => await note);
      expect(await controller.create(note)).toStrictEqual(result);
    });
  });

  afterEach(async () => {
    await module.close();
  });
});
