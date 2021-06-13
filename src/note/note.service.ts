import { Injectable } from '@nestjs/common';
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

  findAll() {
    return this.noteRepository.find();;
  }

  findOne(id: number) {
    return this.noteRepository.findOne(id);
  }
}
