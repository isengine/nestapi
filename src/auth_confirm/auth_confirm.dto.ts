import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ProtectedDto } from '@src/common/dto/protected.dto';

@InputType()
export class AuthConfirmDto extends ProtectedDto {
  @ApiProperty({
    required: false,
    description: 'Код подтверждения регистрации пользователя',
  })
  @Field({ nullable: true })
  code: string;

  @ApiProperty({
    required: false,
    description: 'Тип кода: confirm - подтверждение регистрации, reset - сброс пароля',
  })
  @Field({ nullable: true })
  type: string;
}
