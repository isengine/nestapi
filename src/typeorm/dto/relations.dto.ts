import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RelationsDto {
  @Field()
  name?: string;

  @Field({ nullable: true, defaultValue: 'id' })
  order?: string;

  @Field({ nullable: true, defaultValue: false })
  desc?: boolean;
}
