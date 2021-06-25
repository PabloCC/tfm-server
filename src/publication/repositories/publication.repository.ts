import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Publication } from '../entities/publication.entity';
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { UpdatePublicationDto } from '../dto/update-publication.dto';
import { User } from '../../auth/entities/user.entity';

@EntityRepository(Publication)
export class PublicationRepository extends Repository<Publication> {

    async createPublication(createPublicationDto: CreatePublicationDto, user: User): Promise<Publication> {
        const publication = new Publication();
        Object.assign(publication, createPublicationDto);
        publication.date = new Date(Date.now());
        publication.author = user;

        try {
            await publication.save();
            return publication;
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException();
        }
    }

    async updatePublication(id: number, updatePublicationDto: UpdatePublicationDto): Promise<Publication> {
        const publication = await this.findOne(id);
        publication.title = updatePublicationDto.title;
        publication.content = updatePublicationDto.content;

        try {
            await publication.save();
            return publication;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

}
