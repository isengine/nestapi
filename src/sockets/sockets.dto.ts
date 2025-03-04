import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/common.dto';
import { RoomsDto } from '@src/rooms/rooms.dto';

@InputType()
export class SocketsDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Имя сокета',
  })
  @Field({ nullable: true })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Данные сокета',
  })
  @Field({ nullable: true })
  data?: string;

  @ApiProperty({
    required: false,
    description: 'Сообщение',
  })
  @Field({ nullable: true })
  message?: string;

  @ApiProperty({
    required: false,
    description: 'Данные комнаты, связанной с этим подключением',
    type: () => RoomsDto,
  })
  @Field(() => RoomsDto, { nullable: true })
  room?: RoomsDto;
}
