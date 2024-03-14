import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CommonDto } from '@src/common/dto/common.dto';

@InputType()
export class TokensDto extends CommonDto {
  @Field({ nullable: true })
  access_token?: string;

  @Field({ nullable: true })
  expires_in?: number;

  @Field({ nullable: true })
  @IsString({
    message: 'You did not pass refresh token or it is not a string!',
  })
  refresh_token?: string;
}
