import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  findAll() {
    return this.classroomRepository.find();
  }

  findOne(id: number) {
    return this.classroomRepository.findOne(id);
  }
}
