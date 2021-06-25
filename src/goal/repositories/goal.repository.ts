import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Goal } from '../entities/goal.entity';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { UpdateGoalDto } from '../dto/update-goal.dto';

@EntityRepository(Goal)
export class GoalRepository extends Repository<Goal> {

    async createGoal(createGoalDto: CreateGoalDto): Promise<Goal> {
        const goal = new Goal();
        Object.assign(goal, createGoalDto);

        try {
            await goal.save();
            return goal;
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException();
        }
    }

    async updateGoal(id: number, updateGoalDto: UpdateGoalDto): Promise<Goal> {
        const goal = await this.findOne(id);
        Object.assign(goal, updateGoalDto);

        try {
            await goal.save();
            return goal;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

}
