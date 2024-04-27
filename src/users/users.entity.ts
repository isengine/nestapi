import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { AuthEntity } from '@src/auth/auth.entity';
import { PostsEntity } from '@src/posts/posts.entity';
import { GenderUsers } from '@src/users/users.enum';
import { RolesEntity } from '@src/roles/roles.entity';
import { SocketsEntity } from '@src/sockets/sockets.entity';

@ObjectType()
@Entity({ name: 'users' })
export class UsersEntity extends CommonEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  email?: string;

  @Field({ nullable: true })
  @Column({
    type: 'bigint',
    nullable: true,
  })
  phone?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  name?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    name: 'last_name',
  })
  lastName?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    name: 'parent_name',
  })
  parentName?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  avatar?: string;

  @Field({ nullable: true })
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  birthday?: Date;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  locale?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  address?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  timezone?: string;

  @Field(() => GenderUsers, {
    nullable: true,
    defaultValue: GenderUsers.DEFAULT,
  })
  @Column({
    type: 'enum',
    enum: GenderUsers,
    default: GenderUsers.DEFAULT,
    nullable: true,
  })
  gender?: GenderUsers;

  @Field()
  @OneToOne(() => AuthEntity)
  @JoinColumn({ name: 'auth_id', referencedColumnName: 'id' })
  auth: AuthEntity;

  @OneToMany(() => SocketsEntity, (socket) => socket.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sockets: SocketsEntity[];
}
