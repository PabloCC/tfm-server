import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Goal } from "../../goal/entities/goal.entity";
import { Student } from "../../student/entities/student.entity";

@Entity()
export class Achievement extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    date: Date;

    @ManyToOne(() => Goal, goal => goal.achievements, {onDelete: 'CASCADE'}) 
    goal: Goal;

    @ManyToOne(() => Student, student => student.achievements, {onDelete: 'CASCADE'}) 
    student: Student;
}