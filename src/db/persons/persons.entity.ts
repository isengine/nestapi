import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';
import { PrivateEntity } from '@src/common/entity/private.entity';
import { TypeGenders } from '@src/common/common.enum';
import {
  CreatedColumn,
  DateColumn,
  EnumColumn,
  UpdatedColumn,
  VarcharColumn,
} from '@src/common/common.column';

@ObjectType()
@Entity({ name: 'persons' })
export class PersonsEntity extends PrivateEntity {
  @CreatedColumn()
  createdAt?: Date;

  @UpdatedColumn()
  updatedAt?: Date;

  @VarcharColumn('username', 'normal', { index: 'unique' })
  username: string;

  @VarcharColumn('password')
  password: string;

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

  @Field(() => TypeGenders, {
    nullable: true,
    defaultValue: TypeGenders.DEFAULT,
  })
  @EnumColumn('gender', TypeGenders, TypeGenders.MAN)
  gender?: TypeGenders;
}
