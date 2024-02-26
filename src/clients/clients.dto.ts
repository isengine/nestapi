import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/typeorm/dto/common.dto';

@InputType()
export class ClientsDto extends CommonDto {
  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  content: string;

  @Field({ nullable: true })
  publishedAt: Date;

  @Field({ nullable: true })
  isPublished: boolean;
}
