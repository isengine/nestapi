import { InputType } from '@nestjs/graphql';
import { DtoColumn, DtoEnumColumn } from '@src/common/common.column';
import { CommonDto } from '@src/common/common.dto';
import { TypeResponses } from '@src/common/common.enum';

@InputType()
export class OpenAuthDto extends CommonDto {
  @DtoEnumColumn('Тип запроса. Один из token или code', TypeResponses, {
    required: true,
  })
  response_type: TypeResponses;

  @DtoColumn('ID клиентского приложения')
  client_id: string;

  @DtoColumn('Url перенаправления после авторизации')
  redirect_uri: string;

  @DtoColumn('Состояние, используется для защиты от CSRF')
  state: string;
}
