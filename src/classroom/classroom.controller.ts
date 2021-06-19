import { Controller, Get, Post, Body, Param, UseGuards, Put, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user-decorator';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/enums/user-role.enum';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';

@Controller('classrooms')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Classrooms')
@ApiBearerAuth()
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  create(@Body() createClassroomDto: CreateClassroomDto, @GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }

    return this.classroomService.create(createClassroomDto);
  }

  @Get()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findAll(@GetUser() user: User) {
    return this.classroomService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findOne(@Param('id') id: string) {
    return this.classroomService.findOne(+id);
  }

  @Get('/student/:id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findOneByStudent(@GetUser() user: User, @Param('id') id: string) {
    return this.classroomService.findOneByStudent(user, +id);
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  update(@Param('id') id: string, @Body() createClassroomDto: CreateClassroomDto, @GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }

    return this.classroomService.update(+id, createClassroomDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }
    return this.classroomService.remove(+id);
  }
}
