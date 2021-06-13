import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GoalRepository } from './repositories/goal.repository';
import { ClassroomRepository } from '../classroom/repositories/classroom.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoalRepository, ClassroomRepository]),
    AuthModule,
  ],
  controllers: [GoalController],
  providers: [GoalService]
})
export class GoalModule {}
