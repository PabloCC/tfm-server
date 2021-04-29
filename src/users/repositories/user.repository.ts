import { CreateUserDto } from './../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name } = createUserDto;
    const user = new User();

    user.name = name;
    await user.save();

    return user;
  }
}
