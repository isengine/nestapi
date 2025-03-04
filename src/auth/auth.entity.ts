import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  BooleanColumn,
  CreatedColumn,
  UpdatedColumn,
  VarcharColumn,
} from '@src/common/common.column';
import { CommonEntity } from '@src/common/common.entity';
import { ClientsEntity } from '@src/clients/clients.entity';
import { UsersEntity } from '@src/db/users/users.entity';
import { AuthConfirmEntity } from './auth_confirm/auth_confirm.entity';
import { AuthSessionsEntity } from './auth_sessions/auth_sessions.entity';
import { AuthStrategiesEntity } from './auth_strategies/auth_strategies.entity';

@ObjectType()
@Entity({ name: 'auth' })
export class AuthEntity extends CommonEntity {
  @CreatedColumn()
  createdAt?: Date;

  @UpdatedColumn()
  updatedAt?: Date;

  @VarcharColumn('username', 'normal', { index: 'unique' })
  username: string;

  @VarcharColumn('password')
  password: string;

  @BooleanColumn('is_activated')
  isActivated: boolean;

  @BooleanColumn('is_superuser')
  isSuperuser: boolean;

  @Field(() => [AuthSessionsEntity], { nullable: true })
  @OneToMany(() => AuthSessionsEntity, (session) => session.auth, {
    cascade: true,
  })
  sessions: AuthSessionsEntity[];

  @Field(() => [AuthStrategiesEntity], { nullable: true })
  @OneToMany(() => AuthStrategiesEntity, (strategy) => strategy.auth, {
    cascade: true,
  })
  strategies: AuthStrategiesEntity[];

  @Field(() => [AuthConfirmEntity], { nullable: true })
  @OneToMany(() => AuthConfirmEntity, (confirm) => confirm.auth, {
    cascade: true,
  })
  confirm: AuthConfirmEntity[];

  @Field(() => [ClientsEntity], { nullable: true })
  @OneToMany(() => ClientsEntity, (clients) => clients.auth, {
    cascade: true,
  })
  clients: ClientsEntity[];

  @Field(() => UsersEntity, { nullable: true })
  @OneToOne(() => UsersEntity, (users) => users.auth, {
    cascade: true,
  })
  users: UsersEntity;
}
