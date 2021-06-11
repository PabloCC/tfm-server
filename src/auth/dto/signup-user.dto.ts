import { IsEmail, IsString, Matches, MaxLength, MinLength, IsIn } from 'class-validator';
import { Role } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty()
    username: string;

    @IsIn([Role.ADMIN, Role.TEACHER, Role.FAMILY])
    @ApiProperty()
    role: Role;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
     {message: 'Password too week'}
    ) 
    @ApiProperty()
    password: string;
}
