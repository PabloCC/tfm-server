import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Role } from 'src/auth/enums/user-role.enum';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { ClassroomRepository } from './repositories/classroom.repository';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(ClassroomRepository)
    private classroomRepository: ClassroomRepository,
  ) {}

  create(createClassroomDto: CreateClassroomDto) {
    return this.classroomRepository.createClassroom(createClassroomDto);
  }

  async findAll(user: User) {
    const classrooms = await this.classroomRepository.find();
    
    if(user.role === Role.ADMIN) {
      return classrooms;
    } else if(user.role === Role.TEACHER) {
      return classrooms.filter(item => item.teachers.some(teacher => teacher.id === user.id));
    }
  }

  findOne(id: number) {
    return this.classroomRepository.findOne(id);
  }

  async update(id: number, createClassroomDto: CreateClassroomDto) {
    const classroom = await this.findOne(id);

    classroom.name = createClassroomDto.name;
    classroom.teachers = createClassroomDto.teachers;

    await this.classroomRepository.save(classroom);
    
    return classroom;
  }

  remove(id: number) {
    return this.classroomRepository.delete(id);
  }
}
