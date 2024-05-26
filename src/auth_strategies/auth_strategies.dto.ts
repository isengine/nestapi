import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/common.dto';
import { AuthDto } from '@src/auth/auth.dto';

@InputType()
export class AuthStrategiesDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Название стратегии OAuth 2.0, реализованной через библиотеку passport.js',
  })
  @Field({ nullable: true })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'ID пользователя на сервере OAuth 2.0',
  })
  @Field({ nullable: true })
  uid?: string;

  @ApiProperty({
    required: false,
    description: 'Данные пользователя с сервера OAuth 2.0',
  })
  @Field({ nullable: true })
  json?: string;

  @ApiProperty({
    required: false,
    description: 'Токен доступа для аккаунта сервера OAuth 2.0',
  })
  @Field({ nullable: true })
  accessToken?: string;

  @ApiProperty({
    required: false,
    description: 'Токен обновления для аккаунта сервера OAuth 2.0',
  })
  @Field({ nullable: true })
  refreshToken?: string;

  @ApiProperty({
    required: false,
    description: 'Данные авторизации, связанной с этой записью',
  })
  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;
}
