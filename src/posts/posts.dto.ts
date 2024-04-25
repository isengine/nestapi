import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ProtectedDto } from '@src/common/dto/protected.dto';
import { TagsDto } from '@src/tags/tags.dto';
import { CategoriesDto } from '@src/categories/categories.dto';

@InputType()
export class PostsDto extends ProtectedDto {
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
  })
  @Field(() => CategoriesDto, { nullable: true })
  category?: CategoriesDto;

  @ApiProperty({
    required: false,
    description: 'Данные тегов, связанных с данной записью',
  })
  @Field(() => [TagsDto], { nullable: true })
  tags?: TagsDto[];
}
