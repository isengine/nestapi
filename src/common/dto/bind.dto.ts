import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class BindDto {
  @ApiProperty({
    required: false,
    description: 'ID связанной записи',
  })
  @Field()
  id?: number;

  @ApiProperty({
    required: false,
    description: 'название связанной таблицы',
  })
  @Field({ nullable: true, defaultValue: 'id' })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'ключ поля ID связанной таблицы',
  })
  @Field({ nullable: true, defaultValue: 'id' })
  key?: string;

  @ApiProperty({
    required: false,
    description:
      'поле управляет отображением защищенных полей: true - разрешить все, false - разрешает отображение защищенных полей только для указанного ID связанной записи',
  })
  @Field({ nullable: true, defaultValue: false })
  allow?: boolean;
}
