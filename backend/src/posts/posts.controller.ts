import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private postsService: PostsService) {}

    @Post()
    create(@Request() req, @Body() createPostDto: CreatePostDto) {
        const userId = req.user.userId;

        return this.postsService.create(userId, createPostDto);
    }

    @Get()
    findAll(
        @Request() req,
        @Query('limit') limit = 10,
        @Query('offset') offset = 0,
        @Query('sort') sort: 'ASC' | 'DESC' = 'DESC', // транслит чтобы убрать упоминания SQL
    ) {
        const userId = req.user.userId;

        return this.postsService.findAll(userId, +limit, +offset, sort);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        const userId = req.user.userId;

        return this.postsService.findOne(+id, userId);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        const userId = req.user.userId;

        return this.postsService.update(+id, userId, updatePostDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        const userId = req.user.userId;

        return this.postsService.remove(+id, userId);
    }
}