import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/dto/common.dto';
import { ClientsDto } from '@src/clients/dto/clients.dto';
import { AuthDto } from '@src/auth/auth.dto';

@InputType()
export class StrategiesDto extends CommonDto {
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
    description: 'Данные авторизации, связанной с этой записью',
  })
  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;
}
