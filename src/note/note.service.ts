import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteRepository } from './repositories/note.repository';

@Injectable()
export class NoteService {
  constructor(
    private noteRepository: NoteRepository,
  ) {}

  create(createNoteDto: CreateNoteDto) {
    return this.noteRepository.createNote(createNoteDto);
  }

  async findAll(user: User) {
    const notes = await this.noteRepository.find();

    if(notes && notes.length) {
      return notes.filter(note => note.origin.id === user.id || note.target.id === user.id);
    } else {
      return notes;
    }
  }

  findOne(id: number) {
    return this.noteRepository.findOne(id);
  }
}
