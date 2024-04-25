import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '@src/common/entity/common.entity';
import { AuthEntity } from '@src/auth/auth.entity';

@ObjectType()
@Entity({ name: 'sessions' })
export class SessionsEntity extends CommonEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  description?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  ip?: string;

  @Field({ nullable: true })
  @Column({
    name: 'user_agent',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  userAgent?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  referrer?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 8,
    nullable: true,
  })
  method?: string;

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
    length: 32,
    nullable: true,
  })
  timezone?: string;

  @ManyToOne(() => AuthEntity, (auth) => auth.sessions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_id', referencedColumnName: 'id' })
  auth: AuthEntity;
}
