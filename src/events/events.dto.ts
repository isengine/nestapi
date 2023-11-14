import { Field, InputType } from '@nestjs/graphql';
import { EventsThemesDto } from '@src/events.themes/events.themes.dto';
import { CommonDto } from '@src/typeorm/dto/common.dto';
import { UsersDto } from '@src/users/users.dto';

@InputType()
export class EventsDto extends CommonDto {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  data?: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => EventsThemesDto, { nullable: true })
  theme?: EventsThemesDto;

  @Field(() => [String || Number], { nullable: true })
  themeId?: number;

  @Field(() => UsersDto, { nullable: true })
  user?: UsersDto;
}
