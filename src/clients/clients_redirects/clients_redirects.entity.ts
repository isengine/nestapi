import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import {
  CreatedColumn,
  UpdatedColumn,
  VarcharColumn,
} from '@src/common/common.column';
import { CommonEntity } from '@src/common/common.entity';
import { ClientsEntity } from '../clients.entity';

@ObjectType()
@Entity({ name: 'clients_redirects' })
export class ClientsRedirectsEntity extends CommonEntity {
  @CreatedColumn()
  createdAt?: Date;

  @UpdatedColumn()
  updatedAt?: Date;

  @VarcharColumn('uri', 'long')
  uri: string;

  @Field(() => ClientsEntity, { nullable: true })
  @ManyToOne(() => ClientsEntity, (client) => client.redirects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  client: ClientsEntity;
}
