import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ClassroomRepository } from '../classroom/repositories/classroom.repository';
import { User } from '../auth/entities/user.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { Achievement } from './entities/achievement.entity';
import { AchievementRepository } from './repositories/achievement.repository';
import { Classroom } from '../classroom/entities/classroom.entity';

@Injectable()
export class AchievementService {
  constructor(
    private achievementRepository: AchievementRepository,
    private classroomRepository: ClassroomRepository,
  ) {}

  create(createAchievementDto: CreateAchievementDto) {
    return this.achievementRepository.createAchievement(createAchievementDto);
  }

  async findAll(user: User) {
    const achievements = await this.achievementRepository.find();

    return achievements;
  }

  async findOne(id: number, user: User) {
    const achievement = await this.achievementRepository.findOne(id);
    const result = this.filterAchievementsByTeacher([achievement], user);

    return result.length ? result[0] : {};
  }

  async update(id: number, updateAchievementDto: UpdateAchievementDto, user: User) {
    const achievement = await this.achievementRepository.findOne(id);

    if(!achievement) {
      throw new NotFoundException();
    }

    const classrooms = await this.classroomRepository.find({ relations: ["teachers"], where: { id: achievement.goal.classroom.id}  });

    if (this.hasUserOwnAchievement(classrooms, user)) {
      return this.achievementRepository.updateAchievement(id, updateAchievementDto);
    } else {
      throw new ForbiddenException('No tiene los permisos suficientes');
    }
  }

  async remove(id: number, user: User) {
    const achievement = await this.achievementRepository.findOne(id);

    if(!achievement) {
      throw new NotFoundException();
    }

    const classrooms = await this.classroomRepository.find({ relations: ["teachers"], where: { id: achievement.goal.classroom.id}  });

    if (this.hasUserOwnAchievement(classrooms, user)) {
      return this.achievementRepository.delete(id);
    } else {
      throw new ForbiddenException('No tiene los permisos suficientes');
    }
  }

  private filterAchievementsByTeacher(achievements: Achievement[], user: User) {
    return achievements.filter(achievement => {
      if(achievement && achievement.goal && achievement.goal.classroom) {
        return achievement.goal.classroom.teachers.find(teacher => teacher.id === user.id);
      }
    });
  }

  private hasUserOwnAchievement(classrooms: Classroom[], user: User) {
    if(!classrooms || !classrooms.length) {
      return false;
    }
    
    return classrooms.find(classroom => classroom.teachers.some(item => item.id === user.id));
  }
}
