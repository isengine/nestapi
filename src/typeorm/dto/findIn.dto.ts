import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindInDto {
  @Field({ nullable: true })
  string?: string;

  @Field(() => [String], { nullable: true })
  array?: Array<string>;

  @Field(() => [String])
  fields: Array<string>;
}
