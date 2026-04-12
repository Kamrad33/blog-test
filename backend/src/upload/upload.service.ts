import { Injectable } from '@nestjs/common';
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
        const uploadDir = process.env.UPLOAD_DIR || './uploads/avatars';

        // TODO нужен отдельный сервис загрузки файлов в воркерах
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, file.buffer);

        // Сохраняем запись в pictures
        const picture = this.picturesRepository.create({
            url: `/uploads/avatars/${filename}`,
            userId: userId,
            order: 0,
        });

        const saved = await this.picturesRepository.save(picture);

        return saved.id;
    }
}