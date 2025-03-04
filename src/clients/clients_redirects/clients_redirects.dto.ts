import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/common.dto';
import { ClientsDto } from '@src/clients/clients.dto';

@InputType()
export class ClientsRedirectsDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Дата и время создания записи, назначается автоматически',
  })
  @Field({ nullable: true })
  createdAt?: Date;

  @ApiProperty({
    required: false,
    description:
      'Дата и время последнего обновления записи, назначается автоматически',
  })
  @Field({ nullable: true })
  updatedAt?: Date;

  @ApiProperty({
    required: false,
    description: 'Зарегистрированная ссылка для клиента',
  })
  @Field({ nullable: true })
  uri: string;

  @ApiProperty({
    required: false,
    description: 'Данные клиента, связанного с этой записью',
    type: () => ClientsDto,
  })
  @Field(() => ClientsDto, { nullable: true })
  client?: ClientsDto;
}
