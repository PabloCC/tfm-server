import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Achievement } from '../entities/achievement.entity';
import { CreateAchievementDto } from '../dto/create-achievement.dto';
import { UpdateAchievementDto } from '../dto/update-achievement.dto';

@EntityRepository(Achievement)
export class AchievementRepository extends Repository<Achievement> {

    async createAchievement(createAchievementDto: CreateAchievementDto): Promise<Achievement> {
        const achievement = new Achievement();
        Object.assign(achievement, createAchievementDto);

        try {
            await achievement.save();
            return achievement;
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException();
        }
    }

    async updateAchievement(id: number, updateAchievementDto: UpdateAchievementDto): Promise<Achievement> {
        const achievement = await this.findOne(id);
        Object.assign(achievement, updateAchievementDto);

        try {
            await achievement.save();
            return achievement;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

}
