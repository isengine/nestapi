import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class OptionsDto {
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

  @ApiProperty({
    required: false,
    description: 'Пропустить какое-то количество записей',
  })
  @Field({ nullable: true })
  skip?: number;

  @ApiProperty({
    required: false,
    description: 'Лимит записей, автоматически включает разбивку на страницы',
  })
  @Field({ nullable: true })
  limit?: number;

  @ApiProperty({
    required: false,
    description: 'Номер страницы с указанным лимитом записей',
  })
  @Field({ nullable: true })
  page?: number;

  @ApiProperty({
    required: false,
    description: 'Поле, по которому записи будут сгруппированы',
  })
  @Field({ nullable: true })
  group?: string;

  @ApiProperty({
    required: false,
    description: 'Тип группировки',
  })
  @Field({ nullable: true })
  type?: string;
}
