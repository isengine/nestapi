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
  client_id: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  client_secret: string;

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

  @Field({ defaultValue: () => 'CURRENT_TIMESTAMP', nullable: true })
  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'published_at',
  })
  publishedAt: Date;

  @Field({ defaultValue: true, nullable: true })
  @Column({
    type: 'boolean',
    nullable: true,
    default: true,
    name: 'is_published',
  })
  isPublished: boolean;
}
