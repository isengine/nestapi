import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  OneToMany,
  // Generated,
} from 'typeorm';
import {
  BooleanColumn,
  CreatedColumn,
  EnumColumn,
  TextColumn,
  UpdatedColumn,
  VarcharColumn,
} from '@src/common/common.column';
import { TypeClients } from '@src/common/common.enum';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { ClientsRedirectsEntity } from './clients_redirects/clients_redirects.entity';

@ObjectType()
@Entity({ name: 'clients' })
export class ClientsEntity extends ProtectedEntity {
  @CreatedColumn()
  createdAt?: Date;

  @UpdatedColumn()
  updatedAt?: Date;

  @Field({ nullable: true })
  @VarcharColumn('client_id', 'normal', { index: 'unique' })
  client_id: string;

  @VarcharColumn('client_secret', 'long')
  client_secret: string;

  @VarcharColumn('client_password', 'long')
  client_password: string;

  @EnumColumn('client_type', TypeClients, TypeClients.DEFAULT)
  client_type?: TypeClients;

  @VarcharColumn('title')
  title: string;

  @TextColumn('description')
  description: string;

  @VarcharColumn('client_uri', 'long')
  client_uri: string;

  @VarcharColumn('code', 'long')
  code: string;

  @CreatedColumn('published_at')
  publishedAt: Date;

  @BooleanColumn('is_published', true)
  isPublished: boolean;

  @Field(() => [ClientsRedirectsEntity], { nullable: true })
  @OneToMany(() => ClientsRedirectsEntity, (redirect) => redirect.client, {
    cascade: true,
  })
  redirects: ClientsRedirectsEntity[];
}
