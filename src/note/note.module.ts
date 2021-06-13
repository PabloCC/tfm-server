import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { NoteRepository } from './repositories/note.repository';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([NoteRepository]),
    AuthModule,
  ],
  controllers: [NoteController],
  providers: [NoteService]
})
export class NoteModule {}
