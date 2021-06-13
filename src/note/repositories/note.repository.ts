import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Note } from '../entities/note.entity';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@EntityRepository(Note)
export class NoteRepository extends Repository<Note> {

    async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
        const note = new Note();
        Object.assign(note, createNoteDto);
        note.date = new Date();

        try {
            await note.save();
            return note;
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException();
        }
    }

    async updateNote(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
        const note = await this.findOne(id);
        Object.assign(note, updateNoteDto);

        try {
            await note.save();
            return note;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

}
