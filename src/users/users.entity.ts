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
    name: 'first_name',
  })
  firstName?: string;

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
    name: 'father_name',
  })
  fatherName?: string;

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
    length: 200,
    nullable: true,
  })
  country?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  region?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  city?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  street?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  house?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  building?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  wing?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  apartment?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  place?: string;

  @Field({ nullable: true })
  @Column({
    type: 'int',
    nullable: true,
    name: 'post_code',
  })
  postCode?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  timezone?: string;

  @Field({ nullable: true })
  @Column({
    type: 'int',
    nullable: true,
  })
  tz?: string;

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

  @OneToMany(() => RolesEntity, (role) => role.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  roles: RolesEntity[];

  @OneToMany(() => PostsEntity, (post) => post.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  posts: PostsEntity[];

  @OneToMany(() => SocketsEntity, (socket) => socket.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sockets: SocketsEntity[];
}
