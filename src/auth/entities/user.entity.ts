import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/user-role.enum';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  role: Role;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  salt: string;

  @ManyToMany(() => Classroom, classroom => classroom.teachers)
  classrooms: Classroom[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

}
