import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/dto/common.dto';
import { TagsDto } from '@src/tags/tags.dto';
import { CategoriesDto } from '@src/categories/categories.dto';
import { UsersDto } from '@src/users/users.dto';

@InputType()
export class PostsDto extends CommonDto {
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

  @ApiProperty({
    required: false,
    description: 'Данные пользователя, связанного с данной записью',
  })
  @Field(() => UsersDto, { nullable: true })
  user?: UsersDto;
}
