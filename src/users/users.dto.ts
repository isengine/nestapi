import { Field, InputType } from '@nestjs/graphql';
import { AuthDto } from '@src/auth/auth.dto';
// import { IsEnum, NotEquals } from 'class-validator';
import { CommonDto } from '@src/typeorm/dto/common.dto';
import { PostsDto } from '@src/posts/posts.dto';
import { GenderUsers } from '@src/users/users.enum';

@InputType()
export class UsersDto extends CommonDto {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  fatherName?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  birthday?: Date;

  @Field({ nullable: true })
  locale?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  region?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  street?: string;

  @Field({ nullable: true })
  house?: string;

  @Field({ nullable: true })
  building?: string;

  @Field({ nullable: true })
  wing?: string;

  @Field({ nullable: true })
  apartment?: string;

  @Field({ nullable: true })
  place?: string;

  @Field({ nullable: true })
  postCode?: string;

  @Field({ nullable: true })
  timezone?: string;

  @Field({ nullable: true })
  tz?: string;

  @Field(() => GenderUsers, {
    nullable: true,
    defaultValue: GenderUsers.DEFAULT,
  })
  // @IsEnum(GenderUsers)
  // @NotEquals(GenderUsers[GenderUsers.DEFAULT])
  gender?: GenderUsers;

  @Field(() => AuthDto, { nullable: true })
  auth?: AuthDto;

  @Field({ nullable: true })
  authId?: number;

  @Field(() => [PostsDto], { nullable: true })
  posts?: PostsDto[];

  @Field(() => [String || Number], { nullable: true })
  postsList?: Array<string | number>;
}
