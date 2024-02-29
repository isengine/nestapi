import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/typeorm/dto/common.dto';

@InputType()
export class ClientsDto extends CommonDto {
  @Field({ nullable: true })
  client_id: string;

  @Field({ nullable: true })
  client_secret: string;
  
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  clientUri: string;

  @Field({ nullable: true })
  redirectUri: string;

  @Field({ nullable: true })
  publishedAt: Date;

  @Field({ nullable: true })
  isPublished: boolean;
}
