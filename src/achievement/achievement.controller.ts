import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from '../auth/enums/user-role.enum';
import { GetUser } from '../auth/decorators/get-user-decorator';
import { User } from '../auth/entities/user.entity';
import { AchievementService } from './achievement.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Controller('achievements')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Achievements')
@ApiBearerAuth()
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  create(@Body() createAchievementDto: CreateAchievementDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }
    
    return this.achievementService.create(createAchievementDto);
  }

  @Get()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findAll(@GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.achievementService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  findOne(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.achievementService.findOne(+id, user);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  update(@Param('id') id: string, @Body() updateAchievementDto: UpdateAchievementDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.achievementService.update(+id, updateAchievementDto, user);
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.achievementService.remove(+id, user);
  }
}
