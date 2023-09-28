import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindInDto {
  @Field({ nullable: true })
  string?: string;

  @Field(() => [String])
  array: Array<string>;
}
