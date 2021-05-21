import { IsEmail, IsString, Matches, MaxLength, MinLength, IsIn } from 'class-validator';
import { Role } from '../enums/user-role.enum';

export class SignupUserDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsIn([Role.ADMIN, Role.TEACHER, Role.FAMILY])
    role: Role;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
     {message: 'Password too week'}
    ) 
    password: string;
}
