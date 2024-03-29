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
@Entity({ name: 'redirects' })
export class RedirectsEntity extends CommonEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  url: string;

  @ManyToOne(() => ClientsEntity, (client) => client.redirects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  client: ClientsEntity;
}
