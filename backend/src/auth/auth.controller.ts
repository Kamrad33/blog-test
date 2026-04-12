import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: { login: string; password: string }) {
        const user = await this.authService.validateUser(body.login, body.password);

        if (!user) throw new UnauthorizedException('Invalid credentials');

        return this.authService.login(user);
    }
}