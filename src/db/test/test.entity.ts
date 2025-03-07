import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';
import {
  BigIntColumn,
  BooleanColumn,
  CreatedColumn,
  DateColumn,
  EnumColumn,
  FloatColumn,
  IntColumn,
  JsonColumn,
  TextColumn,
  UpdatedColumn,
  VarcharColumn,
} from '@src/common/common.column';
import { TypeValues } from '@src/common/common.enum';
import { CommonEntity } from '@src/common/common.entity';

@ObjectType()
@Entity({ name: 'test' })
export class TestEntity extends CommonEntity {
  @CreatedColumn()
  createdAt?: Date;

  @UpdatedColumn()
  updatedAt?: Date;

  @VarcharColumn('title')
  title?: string;

  @BigIntColumn('bigint')
  bigint: number;

  @BooleanColumn('boolean')
  boolean: boolean;

  @DateColumn('date')
  date: Date;

  @EnumColumn('enum', TypeValues, TypeValues.DEFAULT)
  enum: TypeValues;

  @FloatColumn('float')
  float: number;

  @IntColumn('int')
  int: number;

  @JsonColumn('json')
  json: object | null;

  @TextColumn('text')
  text: string;
}
