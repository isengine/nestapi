import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/typeorm/dto/common.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class AuthDto extends CommonDto {
  @Field()
  @IsEmail()
  login: string;

  @Field({ nullable: true })
  @MinLength(6, {
    message: 'Password cannot be less than 6 symbols!',
  })
  @IsString()
  password?: string;

  @Field({ nullable: true })
  passportStrategy?: string;

  @Field({ nullable: true })
  passportId?: string;

  @Field({ nullable: true })
  locale?: string;

  @Field({ nullable: true })
  rights?: string;

  @Field({ defaultValue: false })
  isActivated?: boolean;
}
