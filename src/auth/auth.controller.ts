import { Body, Controller, Delete, Get, Param, Post, Put, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { SignupUserDto } from './dto/signup-user.dto';
import { GetUser } from './decorators/get-user-decorator';
import { Role } from './enums/user-role.enum';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SigninResponseDto } from './dto/signin-response.dto';
import { DeleteResult } from 'typeorm';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOkResponse({type: User})
  @ApiBadRequestResponse({description: 'Bad request'})
  signUp(@Body(ValidationPipe) signupUserDto: SignupUserDto): Promise<User> {
    return this.authService.signUp(signupUserDto);
  }

  @Post('/signin')
  @ApiOkResponse({type: SigninResponseDto})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBadRequestResponse({description: 'Bad request'})
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken:string}> {
    return this.authService.signIn(authCredentialsDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users/:id')
  @ApiBearerAuth()
  @ApiOkResponse({type: User})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/teachers')
  @ApiBearerAuth()
  @ApiOkResponse({type: User, isArray: true})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  getTeachers() {
    return this.authService.getTeachers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/families')
  @ApiBearerAuth()
  @ApiOkResponse({type: User, isArray: true})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  getFamilies(@GetUser() user: User) {
    if (user.role !== Role.ADMIN && user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }
    
    return this.authService.getFamilies();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/admins')
  @ApiBearerAuth()
  @ApiOkResponse({type: User, isArray: true})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  getAdmins(@GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }
    
    return this.authService.getAdmins();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('users/:id')
  @ApiBearerAuth()
  @ApiOkResponse({type: User})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBadRequestResponse({description: 'Bad request'})
  update(@Param('id') id: string, @Body() signupUserDto: SignupUserDto, @GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }

    return this.authService.update(+id, signupUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('users/:id')
  @ApiBearerAuth()
  @ApiOkResponse({type: DeleteResult})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }

    return this.authService.remove(+id);
  }
}
