
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { Role } from '../../auth/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { getConnection } from "typeorm";
import { StudentModule } from '../student.module';
import { ClassroomModule } from '../../classroom/classroom.module';
import { typeOrmTestConfig } from '../../config/typeorm.test.config';


describe('Students', () => {
    let app: INestApplication;
    let token: string;
    let userRepository;
    let classroomRepository;
    let classroom: Classroom;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                StudentModule,
                ClassroomModule,
                TypeOrmModule.forRoot(typeOrmTestConfig)
            ],
        }).compile();


        app = moduleRef.createNestApplication();
        await app.init();

        userRepository = app.get('UserRepository');
        classroomRepository = app.get('ClassroomRepository');
        await configAuth();

        classroom = await classroomRepository.save([{
            name: 'Test',
            stage: 1,
            teachers: [],
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

    it(`/GET students`, () => {
        return request(app.getHttpServer())
            .get('/students')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect([]);
    });

    it(`/GET students unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/students')
            .expect(401);
    });

    it(`/GET one student`, () => {
        return request(app.getHttpServer())
            .get('/students/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({});
    });

    it(`/GET one student unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/students/1')
            .expect(401);
    });

    it(`/POST one student`, () => {
        return request(app.getHttpServer())
            .post('/students')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'test', birthdate: '2020-09-03', classroom: classroom[0], image: 'image' })
            .expect(201)
            .expect({
                name: 'test',
                birthdate: '2020-09-03',
                classroom: { name: 'Test', stage: 1, teachers: [], id: 1 },
                image: 'image',
                id: 1
            });
    });

    it(`/POST one student unauthorized`, () => {
        return request(app.getHttpServer())
            .post('/students')
            .send({ name: 'test', birthdate: '2020-09-03', classroom: classroom[0] })
            .expect(401);
    });

    it(`/POST one student fake date`, () => {
        return request(app.getHttpServer())
            .post('/students')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'test', birthdate: '2050-09-03', classroom: classroom[0], image: 'image' })
            .expect(403);
    });

    it(`/POST one student wrong classroomm stage`, () => {
        return request(app.getHttpServer())
            .post('/students')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'test', birthdate: '2021-03-03', classroom: classroom[0], image: 'image' })
            .expect(403);
    });

    it(`/PUT one classrooms`, () => {
        return request(app.getHttpServer())
            .put('/students/1')
            .set('Authorization', 'Bearer ' + token)
            .send({ name: 'test2', birthdate: '2020-09-03', classroom: classroom[0], image: 'image' })
            .expect(200)
            .expect({
                id: 1,
                name: 'test2',
                birthdate: '2020-09-03',
                classroom: { name: 'Test', stage: 1, teachers: [], id: 1 },
                parents: [],
                image: 'image'
            });
    });

    it(`/PUT one student unauthorized`, () => {
        return request(app.getHttpServer())
            .put('/students/1')
            .send({ name: 'test2', birthdate: '2020-09-03', classroom: classroom[0], image: 'image' })
            .expect(401);
    });

    it(`/DELETE one student`, () => {
        return request(app.getHttpServer())
            .delete('/students/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({ raw: [] });
    });

    it(`/DELETE one student unauthorized`, () => {
        return request(app.getHttpServer())
            .delete('/students/1')
            .expect(401);
    });

    afterAll(async () => {
        userRepository.clear();
        classroomRepository.clear();
        const conn = await getConnection();
        await conn.close();
        await app.close();
    });
});