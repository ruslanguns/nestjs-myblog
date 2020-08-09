import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsString } from 'class-validator';


export class EditPostDto extends PartialType(
  OmitType(
    CreatePostDto,
    ['slug'] as const
  )
) {}