import { Field, InputType } from '@nestjs/graphql';
import { AuthDto } from '@src/auth/auth.dto';
import { CommonDto } from '@src/common/dto/common.dto';

@InputType()
export class SessionsDto extends CommonDto {
  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  ip?: string;

  @Field({ nullable: true })
  userAgent?: string;

  @Field({ nullable: true })
  referrer?: string;

  @Field({ nullable: true })
  method?: string;

  // @Field({ nullable: true })
  // sessions?: string;

  // @Field({ nullable: true })
  // cookies?: string;

  @Field({ nullable: true })
  locale?: string;

  @Field({ nullable: true })
  timezone?: string;

  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;

  @Field({ nullable: true })
  authId?: number;
}
