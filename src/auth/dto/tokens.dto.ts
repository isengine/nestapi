import { IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TokensDto {
  @Field()
  accessToken: string;

  @Field()
  @IsString({
    message: 'You did not pass refresh token or it is not a string!',
  })
  refreshToken: string;
}
