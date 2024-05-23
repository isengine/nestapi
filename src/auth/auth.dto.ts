import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from "@nestjs/swagger";
import { CommonDto } from '@src/common/common.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';
// import { AuthRolesDto } from '@src/auth_roles/auth_roles.dto';
// import { ClientsDto } from '@src/clients/clients.dto';
// import { TokenDto } from '@src/token/token.dto';
// import { AuthStrategiesDto } from '@src/auth_strategies/auth_strategies.dto';

@InputType()
export class AuthDto extends CommonDto {
  @Field()
  @IsEmail()
  @ApiProperty({
    required: true,
    description: 'Имя пользователя, обычно здесь используется email',
  })
  username?: string;

  @Field({ nullable: true })
  @MinLength(6, {
    message: 'Password cannot be less than 6 symbols!',
  })
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Пароль, заданный пользователем',
  })
  password?: string;

  @ApiProperty({
    required: false,
    default: false,
    description: 'Флаг, который показывает, является ли учетная запись пользователя активированной. Например, подтвержденной по email.',
  })
  @Field({ nullable: true, defaultValue: false })
  isActivated?: boolean;

  @ApiProperty({
    required: false,
    default: false,
    description: 'Флаг, который показывает, назначены ли учетной записи пользователя права суперпользователя (администратора).',
  })
  @Field({ nullable: true, defaultValue: false })
  isSuperuser?: boolean;

  // @Field(() => [AuthRolesDto], { nullable: true })
  // roles?: AuthRolesDto[];

  // @Field(() => [ClientsDto], { nullable: true })
  // clients?: ClientsDto[];

  // @ApiProperty({
  //   required: false,
  //   description: 'Данные записи token',
  // })
  // @Field({ nullable: true })
  // token?: TokenDto;

  // @ApiProperty({
  //   required: false,
  //   description: 'Данные записи strategies',
  // })
  // @Field({ nullable: true })
  // strategies?: AuthStrategiesDto;
}
