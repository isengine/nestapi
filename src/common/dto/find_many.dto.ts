import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { FindDto } from './find.dto';

@InputType()
export class FindManyDto extends FindDto {
  @ApiProperty({
    required: true,
    description: 'Идентификаторы записей',
  })
  @Field(() => [String], { nullable: true })
  ids: Array<number | string> = undefined;
}
