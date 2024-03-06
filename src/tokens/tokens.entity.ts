import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@ObjectType()
@Entity({ name: 'tokens' })
export class TokensEntity {
  @Field({ nullable: true })
  access_token: string;

  @Field({ nullable: true })
  expires_in: number;

  @Field({ nullable: true })
  refresh_token: string;
}
