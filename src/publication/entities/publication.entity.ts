import { User } from "../../auth/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Publication extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    title: string;
    
    @Column()
    @ApiProperty()
    content: string;

    @Column()
    @ApiProperty()
    date: Date;

    @ManyToOne(() => User, user => user.publications, {onDelete: 'CASCADE', eager: true})
    author: User;
}