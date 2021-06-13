import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Classroom } from "../../classroom/entities/classroom.entity";

@Entity()
export class Goal extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @ManyToOne(() => Classroom, classroom => classroom.goals, {onDelete: 'CASCADE', eager: true})
    classroom: Classroom;
}