import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/dto/common.dto';
import { PostsDto } from '@src/posts/posts.dto';

@InputType()
export class CategoriesDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Название категории',
  })
  @Field({ nullable: true })
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Данные записей posts, входящих в данную категорию',
  })
  @Field(() => [PostsDto], { nullable: true })
  posts?: PostsDto[];
}
