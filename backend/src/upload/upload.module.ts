import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Picture } from '../entities/picture.entity';
import { UploadService } from './upload.service';

@Module({
    imports: [TypeOrmModule.forFeature([Picture])],
    providers: [UploadService],
    exports: [UploadService],
})
export class UploadModule {}