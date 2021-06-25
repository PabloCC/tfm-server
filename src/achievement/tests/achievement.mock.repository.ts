import { EntityRepository, Repository } from "typeorm";
import { Achievement } from "../entities/achievement.entity";

@EntityRepository(Achievement)
export class AchievementMockRepository extends Repository<Achievement> {
    createAchievement: () => 'test';
}