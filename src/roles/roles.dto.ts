import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RolesTypes } from '@src/roles/roles.enum';
import { ProtectedDto } from '@src/common/dto/protected.dto';

@InputType()
export class RolesDto extends ProtectedDto {
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
}
