import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './entities';
import { PostSubscriber } from './entities/post.subscriber';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    LoggerModule
  ],
  controllers: [PostController],
  providers: [PostService, PostSubscriber],
})
export class PostModule {}
