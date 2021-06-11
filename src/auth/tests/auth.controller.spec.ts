import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserMockRepository } from './user.mock.repository';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthModule } from '../auth.module';
import { AppModule } from '../../app.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Role } from '../enums/user-role.enum';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { Classroom } from '../../classroom/entities/classroom.entity';


describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule,  JwtModule.register({
        secret: 'topSecret',
        signOptions: {
          expiresIn: 3600,
        }
      }),
      TypeOrmModule.forRoot({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [User, Classroom],
        synchronize: true,
        logging: false
    })
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: UserMockRepository,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should return a user', async () => {
      const user: User = new User();
      
      user.username = 'test'
      user.email = 'test@email.com';
      user.role = Role.ADMIN;
      user.password = 'secret';
      const result = user;

      jest.spyOn(service, 'signUp').mockImplementation(async () => await user);
      expect(await controller.signUp(user)).toStrictEqual(result);
    });
  });

  describe('signup', () => {
    it('should return a user', async () => {
      const user: AuthCredentialsDto = {
        username: 'test',
        password: 'secret',
      }
      const result = { accessToken: 'jwt-token' };

      jest.spyOn(service, 'signIn').mockImplementation(async () => await result);
      expect(await controller.signIn(user)).toStrictEqual(result);
    });
  });

  afterEach(async () => {
    await module.close();
  });
});
