import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UnauthorizedException } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user-decorator';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/enums/user-role.enum';
import { Student } from './entities/student.entity';
import { DeleteResult } from 'typeorm';

@Controller('students')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Students')
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiCreatedResponse({type: Student})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBadRequestResponse({description: 'Bad request'})
  create(@Body() createStudentDto: CreateStudentDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.studentService.create(createStudentDto);
  }

  @Get()
  @ApiOkResponse({type: Student, isArray: true})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({type: Student})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findOne(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.studentService.findOne(+id);
  }

  @Put(':id')
  @ApiOkResponse({type: Student})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBadRequestResponse({description: 'Bad request'})
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOkResponse({type: DeleteResult})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.studentService.remove(+id);
  }
}
