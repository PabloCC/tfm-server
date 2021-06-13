import { User } from "../../auth/entities/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Publication extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    
    @Column()
    content: string;

    @Column()
    date: Date;

    @ManyToOne(() => User, user => user.publications, {onDelete: 'CASCADE'}) 
    author: User;
}