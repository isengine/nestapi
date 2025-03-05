import { IsEmail, IsString, MinLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  DtoColumn,
  DtoCreatedColumn,
  DtoUpdatedColumn,
} from '@src/common/common.column';
import { CommonDto } from '@src/common/common.dto';
import { AuthSessionsDto } from './auth_sessions/auth_sessions.dto';
import { AuthStrategiesDto } from './auth_strategies/auth_strategies.dto';
import { AuthConfirmDto } from './auth_confirm/auth_confirm.dto';
import { ClientsDto } from '@src/clients/clients.dto';
import { UsersDto } from '@src/db/users/users.dto';
// import { ClientsDto } from '@src/clients/clients.dto';
// import { TokenDto } from '@src/token/token.dto';
// import { AuthStrategiesDto } from './auth_strategies/auth_strategies.dto';

@InputType()
export class AuthDto extends CommonDto {
  @DtoCreatedColumn()
  createdAt?: Date;

  @DtoUpdatedColumn()
  updatedAt?: Date;

  @IsEmail()
  @DtoColumn('Имя пользователя, обычно здесь используется email', {
    required: true,
  })
  username?: string;

  @MinLength(6, {
    message: 'Password cannot be less than 6 symbols!',
  })
  @IsString()
  @DtoColumn('Пароль, заданный пользователем')
  password?: string;

  @DtoColumn(
    'Флаг, который показывает, является ли учетная запись пользователя активированной. Например, подтвержденной по email.',
    { default: false },
  )
  isActivated?: boolean;

  @DtoColumn(
    'Флаг, который показывает, назначены ли учетной записи пользователя права суперпользователя (администратора).',
    { required: false },
  )
  isSuperuser?: boolean;

  @ApiProperty({
    required: false,
    description: 'Сессионные данные, связанные с аккаунтом',
    type: () => [AuthSessionsDto],
  })
  @Field(() => [AuthSessionsDto], { nullable: true })
  sessions?: AuthSessionsDto[];

  @ApiProperty({
    required: false,
    description: 'Данные аккаунтов по стратегиям, связанные с аккаунтом',
    type: () => [AuthStrategiesDto],
  })
  @Field(() => [AuthStrategiesDto], { nullable: true })
  strategies?: AuthStrategiesDto[];

  @ApiProperty({
    required: false,
    description: 'Данные кодов подтверждения, связанные с аккаунтом',
    type: () => [AuthConfirmDto],
  })
  @Field(() => [AuthConfirmDto], { nullable: true })
  confirm?: AuthConfirmDto[];

  @ApiProperty({
    required: false,
    description: 'Данные клиентских приложений, связанные с аккаунтом',
    type: () => [ClientsDto],
  })
  @Field(() => [ClientsDto], { nullable: true })
  clients?: ClientsDto[];

  @ApiProperty({
    required: false,
    description: 'Пользовательские данные, связанные с аккаунтом',
    type: () => UsersDto,
  })
  @Field(() => UsersDto, { nullable: true })
  users?: UsersDto;

  // @Field(() => [AuthRolesDto], { nullable: true })
  // roles?: AuthRolesDto[];

  // @ApiProperty({
  //   required: false,
  //   description: 'Данные записи token',
  // })
  // @Field({ nullable: true })
  // token?: TokenDto;
}
