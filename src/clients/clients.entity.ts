import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  OneToMany,
  // Generated,
} from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { TypeClients } from '@src/common/common.enum';
import { ClientsRedirectsEntity } from '@src/clients_redirects/clients_redirects.entity';

@ObjectType()
@Entity({ name: 'clients' })
export class ClientsEntity extends ProtectedEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    unique: true,
  })
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
    length: 1024,
    nullable: true,
  })
  client_password: string;

  @Field(() => TypeClients, {
    nullable: true,
    defaultValue: TypeClients.DEFAULT,
  })
  @Column({
    type: 'enum',
    enum: TypeClients,
    default: TypeClients.DEFAULT,
    nullable: true,
  })
  client_type?: TypeClients;

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
  })
  client_uri: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  code: string;

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

  @Field(() => [ClientsRedirectsEntity], { nullable: true })
  @OneToMany(() => ClientsRedirectsEntity, (redirect) => redirect.client, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  redirects: ClientsRedirectsEntity[];
}
