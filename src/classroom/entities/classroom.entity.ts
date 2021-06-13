import { User } from "../../auth/entities/user.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "../../student/entities/student.entity";
@Entity()
export class Classroom extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    stage: number;

    @ManyToMany(() => User, user => user.classrooms, {eager: true, onDelete: 'CASCADE'})
    @JoinTable()
    teachers: User[];

    @OneToMany(() => Student, student => student.classroom, {eager: true, onDelete: 'CASCADE'})
    @JoinTable()
    students: Student[];
}
