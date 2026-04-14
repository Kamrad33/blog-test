import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { TemporaryPicture } from '../entities/temporary-picture.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TempUploadService {
    constructor(
        @InjectRepository(TemporaryPicture)
        private tempPicturesRepository: Repository<TemporaryPicture>,
    ) {}

    async saveTempFile(file: Express.Multer.File, userId: number): Promise<string> {
        const ext = path.extname(file.originalname);
        const filename = `temp_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
        const uploadDir = (process.env.UPLOAD_DIR || './uploads/') + (process.env.PICS_DIR || '/pics');

        // TODO нужен отдельный сервис загрузки файлов в воркерах
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const filepath = path.join(uploadDir, filename);

        await fs.writeFile(filepath, file.buffer, () => {}); // TODO вынести в воркер с асинхронщиной

        const url = `${uploadDir}/${filename}`;

        const tempPic = this.tempPicturesRepository.create({
            url,
            userId,
            isUsed: false,
        });

        await this.tempPicturesRepository.save(tempPic);

        return url;
    }

    async markAsUsed(url: string): Promise<void> {
        await this.tempPicturesRepository.update({ url }, { isUsed: true });
    }

    async markAsUnused(url: string): Promise<void> {
        await this.tempPicturesRepository.update({ url }, { isUsed: false });
    }

    async findByUrl(url: string): Promise<TemporaryPicture | null> {
        return this.tempPicturesRepository.findOne({ where: { url } });
    }

    // cron для очистки неиспользуемых картинок
    @Cron(CronExpression.EVERY_DAY_AT_2AM) // каждую ночь в 2 часа
    async cleanupUnusedTempImages() {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 часа

        const unused = await this.tempPicturesRepository.find({
            where: { isUsed: false, createdAt: LessThan(cutoff) },
        });

        for (const pic of unused) {
            const filePath = path.join(process.cwd(), pic.url);

            if (fs.existsSync(filePath)) fs.unlink(filePath, () => {});

            await this.tempPicturesRepository.delete(pic.id);
        }

        console.log(`Cleaned up ${unused.length} unused temp images`);
    }
}