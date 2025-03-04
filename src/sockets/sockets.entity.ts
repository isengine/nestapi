import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { RoomsEntity } from '@src/rooms/rooms.entity';
import { UsersEntity } from '@src/db/users/users.entity';
import {
  JsonColumn,
  TextColumn,
  VarcharColumn,
} from '@src/common/common.column';

@ObjectType()
@Entity({ name: 'sockets' })
export class SocketsEntity extends ProtectedEntity {
  @VarcharColumn('name')
  name?: string;

  @JsonColumn('data')
  data?: string;

  @TextColumn('message')
  message?: string;

  @Field(() => RoomsEntity, { nullable: true })
  @ManyToOne(() => RoomsEntity, (room) => room.sockets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: UsersEntity;
}
