import { InputType } from '@nestjs/graphql';
import { DtoColumn, DtoEnumColumn } from '@src/common/common.column';
import { CommonDto } from '@src/common/common.dto';
import { TypeGrants } from '@src/common/common.enum';

@InputType()
export class GrantsTokenDto extends CommonDto {
  @DtoEnumColumn(
    'Тип гранта. Один из password, refresh_token, authorization_code, client_credentials',
    TypeGrants,
    { required: true },
  )
  grant_type: TypeGrants;

  @DtoColumn('ID клиентского приложения')
  client_id?: string;

  @DtoColumn('Секретный ключ клиентского приложения')
  client_secret?: string;

  @DtoColumn('Пароль приложения')
  client_password?: string;

  @DtoColumn('Имя пользователя')
  username?: string;

  @DtoColumn('Пароль пользователя')
  password?: string;

  @DtoColumn('Токен обновления')
  refresh_token?: string;

  @DtoColumn('Код авторизации')
  code?: string;

  @DtoColumn(
    'Ключ для беспарольного доступа, сгенерированный как хэш от chatId',
  )
  key?: string;

  @DtoColumn('Url перенаправления после авторизации')
  redirect_uri?: string;

  @DtoColumn('Состояние, используется для защиты от CSRF')
  state?: string;
}
