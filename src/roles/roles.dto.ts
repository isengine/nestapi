import { Field, InputType } from '@nestjs/graphql';
import { UsersDto } from '@src/users/users.dto';
import { IsEnum } from 'class-validator';
import { RolesTypes } from '@src/roles/roles.enum';
import { CommonDto } from '@src/typeorm/dto/common.dto';

@InputType()
export class RolesDto extends CommonDto {
  @Field({ nullable: true })
  name?: string;

  @Field(() => RolesTypes, { nullable: true, defaultValue: RolesTypes.DEFAULT })
  @IsEnum(RolesTypes)
  type?: RolesTypes;

  @Field(() => UsersDto, { nullable: true })
  user?: UsersDto;

  @Field({ nullable: true })
  userId?: number;
}
