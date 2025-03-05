import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { DtoColumn } from '@src/common/common.column';
import { CommonDto } from '@src/common/common.dto';
import { RoomsDto } from '@src/rooms/rooms.dto';

@InputType()
export class SocketsDto extends CommonDto {
  @DtoColumn('Имя сокета')
  name?: string;

  @DtoColumn('Данные сокета')
  data?: string;

  @DtoColumn('Сообщение')
  message?: string;

  @ApiProperty({
    required: false,
    description: 'Данные комнаты, связанной с этим подключением',
    type: () => RoomsDto,
  })
  @Field(() => RoomsDto, { nullable: true })
  room?: RoomsDto;
}
