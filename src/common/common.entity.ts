import { ObjectType } from '@nestjs/graphql';
import { Entity, BaseEntity } from 'typeorm';
import { IdColumn } from './common.column';

@ObjectType()
@Entity()
export class CommonEntity extends BaseEntity {
  @IdColumn()
  id: number;
}
