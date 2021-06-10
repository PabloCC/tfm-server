
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ClassroomService } from '../classroom.service';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { ClassroomModule } from '../classroom.module';
import { ClasssroomMockRepository } from './classroom.mock.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Classroom } from '../entities/classroom.entity';
import { AppModule } from '../../app.module';
import { AuthModule } from '../../auth/auth.module';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { Role } from '../../auth/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';

describe('Classrooms', () => {
  let app: INestApplication;
  const classroomService = { 
      findAll: () => ['test'],
      findOne: () => 'test',
      create: () => 'test',
      update: () => 'test',
      remove: () => 'test',
    };
  let token;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
          AppModule,
          ClassroomModule,
          AuthModule,
        ],
      providers: [
        ClassroomService,
        {
            provide: getRepositoryToken(Classroom),
            useValue: ClasssroomMockRepository,
        }
      ],
    }).overrideProvider(ClassroomService)
    .useValue(classroomService)
    .compile();
    
    token = await new JwtService({
        secret: 'topSecret',
        signOptions: {
          expiresIn: 3600,
        }
      }).sign( {
        username: 'pepe',
        email: 'pepe@pepe.com',
        role: Role.ADMIN,
    });

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET classrooms`, () => {
    return request(app.getHttpServer())
      .get('/classrooms')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect(classroomService.findAll());
  });

  it(`/GET classrooms unauthorized`, () => {
    return request(app.getHttpServer())
      .get('/classrooms')
      .expect(401);
  });

  it(`/GET one classrooms`, () => {
    return request(app.getHttpServer())
      .get('/classrooms/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect(classroomService.findOne());
  });

  it(`/GET one classroom unauthorized`, () => {
    return request(app.getHttpServer())
      .get('/classrooms/1')
      .expect(401);
  });

  it(`/POST one classrooms`, () => {
    return request(app.getHttpServer())
      .post('/classrooms')
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .expect(classroomService.create());
  });

  it(`/POST one classroom unauthorized`, () => {
    return request(app.getHttpServer())
      .post('/classrooms')
      .expect(401);
  });

  it(`/PUT one classrooms`, () => {
    return request(app.getHttpServer())
      .put('/classrooms/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect(classroomService.update());
  });

  it(`/PUT one classroom unauthorized`, () => {
    return request(app.getHttpServer())
      .put('/classrooms/1')
      .expect(401);
  });

  it(`/DELETE one classrooms`, () => {
    return request(app.getHttpServer())
      .delete('/classrooms/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect(classroomService.remove());
  });

  it(`/DELETE one classroom unauthorized`, () => {
    return request(app.getHttpServer())
      .delete('/classrooms/1')
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});