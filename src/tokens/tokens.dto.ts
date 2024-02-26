import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { AuthDto } from '@src/auth/dto/auth.dto';
import { CommonDto } from '@src/typeorm/dto/common.dto';

@InputType()
export class TokensDto extends CommonDto {
  @Field({ nullable: true })
  accessToken: string;

  @Field({ nullable: true })
  @IsString({
    message: 'You did not pass refresh token or it is not a string!',
  })
  refreshToken: string;

  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;

  @Field({ nullable: true })
  authId?: number;
}
