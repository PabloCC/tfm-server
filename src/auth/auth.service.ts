import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { User } from './entities/user.entity';
import { Role } from './enums/user-role.enum';
import { JwtPayload } from './jwt/jwt-payload.iterface';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signupUserDto: SignupUserDto): Promise<User> {
    return this.userRepository.signUp(signupUserDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUserPassword(authCredentialsDto);

    if(!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async getTeachers() {
    const users = await this.userRepository.find();
    return users.filter(user => user.role === Role.TEACHER);
  }

  async getFamilies() {
    const users = await this.userRepository.find();
    return users.filter(user => user.role === Role.FAMILY);
  }

  async getAdmins() {
    const users = await this.userRepository.find();
    return users.filter(user => user.role === Role.ADMIN);
  }
}
