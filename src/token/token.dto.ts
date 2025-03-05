import { InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/common.dto';
import { DtoColumn } from '@src/common/common.column';

@InputType()
export class TokenDto extends CommonDto {
  @DtoColumn('Токен доступа')
  access_token?: string;

  @DtoColumn('Срок действия токена доступа')
  expires_in?: number;

  @DtoColumn('Токен обновления')
  refresh_token?: string;
}
