import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { UsersDto } from '@src/users/users.dto';
import { IsEnum } from 'class-validator';
import { RolesTypes } from '@src/roles/roles.enum';
import { CommonDto } from '@src/common/dto/common.dto';

@InputType()
export class RolesDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Название роли',
  })
  @Field({ nullable: true })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Тип роли',
  })
  @Field(() => RolesTypes, { nullable: true, defaultValue: RolesTypes.DEFAULT })
  @IsEnum(RolesTypes)
  type?: RolesTypes;

  @ApiProperty({
    required: false,
    description: 'Данные пользователя, связанного с этой ролью',
  })
  @Field(() => UsersDto, { nullable: true })
  user?: UsersDto;
}
