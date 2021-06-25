import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UnauthorizedException } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user-decorator';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/enums/user-role.enum';
import { Publication } from './entities/publication.entity';
import { DeleteResult } from 'typeorm';

@Controller('publications')
@Controller('notes')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Publications')
@ApiBearerAuth()
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  @ApiCreatedResponse({type: Publication})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBadRequestResponse({description: 'Bad request'})
  create(@Body() createPublicationDto: CreatePublicationDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }
    
    return this.publicationService.create(createPublicationDto, user);
  }

  @Get()
  @ApiOkResponse({type: Publication, isArray: true})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findAll() {
    return this.publicationService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({type: Publication})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findOne(@Param('id') id: string) {
    return this.publicationService.findOne(+id);
  }

  @Put(':id')
  @ApiOkResponse({type: Publication})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBadRequestResponse({description: 'Bad request'})
  update(@Param('id') id: string, @Body() updatePublicationDto: UpdatePublicationDto, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.publicationService.update(+id, updatePublicationDto, user);
  }

  @Delete(':id')
  @ApiOkResponse({type: DeleteResult})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.TEACHER) {
      throw new UnauthorizedException();
    }

    return this.publicationService.remove(+id, user);
  }
}
