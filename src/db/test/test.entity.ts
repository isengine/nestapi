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
  SmallIntColumn,
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

  @IntColumn('int')
  int: number;

  @BigIntColumn('bigint')
  bigint: number;

  @SmallIntColumn('smallint')
  smallint: number;

  @FloatColumn('float')
  float: number;

  @BooleanColumn('boolean')
  boolean: boolean;

  @VarcharColumn('varchar')
  varchar?: string;

  @TextColumn('text')
  text: string;

  @JsonColumn('json')
  json: object | null;

  @DateColumn('date')
  date: Date;

  @EnumColumn('enum', TypeValues, TypeValues.DEFAULT)
  enum: TypeValues;
}
