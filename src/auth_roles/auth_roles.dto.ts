import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AuthRolesTypes } from '@src/auth_roles/auth_roles.enum';
import { ProtectedDto } from '@src/common/dto/protected.dto';

@InputType()
export class AuthRolesDto extends ProtectedDto {
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
  @Field(() => AuthRolesTypes, { nullable: true, defaultValue: AuthRolesTypes.DEFAULT })
  @IsEnum(AuthRolesTypes)
  type?: AuthRolesTypes;
}
