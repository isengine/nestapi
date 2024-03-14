import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/dto/common.dto';
import { ResponseTypeClients } from '@src/clients/clients.enum';

@InputType()
export class AuthClientsDto extends CommonDto {
  @Field(() => ResponseTypeClients)
  response_type: ResponseTypeClients;

  @Field()
  client_id: string;

  @Field()
  redirect_uri: string;

  @Field()
  state: string;
}
