import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  DtoColumn,
  DtoCreatedColumn,
  DtoUpdatedColumn,
} from '@src/common/common.column';
import { CommonDto } from '@src/common/common.dto';
import { AuthDto } from '../auth.dto';

@InputType()
export class AuthSessionsDto extends CommonDto {
  @DtoCreatedColumn()
  createdAt?: Date;

  @DtoUpdatedColumn()
  updatedAt?: Date;

  @DtoColumn('Поле с описанием или комментариями к этой записи')
  description?: string;

  @DtoColumn('IP-адрес пользователя')
  ip?: string;

  @DtoColumn('Агент (браузер) пользователя')
  userAgent?: string;

  @DtoColumn('Ссылка, по которой была открыта сессия')
  referrer?: string;

  @DtoColumn('Метод, по которому была открыта сессия')
  method?: string;

  @DtoColumn('Текущая языковая локаль пользователя')
  locale?: string;

  @DtoColumn('Временная зона, формат +/-00:00')
  timezone?: string;

  @ApiProperty({
    required: false,
    description: 'Данные auth записи, связанной с этой сессией',
    type: () => AuthDto,
  })
  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;
}
