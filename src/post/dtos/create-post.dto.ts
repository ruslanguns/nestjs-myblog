import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEnum,
  IsArray,
  IsOptional,
} from 'class-validator';
import { EnumToString } from '../../common/helpers/enumToString';
import { PostCategory } from '../enums';

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

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
