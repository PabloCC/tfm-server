import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty()
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
     {message: 'Password too week'}
    ) 
    @ApiProperty()
    password: string;
}
