import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/dto/common.dto';
import { AuthDto } from '@src/auth/auth.dto';

@InputType()
export class ConfirmDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Код подтверждения регистрации пользователя',
  })
  @Field({ nullable: true })
  code: string;

  @ApiProperty({
    required: false,
    description: 'Данные пользователя, связанного с этой записью',
  })
  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;
}
