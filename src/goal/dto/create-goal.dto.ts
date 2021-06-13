import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { Classroom } from "../../classroom/entities/classroom.entity";

export class CreateGoalDto {
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    @ApiProperty()
    name: string;

    @ApiProperty({type: Classroom})
    classroom: Classroom;
}
