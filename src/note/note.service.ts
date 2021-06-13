import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteRepository } from './repositories/note.repository';

@Injectable()
export class NoteService {
  constructor(
    private noteRepository: NoteRepository,
  ) {}

  create(createNoteDto: CreateNoteDto) {
    return this.noteRepository.createNote(createNoteDto);
  }

  async findAll() {
    const students = await this.noteRepository.find();
    return students;
  }

  findOne(id: number) {
    return this.noteRepository.findOne(id);
  }
}
