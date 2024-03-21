import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class RelationsDto {
  @ApiProperty({
    required: false,
    description: 'Имя таблицы отношений',
  })
  @Field()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Поле для сортировки',
  })
  @Field({ nullable: true, defaultValue: 'id' })
  order?: string;

  @ApiProperty({
    required: false,
    description: 'Флаг включения сортировки в обратном порядке',
  })
  @Field({ nullable: true, defaultValue: false })
  desc?: boolean;
}
