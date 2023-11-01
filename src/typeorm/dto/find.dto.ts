import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindDto {
  @Field({ nullable: true })
  order?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  limit?: number;

  @Field({ nullable: true })
  page?: number;
}
