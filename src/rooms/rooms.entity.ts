import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { VarcharColumn } from '@src/common/common.column';

@ObjectType()
@Entity({ name: 'rooms' })
export class RoomsEntity extends CommonEntity {
  @VarcharColumn('title')
  title?: string;

  @Field(() => [SocketsEntity], { nullable: true })
  @OneToMany(() => SocketsEntity, (socket) => socket.room, {
    cascade: true,
  })
  sockets: SocketsEntity[];
}
