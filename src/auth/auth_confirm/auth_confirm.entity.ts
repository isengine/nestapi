import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';
import {
  CreatedColumn,
  UpdatedColumn,
  VarcharColumn,
} from '@src/common/common.column';
import { ProtectedEntity } from '@src/common/entity/protected.entity';

@ObjectType()
@Entity({ name: 'auth_confirm' })
export class AuthConfirmEntity extends ProtectedEntity {
  @CreatedColumn()
  createdAt?: Date;

  @UpdatedColumn()
  updatedAt?: Date;

  @VarcharColumn('code', 'long')
  code: string;

  @VarcharColumn('code', 'tiny')
  type: string;
}
