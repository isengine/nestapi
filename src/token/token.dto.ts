import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CommonDto } from '@src/common/common.dto';

@InputType()
export class TokenDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Токен доступа',
  })
  @Field({ nullable: true })
  access_token?: string;

  @ApiProperty({
    required: false,
    description: 'Срок действия токена доступа',
  })
  @Field({ nullable: true })
  expires_in?: number;

  @ApiProperty({
    required: false,
    description: 'Токен обновления',
  })
  @Field({ nullable: true })
  @IsString({
    message: 'You did not pass refresh token or it is not a string!',
  })
  refresh_token?: string;
}
