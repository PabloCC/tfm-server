import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Assistance } from '../entities/assistance.entity';
import { CreateAssistanceDto } from '../dto/create-assistance.dto';
import { UpdateAssistanceDto } from '../dto/update-assistance.dto';

@EntityRepository(Assistance)
export class AssistanceRepository extends Repository<Assistance> {

    async createAssistance(createAssistanceDto: CreateAssistanceDto): Promise<Assistance> {
        const assistance = new Assistance();
        Object.assign(assistance, createAssistanceDto);

        try {
            await assistance.save();
            return assistance;
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException();
        }
    }

    async updateAssistance(id: number, updateAssistanceDto: UpdateAssistanceDto): Promise<Assistance> {
        const assistance = await this.findOne(id);
        Object.assign(assistance, updateAssistanceDto);

        try {
            await assistance.save();
            return assistance;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

}
