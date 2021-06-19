import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { Goal } from "../../goal/entities/goal.entity";
import { Student } from "../../student/entities/student.entity";

export class CreateAchievementDto {
    @IsDateString()
    @ApiProperty()
    date: Date;

    @ApiProperty()
    goal: Goal;

    @ApiProperty()
    student: Student;
}
