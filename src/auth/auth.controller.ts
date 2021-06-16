import { Body, Controller, Delete, Get, Param, Post, Put, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { SignupUserDto } from './dto/signup-user.dto';
import { GetUser } from './decorators/get-user-decorator';
import { Role } from './enums/user-role.enum';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
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

  @UseGuards(AuthGuard('jwt'))
  @Get('users/:id')
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/teachers')
  @ApiBearerAuth()
  getTeachers(@GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }

    return this.authService.getTeachers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/families')
  @ApiBearerAuth()
  getFamilies(@GetUser() user: User) {
    if (user.role !== Role.ADMIN && user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }
    
    return this.authService.getFamilies();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/admins')
  @ApiBearerAuth()
  getAdmins(@GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }
    
    return this.authService.getAdmins();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('users/:id')
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  update(@Param('id') id: string, @Body() signupUserDto: SignupUserDto, @GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }

    return this.authService.update(+id, signupUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('users/:id')
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }

    return this.authService.remove(+id);
  }
}
