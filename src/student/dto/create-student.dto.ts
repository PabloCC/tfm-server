import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString, MaxLength, MinLength } from "class-validator";
import { User } from "../../auth/entities/user.entity";
import { Classroom } from "../../classroom/entities/classroom.entity";

export class CreateStudentDto {
    @IsString()
    @MinLength(1)
    @MaxLength(40)
    @ApiProperty()
    name: string;

    @IsDateString()
    @ApiProperty()
    birthdate: Date;

    @IsString()
    @MinLength(3)
    @ApiProperty()
    image: string;

    @ApiProperty({type: Classroom})
    classroom?: Classroom;

    @ApiProperty({type: User})
    parents?: User[];
}
