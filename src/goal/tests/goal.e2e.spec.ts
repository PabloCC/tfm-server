
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../auth/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { getConnection } from "typeorm";
import { GoalModule } from '../goal.module';
import { typeOrmTestConfig } from '../../config/typeorm.test.config';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { ClassroomModule } from '../../classroom/classroom.module';
import { User } from '../../auth/entities/user.entity';


describe('Goals', () => {
    let app: INestApplication;
    let token: string;
    let token2: string;
    let userRepository;
    let classroomRepository;
    let classroom: Classroom;
    let user: User;
    let user2: User;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                GoalModule,
                ClassroomModule,
                TypeOrmModule.forRoot(typeOrmTestConfig)
            ],
        }).compile();


        app = moduleRef.createNestApplication();
        await app.init();

        userRepository = app.get('UserRepository');
        
        await configAuth();

        classroomRepository = app.get('ClassroomRepository');
        classroom = await classroomRepository.save([{
            name: 'Test',
            stage: 1,
            teachers: [user[0]]
        }]);
    });


    async function configAuth() {
        const data = await userRepository.save([{
            username: 'test',
            name: 'test',
            email: 'test@email.com',
            role: Role.TEACHER,
            password: 'secret',
            salt: 'salt'
        },
        {
            username: 'test2',
            name: 'test2',
            email: 'test@email.com',
            role: Role.TEACHER,
            password: 'secret',
            salt: 'salt'
        },
        ]);

        user = await userRepository.find({
            where: {
                id: data[0].id
            }
        });

        user2 = await userRepository.find({
            where: {
                id: data[1].id
            }
        });

        token = await getToken(user[0]);
        token2 = await getToken(user2[0]);
    }

    async function getToken(user) {
        return new JwtService({
            secret: 'topSecret',
            signOptions: {
                expiresIn: 3600,
            }
        }).sign({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    }

    it(`/GET goals`, () => {
        return request(app.getHttpServer())
            .get('/goals')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect([]);
    });

    it(`/GET goals unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/goals')
            .expect(401);
    });

    it(`/GET one goal`, () => {
        return request(app.getHttpServer())
            .get('/goals/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({});
    });

    it(`/GET one goal unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/goals/1')
            .expect(401);
    });

    it(`/POST one goal`, () => {
        return request(app.getHttpServer())
            .post('/goals')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'test', classroom: classroom[0]})
            .expect(201)
    });

    it(`/POST one goal unauthorized`, () => {
        return request(app.getHttpServer())
            .post('/goals')
            .send({ name: 'test', classroom: classroom[0]})
            .expect(401);
    });


    it(`/PUT one goal`, () => {
        return request(app.getHttpServer())
            .put('/goals/1')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'test', classroom: classroom[0]})
            .expect(200)
    });

    it(`/PUT one goal unauthorized`, () => {
        return request(app.getHttpServer())
            .put('/goals/1')
            .send({ name: 'test', classroom: classroom[0]})
            .expect(401);
    });

    it(`/PUT one goal forbidden`, () => {
        return request(app.getHttpServer())
            .put('/goals/1')
            .set('Authorization', 'Bearer ' + token2)
            .send({ name: 'test', classroom: classroom[0]})
            .expect(403);
    });

    it(`/PUT one goal not found`, () => {
        return request(app.getHttpServer())
            .put('/goals/99')
            .set('Authorization', 'Bearer ' + token2)
            .send({ name: 'test', classroom: classroom[0]})
            .expect(404);
    });

    it(`/DELETE one goal`, () => {
        return request(app.getHttpServer())
            .delete('/goals/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({ raw: [] });
    });

    it(`/DELETE one goal unauthorized`, () => {
        return request(app.getHttpServer())
            .delete('/goals/1')
            .expect(401);
    });

    it(`/DELETE one goal forbidden`, async () => {
        const goal = await app.get('GoalRepository').save([{ name: 'test', classroom: classroom[0]}]);

        return request(app.getHttpServer())
            .delete('/goals/' + goal[0].id)
            .set('Authorization', 'Bearer ' + token2)
            .expect(403);
    });

    it(`/DELETE one goal not found`, async () => {
        return request(app.getHttpServer())
            .delete('/goals/99')
            .set('Authorization', 'Bearer ' + token2)
            .expect(404);
    });

    afterAll(async () => {
        userRepository.clear();
        classroomRepository.clear();
        const conn = await getConnection();
        await conn.close();
        await app.close();
    });
});