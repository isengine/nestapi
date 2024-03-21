import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '@src/common/dto/common.dto';

@InputType()
export class RoomsDto extends CommonDto {
  @ApiProperty({
    required: false,
    description: 'Название комнаты',
  })
  @Field({ nullable: true })
  title?: string;
}
