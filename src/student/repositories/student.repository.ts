import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {

    async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
        const student = new Student();
        Object.assign(student, createStudentDto);

        try {
            await student.save();
            return student;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    }

    async updateStudent(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
        const student = await this.findOne(id);

        student.name = updateStudentDto.name;
        student.birthdate = updateStudentDto.birthdate;

        try {
            await student.save();
            return student;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
