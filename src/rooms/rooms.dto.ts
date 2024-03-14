import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/dto/common.dto';

@InputType()
export class RoomsDto extends CommonDto {
  @Field({ nullable: true })
  title?: string;
}
