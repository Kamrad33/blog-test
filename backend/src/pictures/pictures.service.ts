import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Picture } from '../entities/picture.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PicturesService {
    constructor(
        @InjectRepository(Picture)
        private picturesRepository: Repository<Picture>,
    ) {}

    async create(data: Partial<Picture>): Promise<Picture> {
        const picture = this.picturesRepository.create(data);

        return this.picturesRepository.save(picture);
    }

    async findById(id: number): Promise<Picture | null> {
        return this.picturesRepository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.picturesRepository.delete(id);
    }

    async deleteByUrl(url: string): Promise<void> {
        const picture = await this.picturesRepository.findOne({ where: { url } });

        if (picture) {
            // Удаляем файл
            const filePath = path.join(process.cwd(), picture.url);

            if (fs.existsSync(filePath)) fs.unlink(filePath, () => {});
            
            await this.picturesRepository.delete(picture.id);
        }
    }
}