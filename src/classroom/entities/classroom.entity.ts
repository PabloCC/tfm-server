import { User } from "../../auth/entities/user.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "../../student/entities/student.entity";
import { Goal } from "../../goal/entities/goal.entity";
import { ApiProperty } from "@nestjs/swagger";
@Entity()
export class Classroom extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    name: string;

    @Column()
    @ApiProperty()
    stage: number;

    @ManyToMany(() => User, user => user.classrooms, {eager: true})
    @JoinTable()
    @ApiProperty({type: User})
    teachers: User[];

    @OneToMany(() => Student, student => student.classroom, {eager: true})
    @JoinTable()
    @ApiProperty({type: Student, isArray: true})
    students: Student[];

    @OneToMany(() => Goal, goal => goal.classroom)
    @JoinTable()
    @ApiProperty({type: Goal, isArray: true})
    goals: Goal[];
}
