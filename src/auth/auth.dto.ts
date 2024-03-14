import { Field, InputType } from '@nestjs/graphql';
import { TokensDto } from '@src/tokens/tokens.dto';
import { CommonDto } from '@src/common/dto/common.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

@InputType()
export class AuthDto extends CommonDto {
  @Field()
  @IsEmail()
  @ApiProperty({ description: 'User email as login', nullable: false })
  username: string;

  @Field({ nullable: true })
  @MinLength(6, {
    message: 'Password cannot be less than 6 symbols!',
  })
  @IsString()
  @ApiProperty({ description: 'User password', nullable: false })
  password?: string;

  @Field({ nullable: true })
  @ApiProperty({ description: 'Strategy of passport.js', nullable: true })
  passportStrategy?: string;

  @Field({ nullable: true })
  passportId?: string;

  @Field({ nullable: true, defaultValue: false })
  isActivated?: boolean;

  @Field({ nullable: true })
  tokens?: TokensDto;
}
