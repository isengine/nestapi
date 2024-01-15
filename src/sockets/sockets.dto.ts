import { Field, InputType } from '@nestjs/graphql';
import { RoomsDto } from '@src/rooms/rooms.dto';
import { CommonDto } from '@src/typeorm/dto/common.dto';
import { UsersDto } from '@src/users/users.dto';

@InputType()
export class SocketsDto extends CommonDto {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  data?: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => RoomsDto, { nullable: true })
  room?: RoomsDto;

  @Field(() => [String || Number], { nullable: true })
  roomId?: number;

  @Field(() => UsersDto, { nullable: true })
  user?: UsersDto;
}
