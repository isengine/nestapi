import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SearchDto {
  @Field({ nullable: true })
  string?: string;

  @Field(() => [String], { nullable: true })
  array?: Array<string>;

  @Field(() => [String])
  fields: Array<string>;
}
