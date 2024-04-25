import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/dto/common.dto';
import { AuthDto } from '@src/auth/auth.dto';

@InputType()
export class ProtectedDto extends CommonDto  {
  @ApiProperty({
    required: false,
    description: 'Данные учетной записи пользователя, связанной с этой записью',
  })
  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;
}
