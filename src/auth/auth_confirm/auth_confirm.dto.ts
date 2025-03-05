import { InputType } from '@nestjs/graphql';
import {
  DtoColumn,
  DtoCreatedColumn,
  DtoUpdatedColumn,
} from '@src/common/common.column';
import { ProtectedDto } from '@src/common/dto/protected.dto';

@InputType()
export class AuthConfirmDto extends ProtectedDto {
  @DtoCreatedColumn()
  createdAt?: Date;

  @DtoUpdatedColumn()
  updatedAt?: Date;

  @DtoColumn('Код подтверждения регистрации пользователя')
  code: string;

  @DtoColumn(
    'Тип кода: confirm - подтверждение регистрации, reset - сброс пароля',
  )
  type: string;
}
