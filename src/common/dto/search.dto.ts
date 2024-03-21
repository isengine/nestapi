import { Field, InputType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class SearchDto {
  @ApiProperty({
    required: false,
    description: 'Поиск указанной строки. Рекомендуем задавать только одно из значений string или array',
  })
  @Field({ nullable: true })
  string?: string;

  @ApiProperty({
    required: false,
    description: 'Поиск всех указанных в массиве строк. Рекомендуем задавать только одно из значений string или array',
  })
  @Field(() => [String], { nullable: true })
  array?: Array<string>;

  @ApiProperty({
    required: false,
    description: 'Массив полей, по которым будет вестись поиск',
  })
  @Field(() => [String])
  fields: Array<string>;

  @ApiProperty({
    required: false,
    description: 'Объект с нужными полями записей и их значениями, по которым записи будут дополнительно фильтроваться',
  })
  @Field(() => GraphQLJSONObject, { nullable: true })
  where?: object;
}
