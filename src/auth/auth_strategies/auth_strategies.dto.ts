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
export class AuthStrategiesDto extends CommonDto {
  @DtoCreatedColumn()
  createdAt?: Date;

  @DtoUpdatedColumn()
  updatedAt?: Date;

  @DtoColumn(
    'Название стратегии OAuth 2.0, реализованной через библиотеку passport.js',
  )
  name?: string;

  @DtoColumn('ID пользователя на сервере OAuth 2.0')
  uid?: string;

  @DtoColumn('Данные пользователя с сервера OAuth 2.0')
  json?: string;

  @DtoColumn('Токен доступа для аккаунта сервера OAuth 2.0')
  accessToken?: string;

  @DtoColumn('Токен обновления для аккаунта сервера OAuth 2.0')
  refreshToken?: string;

  @ApiProperty({
    required: false,
    description: 'Данные авторизации, связанной с этой записью',
    type: () => AuthDto,
  })
  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;
}
