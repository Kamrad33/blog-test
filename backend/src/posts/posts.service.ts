import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Picture } from '../entities/picture.entity';
import { TempUploadService } from '../temp-upload/temp-upload.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PicturesService } from 'src/pictures/pictures.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
        @InjectRepository(Picture)
        private picturesRepository: Repository<Picture>,
        private tempUploadService: TempUploadService,
        private picturesService: PicturesService,
    ) {}

    async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
        const { content } = createPostDto;
        // Сохраняем пост (пока без картинок)
        const post = this.postsRepository.create({
            userId,
            content,
            isShown: true,
        });

        const savedPost = await this.postsRepository.save(post);

        // Парсим content, находим все URL временных картинок
        const tempUrls = this.extractTempUrls(content);

        for (const url of tempUrls) {
            // Находим запись во временной таблице
            const tempPic = await this.tempUploadService.findByUrl(url); // нужно добавить метод в TempUploadService

            if (tempPic && !tempPic.isUsed) {
                // Создаём постоянную картинку
                    const picture = this.picturesRepository.create({
                    url,
                    postId: savedPost.id,
                    order: 0,
                });

                await this.picturesRepository.save(picture);

                // Помечаем временную как использованную
                await this.tempUploadService.markAsUsed(url);
            }
        }
        return savedPost;
    }

    async findAll(userId: number, limit: number = 10, offset: number = 0, sort: 'ASC' | 'DESC' = 'DESC'): Promise<Post[]> {
        return this.postsRepository.find({
            where: { userId, deletedAt: undefined },
            order: { createdAt: sort },
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: number, userId: number): Promise<Post> {
        const post = await this.postsRepository.findOne({
            where: { id, userId, deletedAt: undefined },
            relations: ['pictures'],
        });

        if (!post) throw new NotFoundException('Post not found');

        return post;
    }

    async update(id: number, userId: number, updatePostDto: UpdatePostDto): Promise<Post> {
        const post = await this.findOne(id, userId);
        const oldContent = post.content;
        const newContent = updatePostDto.content;

        if (!newContent) return post;

        // 1. Найти старые и новые URL картинок
        const oldUrls = this.extractImageUrls(oldContent);
        const newUrls = this.extractImageUrls(newContent);

        // 2. Удалить картинки, которых нет в новом контенте
        const toRemove = oldUrls.filter(url => !newUrls.includes(url));
        for (const url of toRemove) {
            // Удаляем из pictures (если это постоянная картинка)
            await this.picturesService.deleteByUrl(url);
        }

        // 3. Обработать новые временные картинки (которые не были в старом посте)
        const potentialTempUrls = newUrls.filter(url => url.includes('/uploads/temp/'));

        for (const url of potentialTempUrls) {
            const tempPic = await this.tempUploadService.findByUrl(url);

            if (tempPic && !tempPic.isUsed) {
                // Переносим в pictures
                await this.picturesService.create({
                    url,
                    postId: post.id,
                    // userId: null,
                    order: 0,
                });
                await this.tempUploadService.markAsUsed(url);
            }
        }

        // 4. Обновить текст поста
        post.content = newContent;

        await this.postsRepository.save(post);

        return post;
    }

    async remove(id: number, userId: number): Promise<void> {
        const post = await this.findOne(id, userId);

        // Получить все картинки поста
        const pictures = await this.picturesRepository.find({ where: { postId: post.id } });

        for (const pic of pictures) {
            const filePath = path.join(process.cwd(), pic.url);

            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            await this.picturesRepository.delete(pic.id);
        }
        post.deletedAt = new Date();

        await this.postsRepository.save(post);
    }

    private extractTempUrls(content: string): string[] {
        const regex = /https?:\/\/[^\s"']+?\/uploads\/temp\/[^\s"')]+/g;
        const matches = content.match(regex);

        return matches ? [...new Set(matches)] : [];
    }

    private extractImageUrls(html: string): string[] {
        const regex = /https?:\/\/[^\s"']+?\/uploads\/(?:temp|avatars|posts)\/[^\s"')]+/g;
        const matches = html.match(regex);

        return matches ? [...new Set(matches)] : [];
    }
}