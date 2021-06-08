import { Body, Controller, Get, Post, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { SignupUserDto } from './dto/signup-user.dto';
import { GetUser } from './decorators/get-user-decorator';
import { Role } from './enums/user-role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) signupUserDto: SignupUserDto): Promise<User> {
    return this.authService.signUp(signupUserDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken:string}> {
    return this.authService.signIn(authCredentialsDto);
  }
  
  @UseGuards(AuthGuard())
  @Get('/teachers')
  getTeachers(@GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }

    return this.authService.getTeachers();
  }

  @UseGuards(AuthGuard())
  @Get('/families')
  getFamilies(@GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }
    
    return this.authService.getFamilies();
  }

  @UseGuards(AuthGuard())
  @Get('/admins')
  getAdmins(@GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }
    
    return this.authService.getAdmins();
  }
}
