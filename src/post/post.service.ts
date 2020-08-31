import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './entities';
import { CreatePostDto, EditPostDto } from './dtos';
import { User } from 'src/user/entities';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getMany() {
    return await this.postRepository.find();
  }

  async getById(id: number, author?: User) {
    const post = await this.postRepository
      .findOne(id)
      .then(p => (!author ? p : !!p && author.id === p.author.id ? p : null));
    if (!post)
      throw new NotFoundException('Post does not exist or unauthorized');
    return post;
  }

  async createOne(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({ ...dto, author });
    return await this.postRepository.save(post);
  }

  async editOne(id: number, dto: EditPostDto, author?: User) {
    const post = await this.getById(id, author);
    const editedPost = Object.assign(post, dto);
    return await this.postRepository.save(editedPost);
  }

  async deleteOne(id: number, author?: User) {
    const post = await this.getById(id, author);
    return await this.postRepository.remove(post);
  }
}
