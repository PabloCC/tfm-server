import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmTestConfig } from '../../config/typeorm.test.config';
import { Publication } from '../entities/publication.entity';
import { PublicationController } from '../publication.controller';
import { PublicationModule } from '../publication.module';
import { PublicationService } from '../publication.service';
import { PublicationMockRepository } from './publication.mock.repository';

describe('PublicationController', () => {
  let controller: PublicationController;
  let service: PublicationService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        PublicationModule,
        TypeOrmModule.forRoot(typeOrmTestConfig)
      ],
      controllers: [PublicationController],
      providers: [
        PublicationService,
        {
          provide: getRepositoryToken(Publication),
          useValue: PublicationMockRepository
        }
      ],
    }).compile();

    controller = module.get<PublicationController>(PublicationController);
    service = module.get<PublicationService>(PublicationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
