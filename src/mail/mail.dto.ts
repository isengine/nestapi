import { Field, InputType } from '@nestjs/graphql';
import { CommonDto } from '@src/common/common.dto';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class MailDto extends CommonDto {
  @Field({ nullable: true })
  @IsEmail()
  from?: string;

  @Field()
  @IsEmail()
  to: string;

  @Field({ nullable: true })
  @IsString()
  subject?: string;

  @Field({ nullable: true })
  @IsString()
  text?: string;

  @Field({ nullable: true })
  @IsString()
  html?: string;

  @Field({ nullable: true })
  @IsString()
  template?: string;
}
