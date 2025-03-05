import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { DtoColumn } from '@src/common/common.column';
import { CommonDto } from '@src/common/common.dto';
import { SocketsDto } from '@src/sockets/sockets.dto';

@InputType()
export class RoomsDto extends CommonDto {
  @DtoColumn('Название комнаты')
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Данные сокетов, связанных с данной комнатой',
    type: () => [SocketsDto],
  })
  @Field(() => [SocketsDto], { nullable: true })
  sockets?: SocketsDto[];
}
