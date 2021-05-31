import { IsString, MaxLength, MinLength } from "class-validator";
import { User } from "../../auth/entities/user.entity";

export class CreateClassroomDto {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    name: string;

    teachers: User[];
}
