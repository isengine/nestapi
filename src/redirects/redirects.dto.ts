import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/dto/common.dto';
import { ClientsDto } from '@src/clients/dto/clients.dto';

@InputType()
export class RedirectsDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Зарегистрированная ссылка для клиента',
  })
  @Field({ nullable: true })
  url: string;

  @ApiProperty({
    required: false,
    description: 'Данные клиента, связанного с этой записью',
  })
  @Field(() => ClientsDto, { nullable: true })
  clients?: ClientsDto;
}
