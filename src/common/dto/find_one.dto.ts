import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { FindDto } from './find.dto';

@InputType()
export class FindOneDto extends FindDto {
  @ApiProperty({
    required: true,
    description: 'Идентификатор записи',
  })
  @Field({ nullable: true })
  id: number = undefined;
}
