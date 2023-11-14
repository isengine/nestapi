import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/typeorm/dto/common.dto';

@InputType()
export class EventsThemesDto extends CommonDto {
  @Field({ nullable: true })
  title?: string;
}
