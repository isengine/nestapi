import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';
import { RelationsDto } from '@src/common/dto/relations.dto';
import { SearchType } from '../type/search.type';

@InputType()
export class FindDto {
  @ApiProperty({
    required: false,
    description: 'Выбор полей',
  })
  @Field(() => [String], { nullable: true })
  select?: FindOptionsSelect<any> = undefined;

  @ApiProperty({
    required: false,
    description: 'Выбор',
  })
  @Field(() => [String], { nullable: true })
  where?: FindOptionsWhere<any> = undefined;

  @ApiProperty({
    required: false,
    description: 'Поиск',
  })
  @Field(() => [String], { nullable: true })
  search?: DeepPartial<any> = undefined;

  @ApiProperty({
    required: false,
    description: 'Сортировка',
  })
  @Field({ nullable: true })
  order?: FindOptionsOrder<any> = { id: 'ASC' };

  @ApiProperty({
    required: false,
    description: 'Лимит',
  })
  @Field({ nullable: true })
  limit?: number = undefined;

  @ApiProperty({
    required: false,
    description: 'Число пропускаемых записей',
  })
  @Field({ nullable: true })
  offset?: number = undefined;

  @ApiProperty({
    required: false,
    description: 'Отношения',
  })
  @Field({ nullable: true })
  relations?: Array<RelationsDto> = undefined;
}
