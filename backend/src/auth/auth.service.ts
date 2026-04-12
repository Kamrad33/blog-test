import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
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

    async register(registerDto: RegisterDto) {
        const {
            login,
            password,
            ...registerData
        } = registerDto;

        const isExist = await this.usersService.findOneByLogin(login);

        if (isExist) throw new UnauthorizedException('Login already exists');

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser: CreateUserDto = {
            login,
            passwordHash,
            ...registerData,
        }
        const user = await this.usersService.create(newUser);

        return this.login(user);
    }
}