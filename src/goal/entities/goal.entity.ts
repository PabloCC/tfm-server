import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Achievement } from "../../achievement/entities/achievement.entity";
import { Classroom } from "../../classroom/entities/classroom.entity";

@Entity()
export class Goal extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    name: string;

    @Column()
    @ApiProperty()
    image: string;
    
    @ManyToOne(() => Classroom, classroom => classroom.goals, {onDelete: 'CASCADE', eager: true})
    classroom: Classroom;

    @OneToMany(() => Achievement, achievement => achievement.student)
    @JoinTable()
    achievements?: Achievement;
}