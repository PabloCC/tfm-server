import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentRepository } from './repositories/student.repository';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentRepository)
    private studentRepository: StudentRepository,
  ) {}

  create(createStudentDto: CreateStudentDto) {
    return this.studentRepository.createStudent(createStudentDto);
  }

  async findAll() {
    const students = await this.studentRepository.find();
    return students;
  }

  findOne(id: number) {
    return this.studentRepository.findOne(id);
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return this.studentRepository.updateStudent(id, updateStudentDto);
  }

  remove(id: number) {
    return this.studentRepository.delete(id);
  }
}
