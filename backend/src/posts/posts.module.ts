import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Picture } from '../entities/picture.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TempUploadModule } from '../temp-upload/temp-upload.module';
import { PicturesModule } from 'src/pictures/pictures.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Picture]), TempUploadModule, PicturesModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}