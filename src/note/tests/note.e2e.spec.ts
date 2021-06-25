
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../auth/enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { getConnection } from "typeorm";
import { typeOrmTestConfig } from '../../config/typeorm.test.config';
import { NoteModule } from '../note.module';


describe('Notes', () => {
    let app: INestApplication;
    let token: string;
    let userRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                NoteModule,
                TypeOrmModule.forRoot(typeOrmTestConfig)
            ],
        }).compile();


        app = moduleRef.createNestApplication();
        await app.init();

        userRepository = app.get('UserRepository');
        await configAuth();
    });


    async function configAuth() {
        const data = await userRepository.save([
            {
                username: 'test',
                name: 'test',
                email: 'test@email.com',
                role: Role.TEACHER,
                password: 'secret',
                salt: 'salt'
        
            },
            {
                username: 'test2',
                name: 'tes2',
                email: 'test2@email.com',
                role: Role.TEACHER,
                password: 'secret',
                salt: 'salt'
            }
        ]);

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

    it(`/GET notes`, () => {
        return request(app.getHttpServer())
            .get('/notes')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect([]);
    });

    it(`/GET notes unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/notes')
            .expect(401);
    });

    it(`/GET one note`, () => {
        return request(app.getHttpServer())
            .get('/notes/1')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect({});
    });

    it(`/GET one note unauthorized`, () => {
        return request(app.getHttpServer())
            .get('/notes/1')
            .expect(401);
    });

    it(`/POST one note`, async () => {
        const user1 = await userRepository.find({where: {id: "1"}});
        const user2 = await userRepository.find({where: {id: "2"}});

        return request(app.getHttpServer())
            .post('/notes')
            .set('Authorization', 'Bearer ' + token)
            .send({ content: 'test', origin: user1[0], target: user2[0]})
            .expect(201);
    });


    afterAll(async () => {
        userRepository.clear();
        const conn = await getConnection();
        await conn.close();
        await app.close();
    });
});