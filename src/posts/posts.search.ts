import { Field, ObjectType } from '@nestjs/graphql';
import { PostsEntity } from '@src/posts/posts.entity';

@ObjectType()
export class PostsSearch {
  @Field({ nullable: true })
  name?: string;

  @Field(() => [PostsEntity], { nullable: true })
  children?: PostsEntity[];
}
