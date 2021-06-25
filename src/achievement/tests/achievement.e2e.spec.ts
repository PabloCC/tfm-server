
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../auth/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { getConnection } from "typeorm";
import { AchievementModule } from '../achievement.module';
import { typeOrmTestConfig } from '../../config/typeorm.test.config';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { ClassroomModule } from '../../classroom/classroom.module';
import { User } from '../../auth/entities/user.entity';
import { Goal } from '../../goal/entities/goal.entity';
import { Student } from '../../student/entities/student.entity';
import { GoalModule } from '../../goal/goal.module';
import { StudentModule } from '../../student/student.module';


describe('Achievements', () => {
    let app: INestApplication;
    let token: string;
    let token2: string;
    let userRepository;
    let classroomRepository;
    let goalRepository;
    let studentRepository;
    let classroom: Classroom;
    let goal: Goal;
    let student: Student;
    let user: User;
    let user2: User;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                AchievementModule,
                ClassroomModule,
                GoalModule,
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

        goalRepository = app.get('GoalRepository');
        goal = await goalRepository.save([{
            name: 'goal',
            image: 'image',
            classroom: classroom[0],
        }]);

        studentRepository = app.get('StudentRepository');
        student = await studentRepository.save([{
            name: 'Test',
            birthdate: '2020-09-03',
            parents: [],
            image: 'image',
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

    it(`/GET achievements`, () => {
        return request(app.getHttpServer())
            .get('/achievements')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect([]);
    });

    it(`/GET achievements unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/achievements')
            .expect(401);
    });

    it(`/GET one achievement`, () => {
        return request(app.getHttpServer())
            .get('/achievements/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({});
    });

    it(`/GET one achievement unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/achievements/1')
            .expect(401);
    });

    it(`/POST one achievement`, () => {
        return request(app.getHttpServer())
            .post('/achievements')
            .set('Authorization', 'Bearer ' + token)
            .send({ date: '2020-09-03', goal: goal[0], student: student[0]})
            .expect(201)
    });

    it(`/POST one achievement unauthorized`, () => {
        return request(app.getHttpServer())
            .post('/achievements')
            .send({ date: '2020-09-03', goal: goal[0], student: student[0]})
            .expect(401);
    });


    it(`/PUT one achievement`, () => {
        return request(app.getHttpServer())
            .put('/achievements/1')
            .set('Authorization', 'Bearer ' + token)
            .send({ date: '2020-09-03', goal: goal[0], student: student[0]})
            .expect(200)
    });

    it(`/PUT one achievement unauthorized`, () => {
        return request(app.getHttpServer())
            .put('/achievements/1')
            .send({ date: '2020-09-03', goal: goal[0], student: student[0]})
            .expect(401);
    });

    it(`/PUT one achievement forbidden`, () => {
        return request(app.getHttpServer())
            .put('/achievements/1')
            .set('Authorization', 'Bearer ' + token2)
            .send({ date: '2020-09-03', goal: goal[0], student: student[0]})
            .expect(403);
    });

    it(`/PUT one achievement not found`, () => {
        return request(app.getHttpServer())
            .put('/achievements/99')
            .set('Authorization', 'Bearer ' + token2)
            .send({ date: '2020-09-03', goal: goal[0], student: student[0]})
            .expect(404);
    });

    it(`/DELETE one achievement`, () => {
        return request(app.getHttpServer())
            .delete('/achievements/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({ raw: [] });
    });

    it(`/DELETE one achievement unauthorized`, () => {
        return request(app.getHttpServer())
            .delete('/achievements/1')
            .expect(401);
    });

    it(`/DELETE one achievement forbidden`, async () => {
        const achievement = await app.get('AchievementRepository').save([{ date: '2020-09-03', goal: goal[0], student: student[0]}]);

        return request(app.getHttpServer())
            .delete('/achievements/' + achievement[0].id)
            .set('Authorization', 'Bearer ' + token2)
            .expect(403);
    });

    it(`/DELETE one achievement not found`, async () => {
        return request(app.getHttpServer())
            .delete('/achievements/99')
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