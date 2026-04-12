import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Picture } from '../entities/picture.entity';
import { PicturesService } from './pictures.service';

@Module({
    imports: [TypeOrmModule.forFeature([Picture])],
    providers: [PicturesService],
    exports: [PicturesService], // чтобы другие модули могли использовать
})
export class PicturesModule {}