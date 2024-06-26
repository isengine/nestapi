import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { AuthDto } from '@src/auth/auth.dto';
import { CommonDto } from '@src/common/common.dto';

@InputType()
export class AuthSessionsDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Поле с описанием или комментариями к этой записи',
  })
  @Field({ nullable: true })
  description?: string;

  @ApiProperty({
    required: false,
    description: 'IP-адрес пользователя',
  })
  @Field({ nullable: true })
  ip?: string;

  @ApiProperty({
    required: false,
    description: 'Агент (браузер) пользователя',
  })
  @Field({ nullable: true })
  userAgent?: string;

  @ApiProperty({
    required: false,
    description: 'Ссылка, по которой была открыта сессия',
  })
  @Field({ nullable: true })
  referrer?: string;

  @ApiProperty({
    required: false,
    description: 'Метод, по которому была открыта сессия',
  })
  @Field({ nullable: true })
  method?: string;

  @ApiProperty({
    required: false,
    description: 'Текущая языковая локаль пользователя',
  })
  @Field({ nullable: true })
  locale?: string;

  @ApiProperty({
    required: false,
    description: 'Временная зона, формат +/-00:00',
  })
  @Field({ nullable: true })
  timezone?: string;

  @ApiProperty({
    required: false,
    description: 'Данные auth записи, связанной с этой сессией',
  })
  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;
}
