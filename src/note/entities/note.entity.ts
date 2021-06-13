import { User } from "../../auth/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Note extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;
    
    @Column()
    date: Date;

    @ManyToOne(() => User, user => user.notesSent, {onDelete: 'CASCADE'}) 
    origin: User;

    @ManyToOne(() => User, user => user.notesReceived, {onDelete: 'CASCADE'}) 
    target: User;
}