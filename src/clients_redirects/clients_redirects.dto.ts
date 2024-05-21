import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/common.dto';
import { ClientsDto } from '@src/clients/clients.dto';

@InputType()
export class ClientsRedirectsDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Зарегистрированная ссылка для клиента',
  })
  @Field({ nullable: true })
  uri: string;

  @ApiProperty({
    required: false,
    description: 'Данные клиента, связанного с этой записью',
  })
  @Field(() => ClientsDto, { nullable: true })
  client?: ClientsDto;
}
