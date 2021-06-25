import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationRepository } from './repositories/publication.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([PublicationRepository])
  ],
  controllers: [PublicationController],
  providers: [PublicationService]
})
export class PublicationModule {}
