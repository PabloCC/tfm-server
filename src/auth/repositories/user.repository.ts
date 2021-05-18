import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const user = new User();
    Object.assign(user, authCredentialsDto);
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(user.password, user.salt);

    try {
      await user.save();
      return user;
    } catch(error) {
      if(error.code === '23505') { //duplicate username
        throw new ConflictException('Username already exists');
      } else {
        console.log(error.code);
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const {username, password} = authCredentialsDto;
    const user = await this.findOne({username});

    if(user && await user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
