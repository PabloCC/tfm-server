import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Achievement } from "../../achievement/entities/achievement.entity";
import { Classroom } from "../../classroom/entities/classroom.entity";

@Entity()
export class Goal extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    image: string;
    
    @ManyToOne(() => Classroom, classroom => classroom.goals, {onDelete: 'CASCADE', eager: true})
    classroom: Classroom;

    @ManyToOne(() => Achievement, achievement => achievement.student)
    achievements?: Achievement;
}