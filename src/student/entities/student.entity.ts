import { BaseEntity, Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Classroom } from "../../classroom/entities/classroom.entity";
import { User } from "../../auth/entities/user.entity";
import { Assistance } from "../../assistance/entities/assistance.entity";
import { Achievement } from "../../achievement/entities/achievement.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Student extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    name: string;

    @Column()
    @ApiProperty()
    birthdate: Date

    @Column()
    @ApiProperty()
    image: string;
  
    @ManyToOne(() => Classroom, classroom => classroom.students, { onDelete: 'CASCADE' ,eager: false })
    classroom: Classroom

    @OneToMany(() => User, user => user.student, {eager: true})
    @JoinTable()
    @ApiProperty()  
    parents: User[]

    @OneToMany(() => Assistance, assistance => assistance.student)
    @JoinTable()
    @ApiProperty()
    assistances?: Assistance[];

    @OneToMany(() => Achievement, achievement => achievement.student)
    @JoinTable()
    achievements: Achievement;
}
