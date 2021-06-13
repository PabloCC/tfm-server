import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";
import { User } from "../../auth/entities/user.entity";

export class CreateNoteDto {
    @IsString()
    @MinLength(1)
    @MaxLength(600)
    @ApiProperty()
    content: string;

    @ApiProperty({type: User})
    origin: User;

    @ApiProperty({type: User})
    target: User;
}
