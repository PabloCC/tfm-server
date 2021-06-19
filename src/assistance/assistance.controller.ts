import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UnauthorizedException } from '@nestjs/common';
import { AssistanceService } from './assistance.service';
import { CreateAssistanceDto } from './dto/create-assistance.dto';
import { UpdateAssistanceDto } from './dto/update-assistance.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user-decorator';
import { Role } from '../auth/enums/user-role.enum';
import { User } from '../auth/entities/user.entity';
import { Assistance } from './entities/assistance.entity';
import { DeleteResult } from 'typeorm';

@Controller('assistances')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Assistances')
@ApiBearerAuth()
export class AssistanceController {
  constructor(private readonly assistanceService: AssistanceService) {}

  @Post()
  @ApiCreatedResponse({type: Assistance})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBadRequestResponse({description: 'Bad request'})
  create(@Body() createAssistanceDto: CreateAssistanceDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.assistanceService.create(createAssistanceDto);
  }

  @Get()
  @ApiOkResponse({type: Assistance, isArray: true})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findAll(@GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.assistanceService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse({type: Assistance})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findOne(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.assistanceService.findOne(+id, user);
  }

  @Put(':id')
  @ApiOkResponse({type: Assistance})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBadRequestResponse({description: 'Bad request'})
  update(@Param('id') id: string, @Body() updateAssistanceDto: UpdateAssistanceDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.assistanceService.update(+id, updateAssistanceDto, user);
  }

  @Delete(':id')
  @ApiOkResponse({type: DeleteResult})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.assistanceService.remove(+id, user);
  }
}
