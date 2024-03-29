import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ClassroomModule } from './classroom/classroom.module';
import { StudentModule } from './student/student.module';
import { NoteModule } from './note/note.module';
import { PublicationModule } from './publication/publication.module';
import { GoalModule } from './goal/goal.module';
import { AssistanceModule } from './assistance/assistance.module';
import { AchievementModule } from './achievement/achievement.module';
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), 
    AuthModule, 
    ClassroomModule, 
    StudentModule, NoteModule, PublicationModule, GoalModule, AssistanceModule, AchievementModule
  ],
})
export class AppModule {}
