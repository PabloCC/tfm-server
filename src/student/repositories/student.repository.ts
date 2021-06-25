import { EntityRepository, Repository } from 'typeorm';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';

@EntityRepository(Student)
export class StudentRepository extends Repository<Student> {

    async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
        const student = new Student();
        Object.assign(student, createStudentDto);
        
        this.checkBirthdate(student);

        try {
            await student.save();
            return student;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async updateStudent(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
        const student = await this.findOne(id);
        Object.assign(student, updateStudentDto);

        this.checkBirthdate(student);

        try {
            await student.save();
            return student;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    checkBirthdate(student) {
        const birthdate = new Date(student.birthdate).getTime();
        const today = new Date(Date.now()).getTime();

        if (today > birthdate) {
            const timediff = today - birthdate;
            const daysdiff = timediff / (1000 * 3600 * 24);

            if (student.classroom.stage !== +(daysdiff / 365).toFixed()) {
                throw new ForbiddenException('La edad del alumno no coincide con el nivel del aula.');
            }
        } else {
            throw new ForbiddenException('La fecha de nacimiento no puede ser superior a la actual');
        }
    }
}
