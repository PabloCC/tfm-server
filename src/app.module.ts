import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ClassroomModule } from './classroom/classroom.module';
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), 
    AuthModule, 
    ClassroomModule
  ],
})
export class AppModule {}
