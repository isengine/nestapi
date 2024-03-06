import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/typeorm/dto/common.dto';
import { GrantTypeClients } from '@src/clients/clients.enum';

@InputType()
export class TokenClientsDto extends CommonDto {
  @Field(() => GrantTypeClients)
  grant_type: GrantTypeClients;

  @Field({ nullable: true })
  client_id?: string;

  @Field({ nullable: true })
  client_secret?: string;

  @Field({ nullable: true })
  client_password?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  refresh_token?: string;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  redirect_uri?: string;

  @Field({ nullable: true })
  state?: string;
}
