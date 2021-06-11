import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/user.entity";

@EntityRepository(User)
export class UserMockRepository extends Repository<User> {
    signUp: () => 'test';
    validateUserPassword: () => 'test';
}