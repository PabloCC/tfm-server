import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('students')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Students')
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
