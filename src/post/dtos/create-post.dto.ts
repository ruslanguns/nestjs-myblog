import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { EnumToString } from '../../helpers/enumToString';
import { PostCategory } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  excerpt: string;

  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(PostCategory, {
    message: `Invalid option. Valids options are ${EnumToString(PostCategory)}`,
  })
  category: string;

  @IsString({ each: true })
  @IsArray()
  tags: string[];

  @IsBoolean()
  status: boolean;
}
