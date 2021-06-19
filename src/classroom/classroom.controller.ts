import { Controller, Get, Post, Body, Param, UseGuards, Put, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { GetUser } from '../auth/decorators/get-user-decorator';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/enums/user-role.enum';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { Classroom } from './entities/classroom.entity';

@Controller('classrooms')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Classrooms')
@ApiBearerAuth()
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  @ApiCreatedResponse({type: Classroom})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBadRequestResponse({description: 'Bad request'})
  create(@Body() createClassroomDto: CreateClassroomDto, @GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }

    return this.classroomService.create(createClassroomDto);
  }

  @Get()
  @ApiOkResponse({type: Classroom, isArray: true})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findAll(@GetUser() user: User) {
    return this.classroomService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse({type: Classroom})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findOne(@Param('id') id: string) {
    return this.classroomService.findOne(+id);
  }

  @Get('/student/:id')
  @ApiOkResponse({type: Classroom})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findOneByStudent(@GetUser() user: User, @Param('id') id: string) {
    return this.classroomService.findOneByStudent(user, +id);
  }

  @Put(':id')
  @ApiOkResponse({type: Classroom})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBadRequestResponse({description: 'Bad request'})
  update(@Param('id') id: string, @Body() createClassroomDto: CreateClassroomDto, @GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }

    return this.classroomService.update(+id, createClassroomDto);
  }

  @Delete(':id')
  @ApiOkResponse({type: DeleteResult})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }
    return this.classroomService.remove(+id);
  }
}
