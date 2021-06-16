import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/user-role.enum';
import { Classroom } from '../../classroom/entities/classroom.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../../student/entities/student.entity';
import { Note } from '../../note/entities/note.entity';
import { Publication } from '../../publication/entities/publication.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  username: string;

  @Column()
  @ApiProperty()
  role: Role;

  @Column()
  @Exclude({ toPlainOnly: true })
  @ApiProperty()
  password: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  @ApiProperty()
  salt: string;

  @ManyToMany(() => Classroom, classroom => classroom.teachers)
  classrooms: Classroom[];

  @ManyToOne(() => Student, student => student.parents)
  student?: Student;

  @OneToMany(() => Note, note => note.origin)
  notesSent?: Note[];

  @OneToMany(() => Note, note => note.target)
  notesReceived?: Note[];

  @OneToMany(() => Publication, publication => publication.author)
  publications?: Publication[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

}
