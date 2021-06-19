import { Student } from "../../student/entities/student.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Assistance extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    date: Date;

    @Column()
    @ApiProperty()
    isPresent: boolean;
    
    @ManyToOne(() => Student, student => student.assistances, { onDelete: 'CASCADE', eager: true})
    student: Student;
}