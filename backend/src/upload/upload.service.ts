import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Picture } from '../entities/picture.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(Picture)
        private picturesRepository: Repository<Picture>,
    ) {}

    async saveAvatar(file: Express.Multer.File, userId: number): Promise<number> {
        const ext = path.extname(file.originalname);
        const filename = `avatar_${userId}_${Date.now()}${ext}`;
        const uploadDir = (process.env.UPLOAD_DIR || './uploads/') + (process.env.AVATARS_DIR || '/avatars');

        // TODO нужен отдельный сервис загрузки файлов в воркерах
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const filepath = path.join(uploadDir, filename);
        await fs.writeFile(filepath, file.buffer, () => {}); // TODO вынести в воркер с асинхронщиной

        const url = `${uploadDir}/${filename}`;

        const picture = this.picturesRepository.create({
            url,
            userId: userId,
            order: 0,
        });

        const saved = await this.picturesRepository.save(picture);

        return saved.id;
    }

    async getPictureById(id: number): Promise<Picture> {
        const picture = await this.picturesRepository.findOne({ where: { id } });

        if (!picture) throw new NotFoundException('Picture not found');

        return picture;
    }
}