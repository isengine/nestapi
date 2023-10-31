import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GroupByDto {
  @Field({ nullable: true })
  field: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  sort?: string;
}
