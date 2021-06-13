import { IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from '@nestjs/swagger';
export class CreateClassroomDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    @ApiProperty()
    name: string;

    @IsNumber()
    @Min(0)
    @Max(5)
    @ApiProperty()
    stage: number;

    @ApiProperty({type: User})
    teachers: User[];
}
