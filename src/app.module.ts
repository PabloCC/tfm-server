import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ClassroomModule } from './classroom/classroom.module';
import { StudentModule } from './student/student.module';
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), 
    AuthModule, 
    ClassroomModule, 
    StudentModule
  ],
})
export class AppModule {}
