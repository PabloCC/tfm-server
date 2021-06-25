import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationRepository } from './repositories/publication.repository';

@Injectable()
export class PublicationService {
  constructor(
    private publicationRepository: PublicationRepository,
  ) {}

  create(createPublicationDto: CreatePublicationDto, user: User) {
    return this.publicationRepository.createPublication(createPublicationDto, user);
  }

  findAll() {
    return this.publicationRepository.find();
  }

  findOne(id: number) {
    return this.publicationRepository.findOne(id);
  }


  async update(id: number, updatePublicationDto: UpdatePublicationDto, user: User) {
    const publication = await this.findOne(id);

    if(publication.author.id !== user.id) {
      throw new ForbiddenException();
    }

    return this.publicationRepository.updatePublication(id, updatePublicationDto);
  }

  async remove(id: number, user: User) {
    const publication = await this.findOne(id);

    if(publication.author.id !== user.id) {
      throw new ForbiddenException();
    }

    return this.publicationRepository.delete(id);
  }
}
