import { User } from "../../auth/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Note extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    content: string;
    
    @Column()
    @ApiProperty()
    date: Date;

    @ManyToOne(() => User, user => user.notesSent, {eager: true}) 
    origin: User;

    @ManyToOne(() => User, user => user.notesReceived, {eager: true})
    target: User;
}