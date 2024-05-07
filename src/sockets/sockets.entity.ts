import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { UsersEntity } from '@src/users/users.entity';
import { RoomsEntity } from '@src/rooms/rooms.entity';

@ObjectType()
@Entity({ name: 'sockets' })
export class SocketsEntity extends ProtectedEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  name?: string;

  @Field({ nullable: true })
  @Column({
    type: 'json',
    nullable: true,
  })
  data?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  message?: string;

  @ManyToOne(() => RoomsEntity, (room) => room.sockets, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
  room: UsersEntity;
}
