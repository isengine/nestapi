import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from '@src/typeorm/entity/common.entity';
import { UsersEntity } from '@src/users/users.entity';
import { EventsThemesEntity } from '@src/events.themes/events.themes.entity';

@ObjectType()
@Entity({ name: 'events' })
export class EventsEntity extends CommonEntity {
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

  @ManyToOne(() => UsersEntity, (user) => user.events, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UsersEntity;

  @ManyToOne(() => EventsThemesEntity, (theme) => theme.events, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'theme_id', referencedColumnName: 'id' })
  theme: UsersEntity;
}
