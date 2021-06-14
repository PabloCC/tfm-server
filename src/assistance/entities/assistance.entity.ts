import { Student } from "../../student/entities/student.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Assistance extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    isPresent: boolean;
    
    @ManyToOne(() => Student, student => student.assistances, { onDelete: 'CASCADE', eager: true})
    student: Student;
}