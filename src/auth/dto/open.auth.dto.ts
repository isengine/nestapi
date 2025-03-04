import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/common.dto';
import { TypeResponses } from '@src/common/common.enum';

@InputType()
export class OpenAuthDto extends CommonDto {
  @ApiProperty({
    required: true,
    description: 'Тип запроса. Один из token или code',
  })
  @Field(() => TypeResponses)
  response_type: TypeResponses;

  @ApiProperty({
    required: false,
    description: 'ID клиентского приложения',
  })
  @Field()
  client_id: string;

  @ApiProperty({
    required: false,
    description: 'Url перенаправления после авторизации',
  })
  @Field()
  redirect_uri: string;

  @ApiProperty({
    required: false,
    description: 'Состояние, используется для защиты от CSRF',
  })
  @Field()
  state: string;
}
