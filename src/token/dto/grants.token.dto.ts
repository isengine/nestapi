import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/common.dto';
import { TypeGrants } from '@src/common/common.enum';

@InputType()
export class GrantsTokenDto extends CommonDto {
  @ApiProperty({
    required: true,
    description:
      'Тип гранта. Один из password, refresh_token, authorization_code, client_credentials',
  })
  @Field(() => TypeGrants)
  grant_type: TypeGrants;

  @ApiProperty({
    required: false,
    description: 'ID клиентского приложения',
  })
  @Field({ nullable: true })
  client_id?: string;

  @ApiProperty({
    required: false,
    description: 'Секретный ключ клиентского приложения',
  })
  @Field({ nullable: true })
  client_secret?: string;

  @ApiProperty({
    required: false,
    description: 'Пароль приложения',
  })
  @Field({ nullable: true })
  client_password?: string;

  @ApiProperty({
    required: false,
    description: 'Имя пользователя',
  })
  @Field({ nullable: true })
  username?: string;

  @ApiProperty({
    required: false,
    description: 'Пароль пользователя',
  })
  @Field({ nullable: true })
  password?: string;

  @ApiProperty({
    required: false,
    description: 'Токен обновления',
  })
  @Field({ nullable: true })
  refresh_token?: string;

  @ApiProperty({
    required: false,
    description: 'Код авторизации',
  })
  @Field({ nullable: true })
  code?: string;

  @ApiProperty({
    required: false,
    description:
      'Ключ для беспарольного доступа, сгенерированный как хэш от chatId',
  })
  @Field({ nullable: true })
  key?: string;

  @ApiProperty({
    required: false,
    description: 'Url перенаправления после авторизации',
  })
  @Field({ nullable: true })
  redirect_uri?: string;

  @ApiProperty({
    required: false,
    description: 'Состояние, используется для защиты от CSRF',
  })
  @Field({ nullable: true })
  state?: string;
}
