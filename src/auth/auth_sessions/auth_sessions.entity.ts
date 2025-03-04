import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  CreatedColumn,
  UpdatedColumn,
  VarcharColumn,
} from '@src/common/common.column';
import { CommonEntity } from '@src/common/common.entity';
import { AuthEntity } from '../auth.entity';

@ObjectType()
@Entity({ name: 'auth_sessions' })
export class AuthSessionsEntity extends CommonEntity {
  @CreatedColumn()
  createdAt?: Date;

  @UpdatedColumn()
  updatedAt?: Date;

  @VarcharColumn('description')
  description?: string;

  @VarcharColumn('ip')
  ip?: string;

  @VarcharColumn('user_agent', 'medium')
  userAgent?: string;

  @VarcharColumn('referrer', 'medium')
  referrer?: string;

  @VarcharColumn('method', 'tiny')
  method?: string;

  @VarcharColumn('locale', 'tiny')
  locale?: string;

  @VarcharColumn('timezone', 'tiny')
  timezone?: string;

  @Field(() => AuthEntity, { nullable: true })
  @ManyToOne(() => AuthEntity, (auth) => auth.sessions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_id', referencedColumnName: 'id' })
  auth: AuthEntity;
}
