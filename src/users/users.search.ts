import { Field, ObjectType } from '@nestjs/graphql';
import { UsersEntity } from '@src/users/users.entity';

@ObjectType()
export class UsersSearch {
  @Field({ nullable: true })
  name?: string;

  @Field(() => [UsersEntity], { nullable: true })
  children?: UsersEntity[];
}
