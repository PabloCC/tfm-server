import { Module } from '@nestjs/common';
import { AssistanceService } from './assistance.service';
import { AssistanceController } from './assistance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistanceRepository } from '../assistance/repositories/assistance.repository';
import { AuthModule } from '../auth/auth.module';
import { StudentRepository } from '../student/repositories/student.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssistanceRepository, StudentRepository]),
    AuthModule,
  ],
  controllers: [AssistanceController],
  providers: [AssistanceService]
})
export class AssistanceModule {}
