import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { ClientsEntity } from '@src/clients/clients.entity';

@ObjectType()
@Entity({ name: 'clients_redirects' })
export class ClientsRedirectsEntity extends CommonEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  uri: string;

  @Field(() => ClientsEntity, { nullable: true })
  @ManyToOne(() => ClientsEntity, (client) => client.redirects, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  client: ClientsEntity;
}
