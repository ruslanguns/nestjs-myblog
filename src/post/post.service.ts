import { Injectable } from '@nestjs/common';
import { CreatePostDto, EditPostDto } from './dtos';

@Injectable()
export class PostService {

  async getMany() {
    return await [];
  }

  async getById(id: number) {
    return await id;
  }

  async createOne(dto: CreatePostDto) {
    return await { ...dto }
  }

  async editOne(id: number, dto: EditPostDto) {
    return await {
      id, ...dto
    }
  }

  async deleteOne(id: number) {
    return await { id }
  }


}
