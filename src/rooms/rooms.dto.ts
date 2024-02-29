import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/typeorm/dto/common.dto';

@InputType()
export class RoomsDto extends CommonDto {
  @Field({ nullable: true })
  title?: string;
}