import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Note } from './entities/note.entity';

@Controller('notes')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Notes')
@ApiBearerAuth()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @ApiCreatedResponse({type: Note})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  @ApiBadRequestResponse({description: 'Bad request'})
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.noteService.create(createNoteDto);
  }

  @Get()
  @ApiOkResponse({type: Note, isArray: true})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findAll() {
    return this.noteService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({type: Note})
  @ApiUnauthorizedResponse({description: 'Unauthorized'})
  findOne(@Param('id') id: string) {
    return this.noteService.findOne(+id);
  }
}
