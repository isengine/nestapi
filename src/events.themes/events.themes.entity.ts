import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '@src/typeorm/entity/common.entity';
import { EventsEntity } from '@src/events/events.entity';

@ObjectType()
@Entity({ name: 'events_themes' })
export class EventsThemesEntity extends CommonEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  title?: string;

  @OneToMany(() => EventsEntity, (event) => event.theme, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  events: EventsEntity[];
}
