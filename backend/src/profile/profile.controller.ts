import { Controller, Get, Patch, Post, Body, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadService } from '../upload/upload.service'; // создадим позже
import { Multer } from 'multer';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(
        private profileService: ProfileService,
        private uploadService: UploadService, // для аватара
    ) {}

    @Get()
    async getProfile(@Request() req) {
        const userId = req.user.userId;

        return this.profileService.findById(userId);
    }

    @Patch()
    async updateProfile(@Request() req, @Body() updateDto: UpdateProfileDto) {
        const userId = req.user.userId;

        return this.profileService.update(userId, updateDto);
    }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
        const userId = req.user.userId;

        const pictureId = await this.uploadService.saveAvatar(file, userId);
        const user = await this.profileService.updateAvatar(userId, pictureId);

        return { avatarUrl: user.avatarPicId };
    }
}