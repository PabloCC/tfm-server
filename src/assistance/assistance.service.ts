import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { CreateAssistanceDto } from './dto/create-assistance.dto';
import { UpdateAssistanceDto } from './dto/update-assistance.dto';
import { Assistance } from './entities/assistance.entity';
import { AssistanceRepository } from './repositories/assistance.repository';
import { Classroom } from '../classroom/entities/classroom.entity';
import { StudentRepository } from '../student/repositories/student.repository';

@Injectable()
export class AssistanceService {
  constructor(
    private assistanceRepository: AssistanceRepository,
    private studentRepository: StudentRepository
  ) {}

  create(createAssistanceDto: CreateAssistanceDto) {
    return this.assistanceRepository.createAssistance(createAssistanceDto);
  }

  async findAll(user: User) {
    const assistances = await this.assistanceRepository.find();

    return this.filterAssistancesByTeacher(assistances, user);
  }

  async findOne(id: number, user: User) {
    const assistance = await this.assistanceRepository.findOne(id);
    const result = this.filterAssistancesByTeacher([assistance], user);

    return result.length ? result[0] : {};
  }

  async update(id: number, updateAssistanceDto: UpdateAssistanceDto, user: User) {
    const assistance = await this.assistanceRepository.findOne(id);

    if(!assistance || !assistance.student) {
      throw new NotFoundException();
    }

    const student = await this.studentRepository.find({ relations: ["classroom"], where: { id: assistance.student.id}  });

    if (student[0] && this.hasUserOwnAssistance(student[0].classroom, user)) {
      return this.assistanceRepository.updateAssistance(id, updateAssistanceDto);
    } else {
      throw new ForbiddenException('No tiene los permisos suficientes');
    }
  }

  async remove(id: number, user: User) {
    const assistance = await this.assistanceRepository.findOne(id);

    if(!assistance || !assistance.student) {
      throw new NotFoundException();
    }

    const student = await this.studentRepository.find({ relations: ["classroom"], where: { id: assistance.student.id}  });

    if (assistance.student && this.hasUserOwnAssistance(student[0].classroom, user)) {
      return this.assistanceRepository.delete(id);
    } else {
      throw new ForbiddenException('No tiene los permisos suficientes');
    }
  }

  private filterAssistancesByTeacher(assistances: Assistance[], user: User) {
    return assistances.filter(assistance => {
      if(assistance && assistance.student.classroom) {
        return assistance.student.classroom.teachers.find(teacher => teacher.id === user.id);
      }
    });
  }

  private hasUserOwnAssistance(classroom: Classroom, user: User) {
    if(!classroom) {
      return false;
    }
    
    return classroom.teachers.some(item => item.id === user.id);
  }
}