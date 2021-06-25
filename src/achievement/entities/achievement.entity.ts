import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Goal } from "../../goal/entities/goal.entity";
import { Student } from "../../student/entities/student.entity";

@Entity()
export class Achievement extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;
    
    @Column()
    @ApiProperty()
    date: Date;

    @ManyToOne(() => Goal, goal => goal.achievements, {onDelete: 'CASCADE', eager: true}) 
    @ApiProperty()
    goal: Goal;

    @ManyToOne(() => Student, student => student.achievements, {onDelete: 'CASCADE', eager: true})
    student: Student;
}