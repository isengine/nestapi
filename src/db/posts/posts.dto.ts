import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ProtectedDto } from '@src/common/dto/protected.dto';
import { PostsCategoriesDto } from './posts_categories/posts_categories.dto';
import { PostsTagsDto } from './posts_tags/posts_tags.dto';

@InputType()
export class PostsDto extends ProtectedDto {
  @ApiProperty({
    required: false,
    description: 'Дата и время создания записи, назначается автоматически',
  })
  @Field({ nullable: true })
  createdAt?: Date;

  @ApiProperty({
    required: false,
    description:
      'Дата и время последнего обновления записи, назначается автоматически',
  })
  @Field({ nullable: true })
  updatedAt?: Date;

  @ApiProperty({
    required: false,
    description: 'Заголовок',
  })
  @Field({ nullable: true })
  title: string;

  @ApiProperty({
    required: false,
    description: 'Содержимое',
  })
  @Field({ nullable: true })
  content: string;

  @ApiProperty({
    required: false,
    description: 'Дата публикации, начиная с которой запись будет видна',
  })
  @Field({ nullable: true })
  publishedAt: Date;

  @ApiProperty({
    required: false,
    description: 'Флаг публикации, отключение может сделать запись недоступной',
  })
  @Field({ nullable: true })
  isPublished: boolean;

  @ApiProperty({
    required: false,
    description: 'Данные категории, связанной с данной записью',
    type: () => PostsCategoriesDto,
  })
  @Field(() => PostsCategoriesDto, { nullable: true })
  category?: PostsCategoriesDto;

  @ApiProperty({
    required: false,
    description: 'Данные тегов, связанных с данной записью',
    type: () => [PostsTagsDto],
  })
  @Field(() => [PostsTagsDto], { nullable: true })
  tags?: PostsTagsDto[];
}
