import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString, MaxLength, MinLength } from "class-validator";

export class CreateStudentDto {
    @IsString()
    @MinLength(1)
    @MaxLength(40)
    @ApiProperty()
    name: string;

    @IsDateString()
    @ApiProperty()
    birthdate: Date;
}
