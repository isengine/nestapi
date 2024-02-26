import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  Generated,
} from 'typeorm';
import { CommonEntity } from '@src/typeorm/entity/common.entity';

@ObjectType()
@Entity({ name: 'clients' })
export class ClientsEntity extends CommonEntity {
  @Field({ nullable: true })
  @Column({
    type: 'uuid',
    nullable: true,
  })
  @Generated('uuid')
  uuid: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
    name: 'public_key',
  })
  publicKey: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
    name: 'secret_key',
  })
  secretKey: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  title: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
    name: 'client_uri',
  })
  clientUri: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
    name: 'redirect_uri',
  })
  redirectUri: string;

  @Field({ nullable: true })
  @Column({
    type: 'date',
    nullable: true,
    name: 'published_at',
  })
  publishedAt: Date;

  @Field({ nullable: true })
  @Column({
    type: 'boolean',
    nullable: true,
    name: 'is_published',
  })
  isPublished: boolean;
}
