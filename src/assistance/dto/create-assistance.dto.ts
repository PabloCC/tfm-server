import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString } from "class-validator";
import { Student } from "../../student/entities/student.entity";

export class CreateAssistanceDto {
    @IsDateString()
    @ApiProperty()
    date: Date;

    @IsBoolean()
    @ApiProperty()
    isPresent: boolean;
    
    @ApiProperty({type: Student})
    student: Student;
}
