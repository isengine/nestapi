import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ClosedDto } from '@src/common/dto/closed.dto';
import { PostsDto } from '@src/posts/posts.dto';

@InputType()
export class TagsDto extends ClosedDto {
  @ApiProperty({
    required: false,
    description: 'Название тега',
  })
  @Field({ nullable: true })
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Массив данных постов, связанных с этим тегом',
  })
  @Field(() => [PostsDto], { nullable: true })
  posts?: PostsDto[];
}
