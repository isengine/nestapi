import { Field, ObjectType } from '@nestjs/graphql';
import { PostsEntity } from '@src/posts/posts.entity';

@ObjectType()
export class PostsGroup {
  @Field({ nullable: true })
  name?: string;

  @Field(() => [PostsEntity], { nullable: true })
  children?: PostsEntity[];
}
