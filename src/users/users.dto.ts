import { Field, InputType } from '@nestjs/graphql';
import { AuthDto } from '@src/auth/dto/auth.dto';
import { IsEnum, NotEquals } from 'class-validator';
import { CommonDto } from '@src/typeorm/dto/common.dto';
import { PostsDto } from '@src/posts/posts.dto';
import { GenderUsers } from '@src/users/users.enum';

@InputType()
export class UsersDto extends CommonDto {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  birthday?: Date;

  @Field(() => GenderUsers, { defaultValue: GenderUsers.DEFAULT })
  @IsEnum(GenderUsers)
  @NotEquals(GenderUsers[GenderUsers.DEFAULT])
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
