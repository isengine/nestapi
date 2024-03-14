import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/dto/common.dto';
import { PostsDto } from '@src/posts/posts.dto';

@InputType()
export class TagsDto extends CommonDto {
  @Field({ nullable: true })
  title?: string;

  @Field(() => [PostsDto], { nullable: true })
  posts?: PostsDto[];
}
