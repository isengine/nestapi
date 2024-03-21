import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { RoomsDto } from '@src/rooms/rooms.dto';
import { CommonDto } from '@src/common/dto/common.dto';
import { UsersDto } from '@src/users/users.dto';

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
  })
  @Field(() => RoomsDto, { nullable: true })
  room?: RoomsDto;

  @ApiProperty({
    required: false,
    description: 'Данные пользователя, связанного с этим подключением',
  })
  @Field(() => UsersDto, { nullable: true })
  user?: UsersDto;
}
