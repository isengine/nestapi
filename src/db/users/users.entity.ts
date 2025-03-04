import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';
import { PrivateOneEntity } from '@src/common/entity/private_one.entity';
import { TypeGenders } from '@src/common/common.enum';
import {
  CreatedColumn,
  DateColumn,
  EnumColumn,
  UpdatedColumn,
  VarcharColumn,
} from '@src/common/common.column';

@ObjectType()
@Entity({ name: 'users' })
export class UsersEntity extends PrivateOneEntity {
  @CreatedColumn()
  createdAt?: Date;

  @UpdatedColumn()
  updatedAt?: Date;

  @VarcharColumn('email')
  email?: string;

  @VarcharColumn('phone', 'tiny', { clear: '[^0-9]' })
  phone?: string;

  @VarcharColumn('name')
  name?: string;

  @VarcharColumn('last_name')
  lastName?: string;

  @VarcharColumn('parent_name')
  parentName?: string;

  @VarcharColumn('avatar', 'long')
  avatar?: string;

  @DateColumn('birthday', null)
  birthday?: Date;

  @VarcharColumn('locale', 'tiny')
  locale?: string;

  @VarcharColumn('address', 'medium')
  address?: string;

  @VarcharColumn('timezone', 'tiny')
  timezone?: string;

  @EnumColumn('gender', TypeGenders, TypeGenders.DEFAULT)
  gender?: TypeGenders;
}
