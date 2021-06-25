import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { Role } from '../../auth/enums/user-role.enum';
import { DeleteResult } from 'typeorm';
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

  describe('findAll', () => {
    it('should return an array of publication', async () => {
      const publication: Publication = new Publication();
      const result = [publication];

      jest.spyOn(service, 'findAll').mockImplementation(async () => await [publication]);
      expect(await controller.findAll()).toStrictEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return an array of publication', async () => {
      const publication: Publication = new Publication();
      const result = publication;

      jest.spyOn(service, 'findOne').mockImplementation(async () => await publication);
      expect(await controller.findOne("1")).toStrictEqual(result);
    });
  });

  describe('create', () => {
    it('should return a publication', async () => {
      const publication: Publication = new Publication();
      const result = publication;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;
      
      jest.spyOn(service, 'create').mockImplementation(async () => await publication);
      expect(await controller.create(publication, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const publication: Publication = new Publication();
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.create(publication, mockUser) }).toThrowError(unauthorized);
    });
  });
  
  describe('update', () => {
    it('should return a publication', async () => {
      const publication: Publication = new Publication();
      const result = publication;
      const mockUser: User = new User();
      mockUser.role = Role.TEACHER;

      jest.spyOn(service, 'update').mockImplementation(async () => await publication);
      expect(await controller.update("1", publication, mockUser)).toStrictEqual(result);
    });

    it('Unauthorized', async () => {
      const publication: Publication = new Publication();
      const unauthorized = new UnauthorizedException()
      const mockUser: User = new User();
      mockUser.role = Role.ADMIN;

      expect(()=> { controller.update("1", publication, mockUser) }).toThrowError(unauthorized);
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
