import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/typeorm/dto/common.dto';
import { TypeClients } from '@src/clients/clients.enum';
import { AuthDto } from '@src/auth/auth.dto';

@InputType()
export class ClientsDto extends CommonDto {
  @Field({ nullable: true })
  client_id: string;

  @Field({ nullable: true })
  client_secret: string;

  @Field({ nullable: true })
  client_password: string;

  @Field(() => TypeClients, {
    nullable: true,
    defaultValue: TypeClients.DEFAULT,
  })
  client_type?: TypeClients;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  client_uri: string;

  @Field({ nullable: true })
  redirect_uri: string;

  @Field({ nullable: true })
  code: string;

  @Field({ nullable: true })
  publishedAt: Date;

  @Field({ nullable: true })
  isPublished: boolean;

  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;

  @Field({ nullable: true })
  authId?: number;
}
