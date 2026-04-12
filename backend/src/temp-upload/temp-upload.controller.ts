import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TempUploadService } from './temp-upload.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class TempUploadController {
    constructor(private tempUploadService: TempUploadService) {}

    @Post('temp')
    @UseInterceptors(FileInterceptor('image'))
    async uploadTemp(@Request() req, @UploadedFile() file: Express.Multer.File) {
        const userId = req.user.userId;
        const url = await this.tempUploadService.saveTempFile(file, userId);

        return { url };
    }
}