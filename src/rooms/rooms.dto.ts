import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/common.dto';
import { SocketsDto } from '@src/sockets/sockets.dto';

@InputType()
export class RoomsDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Название комнаты',
  })
  @Field({ nullable: true })
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Данные сокетов, связанных с данной комнатой',
    type: () => [SocketsDto],
  })
  @Field(() => [SocketsDto], { nullable: true })
  sockets?: SocketsDto[];
}
