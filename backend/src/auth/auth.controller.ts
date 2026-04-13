import { Controller, Post, Body, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('register')
    @UseInterceptors(FileInterceptor('avatar'))
    async register(
        @Body() body: RegisterDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.authService.register(body, file);
    }

    @Post('login')
    async login(@Body() body: { login: string; password: string }) {
        const user = await this.authService.validateUser(body.login, body.password);

        if (!user) throw new UnauthorizedException('Invalid credentials');

        return this.authService.login(user);
    }

    @Post('refresh')
    async refresh(@Body('refresh_token') refreshToken: string) {
        return this.authService.refresh(refreshToken);
    }
}