import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UploadService } from 'src/upload/upload.service';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private uploadService: UploadService,
        private profileSerivce: ProfileService,
    ) {}

    async validateUser(login: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByLogin(login);

        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;

            return result;
        }

        return null;
    }

    async login(user: any) {
        const payload = { sub: user.id, login: user.login };

        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }

    async register(registerDto: RegisterDto, file?: Express.Multer.File) {
        const {
            login,
            password,
            email,
            ...registerData
        } = registerDto;

        const isLoginExist = await this.usersService.findOneByLogin(login);

        if (isLoginExist) throw new UnauthorizedException('Login already exists');

        const isEmailExist = await this.usersService.findOneByLogin(email);
    
        if (isEmailExist) throw new UnauthorizedException('Email already exists');

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser: CreateUserDto = {
            login,
            passwordHash,
            email,
            ...registerData,
        }

        const user = await this.usersService.create(newUser);

        if (file) {
            const pictureId = await this.uploadService.saveAvatar(file, user.id);
            await this.profileSerivce.updateAvatar(user.id, pictureId);
        }

        return this.login(user);
    }
}