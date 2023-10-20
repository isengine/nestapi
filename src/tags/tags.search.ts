import { Field, ObjectType } from '@nestjs/graphql';
import { TagsEntity } from '@src/tags/tags.entity';

@ObjectType()
export class TagsSearch {
  @Field({ nullable: true })
  name?: string;

  @Field(() => [TagsEntity], { nullable: true })
  children?: TagsEntity[];
}
