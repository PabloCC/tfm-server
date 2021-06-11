import { Classroom } from "../../classroom/entities/classroom.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
}
