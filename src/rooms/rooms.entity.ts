import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { SocketsEntity } from '@src/sockets/sockets.entity';

@ObjectType()
@Entity({ name: 'rooms' })
export class RoomsEntity extends CommonEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  title?: string;

  @OneToMany(() => SocketsEntity, (socket) => socket.room, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sockets: SocketsEntity[];
}
