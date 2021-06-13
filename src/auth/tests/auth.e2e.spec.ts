
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../auth/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { getConnection } from "typeorm";
import { AuthModule } from '../auth.module';
import * as bcrypt from 'bcrypt';
import { typeOrmTestConfig } from '../../config/typeOrmTestConfig';

describe('Auth', () => {
  let app: INestApplication;
  let token: string;
  let userRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRoot(typeOrmTestConfig)
      ],
    }).compile();


    app = moduleRef.createNestApplication();
    await app.init();

    userRepository = app.get('UserRepository');
    await configAuth();
  });


  async function configAuth() {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('secretAa!', salt);

    const data = await userRepository.save([{
      username: 'test',
      email: 'test@email.com',
      role: Role.ADMIN,
      password,
      salt, 
    }]);

    const user = await userRepository.find({
      where: {
        id: data[0].id
      }
    });

    token = await new JwtService({
      secret: 'topSecret',
      signOptions: {
        expiresIn: 3600,
      }
    }).sign({
      id: user[0].id,
      username: user[0].username,
      email: user[0].email,
      role: user[0].role,
    });
  }

  it(`/GET signup`, async () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'test2',
        email: 'test@email.com',
        role: Role.ADMIN,
        password: 'secretAa!',
      })
      .expect(201);
      
  });

  it(`/GET signin`, async () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        username: 'test',
        password: 'secretAa!',
      })
      .expect(201)
      .expect(res => res.body.accessToken);      
  });

  it(`/GET an user`, () => {
    return request(app.getHttpServer())
      .get('/auth/users/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it(`/GET an user unauthorized`, () => {
    return request(app.getHttpServer())
      .get('/auth/users/1')
      .expect(401);
  });

  it(`/GET all teachers`, () => {
    return request(app.getHttpServer())
      .get('/auth/teachers')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it(`/GET all teachers unauthorized`, () => {
    return request(app.getHttpServer())
      .get('/auth/teachers')
      .expect(401);
  });

  it(`/GET all families`, () => {
    return request(app.getHttpServer())
      .get('/auth/families')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it(`/GET all families unauthorized`, () => {
    return request(app.getHttpServer())
      .get('/auth/families')
      .expect(401);
  });

  it(`/GET all admins`, () => {
    return request(app.getHttpServer())
      .get('/auth/admins')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it(`/GET all admins unauthorized`, () => {
    return request(app.getHttpServer())
      .get('/auth/admins')
      .expect(401);
  });

  it(`/PUT one user`, () => {
    return request(app.getHttpServer())
      .put('/auth/users/1')
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: 'test_updated',
        email: 'test@email.com',
      })
      .expect(200)
  });

  it(`/PUT one user unauthorized`, () => {
    return request(app.getHttpServer())
      .put('/auth/users/1')
      .send({
        username: 'test_updated',
        email: 'test@email.com',
        role: Role.ADMIN,
        password: 'secretAa!',
      })
      .expect(401)
  });

  it(`/DELETE one user`, async () => {
    await configAuth();
    return request(app.getHttpServer())
      .delete('/auth/users/1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect({ raw: [] });
  });

  it(`/DELETE one user`, () => {
    return request(app.getHttpServer())
      .delete('/auth/users/1')
      .expect(401);
  });

  afterAll(async () => {
    userRepository.clear();
    const conn = await getConnection();
    await conn.close();
    await app.close();
  });
});