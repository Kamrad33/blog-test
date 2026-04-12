import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
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

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email }});
    }

    async findOneById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(createUserDto)

        return this.usersRepository.save(user);
    }

      async findAll(): Promise<Partial<User>[]> {
        const users = await this.usersRepository.find({
            select: ['id', 'login', 'firstName', 'lastName', 'avatarPicId'], // только нужные поля
        });

        return users;
    }
}