import { IsString, MaxLength, MinLength } from "class-validator";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from '@nestjs/swagger';
export class CreateClassroomDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    @ApiProperty()
    name: string;

    @ApiProperty({type: User})
    teachers: User[];
}
