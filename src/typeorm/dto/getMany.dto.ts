import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetManyDto {
  @Field(() => [Number || String])
  ids: Array<number | string>;
}
