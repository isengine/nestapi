import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { AuthSessionsEntity } from '@src/auth_sessions/auth_sessions.entity';
import { StrategiesEntity } from '@src/strategies/strategies.entity';
import { AuthConfirmEntity } from '@src/auth_confirm/auth_confirm.entity';
import { AuthRolesEntity } from '@src/auth_roles/auth_roles.entity';
import { ClientsEntity } from '@src/clients/clients.entity';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { PostsEntity } from '@src/posts/posts.entity';
import { UsersEntity } from '@src/users/users.entity';

@ObjectType()
@Entity({ name: 'auth' })
export class AuthEntity extends CommonEntity {
  @Field()
  @Column({
    type: 'varchar',
    length: 200,
    unique: true,
  })
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  password: string;

  @Field({ defaultValue: false })
  @Column({ default: false, name: 'is_activated' })
  isActivated: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false, name: 'is_superuser' })
  isSuperuser: boolean;

  @OneToMany(() => AuthSessionsEntity, (session) => session.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sessions: AuthSessionsEntity[];

  @OneToMany(() => StrategiesEntity, (strategy) => strategy.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  strategies: StrategiesEntity[];

  @OneToMany(() => AuthConfirmEntity, (confirm) => confirm.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  confirm: AuthConfirmEntity[];

  @OneToMany(() => ClientsEntity, (clients) => clients.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  clients: ClientsEntity[];

  @OneToMany(() => PostsEntity, (posts) => posts.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  posts: PostsEntity[];

  @OneToMany(() => AuthRolesEntity, (roles) => roles.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roles: AuthRolesEntity[];

  @OneToMany(() => SocketsEntity, (sockets) => sockets.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sockets: SocketsEntity[];

  @OneToMany(() => UsersEntity, (users) => users.auth, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  users: UsersEntity[];
}
