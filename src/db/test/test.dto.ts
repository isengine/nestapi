import { InputType } from '@nestjs/graphql';
import {
  DtoColumn,
  DtoCreatedColumn,
  DtoEnumColumn,
  DtoJsonColumn,
  DtoUpdatedColumn,
} from '@src/common/common.column';
import { TypeValues } from '@src/common/common.enum';
import { ClosedDto } from '@src/common/dto/closed.dto';

@InputType()
export class TestDto extends ClosedDto {
  @DtoCreatedColumn()
  createdAt?: Date;

  @DtoUpdatedColumn()
  updatedAt?: Date;

  @DtoColumn('title')
  title?: string;

  @DtoColumn('bigint type')
  bigint?: number;

  @DtoColumn('boolean type')
  boolean?: boolean;

  @DtoColumn('date type')
  date?: Date;

  @DtoEnumColumn('enum type', TypeValues, TypeValues.DEFAULT)
  enum?: TypeValues;

  @DtoColumn('float type')
  float?: number;

  @DtoColumn('int type')
  int?: number;

  @DtoJsonColumn('json type')
  json?: object | null;

  @DtoColumn('text type')
  text?: string;
}
