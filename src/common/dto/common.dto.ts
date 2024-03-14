import { ID, Field, InputType } from '@nestjs/graphql';

@InputType()
export class CommonDto {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
