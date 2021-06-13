import { EntityRepository, Repository } from "typeorm";
import { Note } from "../entities/note.entity";

@EntityRepository(Note)
export class NoteMockRepository extends Repository<Note> {
    createNote: () => 'test';
}