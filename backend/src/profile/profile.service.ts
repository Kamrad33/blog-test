import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Picture } from 'src/entities/picture.entity';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        @InjectRepository(Picture)
        private picturesRepository: Repository<Picture>,
    ) {}

    async findById(userId: number): Promise<User & { avatarUrl?: string }> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user) throw new NotFoundException('User not found');
        
        let avatarUrl: string | undefined;

        if (user.avatarPicId) {
            const picture = await this.picturesRepository.findOne({ where: { id: user.avatarPicId } });
            avatarUrl = picture?.url;
        }
        
        return { ...user, avatarUrl };
    }

    async update(userId: number, updateDto: UpdateProfileDto): Promise<User> {
        await this.usersRepository.update(userId, updateDto);

        return this.findById(userId);
    }

    async updateAvatar(userId: number, pictureId: number): Promise<User> {
        await this.usersRepository.update(userId, { avatarPicId: pictureId });

        return this.findById(userId);
    }
}