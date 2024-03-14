import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class SearchDto {
  @Field({ nullable: true })
  string?: string;

  @Field(() => [String], { nullable: true })
  array?: Array<string>;

  @Field(() => [String])
  fields: Array<string>;

  @Field(() => GraphQLJSONObject, { nullable: true })
  where?: object;
}
