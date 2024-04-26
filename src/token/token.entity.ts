import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@ObjectType()
@Entity({ name: 'token' })
export class TokenEntity {
  @Field({ nullable: true })
  access_token: string;

  @Field({ nullable: true })
  expires_in: number;

  @Field({ nullable: true })
  refresh_token: string;
}
