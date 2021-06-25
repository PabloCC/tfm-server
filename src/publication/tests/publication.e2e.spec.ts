
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../auth/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { getConnection } from "typeorm";
import { PublicationModule } from '../publication.module';
import { typeOrmTestConfig } from '../../config/typeorm.test.config';


describe('Publications', () => {
    let app: INestApplication;
    let token: string;
    let userRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                PublicationModule,
                TypeOrmModule.forRoot(typeOrmTestConfig)
            ],
        }).compile();


        app = moduleRef.createNestApplication();
        await app.init();

        userRepository = app.get('UserRepository');
        await configAuth();
    });


    async function configAuth() {
        const data = await userRepository.save([{
            id: '1',
            username: 'test',
            name: 'test',
            email: 'test@email.com',
            role: Role.TEACHER,
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

    it(`/GET publications`, () => {
        return request(app.getHttpServer())
            .get('/publications')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect([]);
    });

    it(`/GET publications unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/publications')
            .expect(401);
    });

    it(`/GET one publication`, () => {
        return request(app.getHttpServer())
            .get('/publications/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({});
    });

    it(`/GET one publication unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/publications/1')
            .expect(401);
    });

    it(`/POST one publication`, () => {
        return request(app.getHttpServer())
            .post('/publications')
            .set('Authorization', 'Bearer ' + token)
            .send({ title: 'test', content: 'content'})
            .expect(201)
    });

    it(`/POST one publication unauthorized`, () => {
        return request(app.getHttpServer())
            .post('/publications')
            .send({ title: 'test', content: 'content'})
            .expect(401);
    });


    it(`/PUT one classrooms`, () => {
        return request(app.getHttpServer())
            .put('/publications/1')
            .set('Authorization', 'Bearer ' + token)
            .send({ title: 'test', content: 'content'})
            .expect(200)
    });

    it(`/PUT one publication unauthorized`, () => {
        return request(app.getHttpServer())
            .put('/publications/1')
            .send({ title: 'test', content: 'content'})
            .expect(401);
    });

    it(`/DELETE one publication`, () => {
        return request(app.getHttpServer())
            .delete('/publications/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({ raw: [] });
    });

    it(`/DELETE one publication unauthorized`, () => {
        return request(app.getHttpServer())
            .delete('/publications/1')
            .expect(401);
    });

    afterAll(async () => {
        userRepository.clear();
        const conn = await getConnection();
        await conn.close();
        await app.close();
    });
});