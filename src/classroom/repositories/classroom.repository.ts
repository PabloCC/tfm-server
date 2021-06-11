import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Classroom } from '../entities/classroom.entity';
import { CreateClassroomDto } from '../dto/create-classroom.dto';

@EntityRepository(Classroom)
export class ClassroomRepository extends Repository<Classroom> {

    async createClassroom(createClassroomDto: CreateClassroomDto): Promise<Classroom> {
        const classroom = new Classroom();
        Object.assign(classroom, createClassroomDto);

        try {
            await classroom.save();
            return classroom;
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException();
        }
    }
}
