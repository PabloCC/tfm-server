import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user-decorator';
import { User } from 'src/auth/entities/user.entity';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';

@Controller('classrooms')
@UseGuards(AuthGuard())
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.create(createClassroomDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.classroomService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classroomService.findOne(+id);
  }
}
