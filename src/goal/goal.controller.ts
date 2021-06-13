import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UnauthorizedException } from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user-decorator';
import { Role } from '../auth/enums/user-role.enum';
import { User } from '../auth/entities/user.entity';

@Controller('goals')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Goals')
@ApiBearerAuth()
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  create(@Body() createGoalDto: CreateGoalDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.goalService.create(createGoalDto);
  }

  @Get()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findAll(@GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.goalService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findOne(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.goalService.findOne(+id, user);
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.goalService.update(+id, updateGoalDto, user);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.goalService.remove(+id, user);
  }
}
