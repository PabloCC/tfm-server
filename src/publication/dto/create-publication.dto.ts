import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreatePublicationDto {
    @IsString()
    @MinLength(4)
    @MaxLength(40)
    @ApiProperty()
    title: string;
    
    @IsString()
    @MinLength(4)
    @MaxLength(600)
    @ApiProperty()
    content: string;
}
