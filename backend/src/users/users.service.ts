import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findOneByLogin(login: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { login } });
    }

    async findOneById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(createUserDto)

        return this.usersRepository.save(user);
    }
}