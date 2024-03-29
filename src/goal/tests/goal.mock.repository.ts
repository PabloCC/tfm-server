import { EntityRepository, Repository } from "typeorm";
import { Goal } from "../entities/goal.entity";

@EntityRepository(Goal)
export class GoalMockRepository extends Repository<Goal> {
    createGoal: () => 'test';
}