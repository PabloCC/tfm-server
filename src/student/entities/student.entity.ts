import { Classroom } from "../../classroom/entities/classroom.entity";
import { BaseEntity, Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../auth/entities/user.entity";

@Entity()
export class Student extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    birthdate: Date
  
    @ManyToOne(() => Classroom, classroom => classroom.students, { eager: false })
    classroom: Classroom

    @OneToMany(() => User, user => user.student, {eager: true})
    @JoinTable()    
    parents: User[]
}
