import { ID, Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CommonDto {
  @ApiProperty({
    required: false,
    description: 'Id номер записи, автоматическое приращение',
  })
  @Field(() => ID, { nullable: true })
  id?: number;
}
