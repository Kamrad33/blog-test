import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemporaryPicture } from '../entities/temporary-picture.entity';
import { TempUploadService } from './temp-upload.service';
import { TempUploadController } from './temp-upload.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TemporaryPicture])],
    controllers: [TempUploadController],
    providers: [TempUploadService],
    exports: [TempUploadService],
})
export class TempUploadModule {}