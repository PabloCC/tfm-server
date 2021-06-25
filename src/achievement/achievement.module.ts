import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { AchievementRepository } from './repositories/achievement.repository';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomRepository } from '../classroom/repositories/classroom.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AchievementRepository, ClassroomRepository]),
    AuthModule,
  ],
  controllers: [AchievementController],
  providers: [AchievementService]
})
export class AchievementModule {}
