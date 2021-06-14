import { EntityRepository, Repository } from "typeorm";
import { Assistance } from "../entities/assistance.entity";

@EntityRepository(Assistance)
export class AssistanceMockRepository extends Repository<Assistance> {
    createAssistance: () => 'test';
}