
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../auth/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { getConnection } from "typeorm";
import { AssistanceModule } from '../assistance.module';
import { typeOrmTestConfig } from '../../config/typeorm.test.config';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { ClassroomModule } from '../../classroom/classroom.module';
import { User } from '../../auth/entities/user.entity';
import { Student } from '../../student/entities/student.entity';
import { StudentModule } from '../../student/student.module';


describe('Assistances', () => {
    let app: INestApplication;
    let token: string;
    let token2: string;
    let userRepository;
    let classroomRepository;
    let studentRepository;
    let classroom: Classroom;
    let user: User;
    let user2: User;
    let student: Student;


    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                AssistanceModule,
                ClassroomModule,
                StudentModule,
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
        
        studentRepository = app.get('StudentRepository');
        student = await studentRepository.save([{
            name: 'Pablo',
            birthdate: new Date(),
            classroom: classroom[0],
            image: 'image',
        }]);
    });


    async function configAuth() {
        const data = await userRepository.save([{
            username: 'test',
            name:  'test',
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

    it(`/GET assistances`, () => {
        return request(app.getHttpServer())
            .get('/assistances')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect([]);
    });

    it(`/GET assistances unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/assistances')
            .expect(401);
    });

    it(`/GET one assistance`, () => {
        return request(app.getHttpServer())
            .get('/assistances/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({});
    });

    it(`/GET one assistance unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/assistances/1')
            .expect(401);
    });

    it(`/POST one assistance`, () => {
        return request(app.getHttpServer())
            .post('/assistances')
            .set('Authorization', 'Bearer ' + token)
            .send({ date: '2020-09-09', isPresent: true, student: student[0]})
            .expect(201)
    });

    it(`/POST one assistance unauthorized`, () => {
        return request(app.getHttpServer())
            .post('/assistances')
            .send({ date: '2020-09-09', isPresent: true, student: student[0]})
            .expect(401);
    });


    it(`/PUT one assistance`, () => {
        return request(app.getHttpServer())
            .put('/assistances/1')
            .set('Authorization', 'Bearer ' + token)
            .send({ date: '2020-09-09', isPresent: true, student: student[0]})
            .expect(200)
    });

    it(`/PUT one assistance unauthorized`, () => {
        return request(app.getHttpServer())
            .put('/assistances/1')
            .send({ date: '2020-09-09', isPresent: true, student: student[0]})
            .expect(401);
    });

    it(`/PUT one assistance forbidden`, () => {
        return request(app.getHttpServer())
            .put('/assistances/1')
            .set('Authorization', 'Bearer ' + token2)
            .send({ date: '2020-09-09', isPresent: true, student: student[0]})
            .expect(403);
    });

    it(`/PUT one assistance not found`, () => {
        return request(app.getHttpServer())
            .put('/assistances/99')
            .set('Authorization', 'Bearer ' + token2)
            .send({ date: '2020-09-09', isPresent: true, student: student[0]})
            .expect(404);
    });

    it(`/DELETE one assistance`, () => {
        return request(app.getHttpServer())
            .delete('/assistances/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({ raw: [] });
    });

    it(`/DELETE one assistance unauthorized`, () => {
        return request(app.getHttpServer())
            .delete('/assistances/1')
            .expect(401);
    });

    it(`/DELETE one assistance forbidden`, async () => {
        const assistance = await app.get('AssistanceRepository').save([{ date: '2020-09-09', isPresent: true, student: student[0]}]);

        return request(app.getHttpServer())
            .delete('/assistances/' + assistance[0].id)
            .set('Authorization', 'Bearer ' + token2)
            .expect(403);
    });

    it(`/DELETE one assistance not found`, async () => {
        return request(app.getHttpServer())
            .delete('/assistances/99')
            .set('Authorization', 'Bearer ' + token2)
            .expect(404);
    });

    afterAll(async () => {
        userRepository.clear();
        classroomRepository.clear();
        studentRepository.clear();
        const conn = await getConnection();
        await conn.close();
        await app.close();
    });
});