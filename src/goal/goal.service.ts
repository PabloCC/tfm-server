import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ClassroomRepository } from '../classroom/repositories/classroom.repository';
import { User } from '../auth/entities/user.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { GoalRepository } from './repositories/goal.repository';
import { Classroom } from '../classroom/entities/classroom.entity';

@Injectable()
export class GoalService {
  constructor(
    private goalRepository: GoalRepository,
    private classroomRepository: ClassroomRepository,
  ) {}

  create(createGoalDto: CreateGoalDto) {
    return this.goalRepository.createGoal(createGoalDto);
  }

  async findAll(user: User) {
    const goals = await this.goalRepository.find();

    return this.filterGoalsByTeacher(goals, user);
  }

  async findOne(id: number, user: User) {
    const goal = await this.goalRepository.findOne(id);
    const result = this.filterGoalsByTeacher([goal], user);

    return result.length ? result[0] : {};
  }

  async update(id: number, updateGoalDto: UpdateGoalDto, user: User) {
    const goal = await this.goalRepository.findOne(id);

    if(!goal) {
      throw new NotFoundException();
    }

    const classrooms = await this.classroomRepository.find({ relations: ["teachers"], where: { id: goal.classroom.id}  });

    if (this.hasUserOwnGoal(classrooms, user)) {
      return this.goalRepository.updateGoal(id, updateGoalDto);
    } else {
      throw new ForbiddenException('No tiene los permisos suficientes');
    }
  }

  async remove(id: number, user: User) {
    const goal = await this.goalRepository.findOne(id);

    if(!goal) {
      throw new NotFoundException();
    }

    const classrooms = await this.classroomRepository.find({ relations: ["teachers"], where: { id: goal.classroom.id}  });

    if (this.hasUserOwnGoal(classrooms, user)) {
      return this.goalRepository.delete(id);
    } else {
      throw new ForbiddenException('No tiene los permisos suficientes');
    }
  }

  private filterGoalsByTeacher(goals: Goal[], user: User) {
    return goals.filter(goal => {
      if(goal && goal.classroom) {
        return goal.classroom.teachers.find(teacher => teacher.id === user.id);
      }
    });
  }

  private hasUserOwnGoal(classrooms: Classroom[], user: User) {
    if(!classrooms || !classrooms.length) {
      return false;
    }
    
    return classrooms.find(classroom => classroom.teachers.some(item => item.id === user.id));
  }
}
