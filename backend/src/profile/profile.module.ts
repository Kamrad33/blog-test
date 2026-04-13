import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UploadModule } from '../upload/upload.module';
import { Picture } from 'src/entities/picture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Picture]), UploadModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}