import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostService } from './post.service';
import { CreatePostDto, EditPostDto } from './dtos';

@ApiTags('Posts')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getMany() {
    const data = await this.postService.getMany();
    return { data };
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.postService.getById(id);
    return { data };
  }

  @Post()
  async createPost(@Body() dto: CreatePostDto) {
    const data = await this.postService.createOne(dto);
    return { message: 'Post created', data };
  }

  @Put(':id')
  async editOne(@Param('id') id: number, @Body() dto: EditPostDto) {
    const data = await this.postService.editOne(id, dto);
    return { message: 'Post edited', data };
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number) {
    const data = await this.postService.deleteOne(id);
    return { message: 'Post deleted', data };
  }
}
