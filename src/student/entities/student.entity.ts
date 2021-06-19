import { BaseEntity, Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Classroom } from "../../classroom/entities/classroom.entity";
import { User } from "../../auth/entities/user.entity";
import { Assistance } from "../../assistance/entities/assistance.entity";
import { Achievement } from "../../achievement/entities/achievement.entity";

@Entity()
export class Student extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    birthdate: Date

    @Column()
    image: string;
  
    @ManyToOne(() => Classroom, classroom => classroom.students, { onDelete: 'CASCADE' ,eager: false })
    classroom: Classroom

    @OneToMany(() => User, user => user.student, {eager: true})
    @JoinTable()    
    parents: User[]

    @OneToMany(() => Assistance, assistance => assistance.student)
    @JoinTable()
    assistances?: Assistance[];

    @ManyToOne(() => Achievement, achievement => achievement.student)
    achievements?: Achievement;
}
