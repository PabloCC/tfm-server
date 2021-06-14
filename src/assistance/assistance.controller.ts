import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UnauthorizedException } from '@nestjs/common';
import { AssistanceService } from './assistance.service';
import { CreateAssistanceDto } from './dto/create-assistance.dto';
import { UpdateAssistanceDto } from './dto/update-assistance.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user-decorator';
import { Role } from '../auth/enums/user-role.enum';
import { User } from '../auth/entities/user.entity';

@Controller('assistances')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Assistances')
@ApiBearerAuth()
export class AssistanceController {
  constructor(private readonly assistanceService: AssistanceService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  create(@Body() createAssistanceDto: CreateAssistanceDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.assistanceService.create(createAssistanceDto);
  }

  @Get()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findAll(@GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.assistanceService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findOne(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.assistanceService.findOne(+id, user);
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  update(@Param('id') id: string, @Body() updateAssistanceDto: UpdateAssistanceDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.assistanceService.update(+id, updateAssistanceDto, user);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.assistanceService.remove(+id, user);
  }
}
