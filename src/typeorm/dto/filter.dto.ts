import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterDto {
  @Field({ nullable: true })
  order?: string;

  @Field({ nullable: true })
  desc?: boolean;

  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  limit?: number;

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  group?: string;

  @Field({ nullable: true })
  type?: string;
}
