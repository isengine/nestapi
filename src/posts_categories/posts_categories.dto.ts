import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ClosedDto } from '@src/common/dto/closed.dto';
import { PostsDto } from '@src/posts/posts.dto';

@InputType()
export class PostsCategoriesDto extends ClosedDto {
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
