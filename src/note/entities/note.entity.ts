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

    @ManyToOne(() => User, user => user.notesSent, {onDelete: 'CASCADE'}) 
    origin: User;

    @ManyToOne(() => User, user => user.notesReceived, {onDelete: 'CASCADE'})
    target: User;
}