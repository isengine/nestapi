import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { PrivateEntity } from '@src/common/entity/private.entity';
import { TypeGenders } from '@src/common/common.enum';

@ObjectType()
@Entity({ name: 'persons' })
export class PersonsEntity extends PrivateEntity {
  @Field()
  @Column({
    type: 'varchar',
    length: 200,
    unique: true,
  })
  username: string;

  @Field()
  @Column()
  password: string;

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

  @Field(() => TypeGenders, {
    nullable: true,
    defaultValue: TypeGenders.DEFAULT,
  })
  @Column({
    type: 'enum',
    enum: TypeGenders,
    default: TypeGenders.DEFAULT,
    nullable: true,
  })
  gender?: TypeGenders;
}
