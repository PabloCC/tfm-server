
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ClassroomModule } from '../classroom.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../auth/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { getConnection } from "typeorm";
import { typeOrmTestConfig } from '../../config/typeOrmTestConfig';


describe('Classrooms', () => {
    let app: INestApplication;
    let token: string;
    let userRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ClassroomModule,
                TypeOrmModule.forRoot(typeOrmTestConfig)
            ],
        }).compile();


        app = moduleRef.createNestApplication();
        await app.init();

        userRepository =  app.get('UserRepository');
        await configAuth();
    });

    
    async function configAuth() {
        const data = await userRepository.save([{
            username: 'test',
            email: 'test@email.com',
            role: Role.ADMIN,
            password: 'secret',
            salt: 'salt'
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

    it(`/GET classrooms`, () => {
        return request(app.getHttpServer())
            .get('/classrooms')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect([]);
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
            .expect({});
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
            .send({name: 'test', stage: 1, teachers: []})
            .expect(201)
            .expect({ id: 1, name: 'test', stage: 1, teachers: []});
    });

    it(`/POST one classroom unauthorized`, () => {
        return request(app.getHttpServer())
            .post('/classrooms')
            .send({name: 'test', stage: 1, teachers: []})
            .expect(401);
    });

    it(`/PUT one classrooms`, () => {
        return request(app.getHttpServer())
            .put('/classrooms/1')
            .set('Authorization', 'Bearer ' + token)
            .send({name: 'test', stage: 1, teachers: []})
            .expect(200)
            .expect({ id: 1, name: 'test', stage: 1, teachers: [], students: [] });
    });

    it(`/PUT one classroom unauthorized`, () => {
        return request(app.getHttpServer())
            .put('/classrooms/1')
            .send({name: 'test', stage: 1, teachers: []})
            .expect(401);
    });

    it(`/DELETE one classrooms`, () => {
        return request(app.getHttpServer())
            .delete('/classrooms/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({ raw: [] });
    });

    it(`/DELETE one classroom unauthorized`, () => {
        return request(app.getHttpServer())
            .delete('/classrooms/1')
            .expect(401);
    });

    afterAll(async () => {
        userRepository.clear();
        const conn = await getConnection();
        await conn.close();
        await app.close();
    });
});