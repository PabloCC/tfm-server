import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRepository } from './repositories/student.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([StudentRepository]),
    AuthModule,
  ],
  controllers: [StudentController],
  providers: [StudentService]
})
export class StudentModule {}
