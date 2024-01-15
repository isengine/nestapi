import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { CommonEntity } from '@src/typeorm/entity/common.entity';
import { AuthEntity } from '@src/auth/auth.entity';
import { PostsEntity } from '@src/posts/posts.entity';
import { GenderUsers } from '@src/users/users.enum';
import { EventsEntity } from '@src/events/events.entity';
import { RolesEntity } from '@src/roles/roles.entity';

@ObjectType()
@Entity({ name: 'users' })
export class UsersEntity extends CommonEntity {
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
    length: 200,
    nullable: true,
  })
  email?: string;

  @Field({ nullable: true })
  @Column({
    type: 'int',
    nullable: true,
  })
  phone?: string;

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

  @OneToMany(() => EventsEntity, (event) => event.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  events: EventsEntity[];
}
