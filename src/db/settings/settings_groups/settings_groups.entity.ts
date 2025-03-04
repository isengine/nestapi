import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, OneToMany } from 'typeorm';
import { ClosedEntity } from '@src/common/entity/closed.entity';
import { SettingsEntity } from '../settings.entity';
import {
  BooleanColumn,
  PositionAscColumn,
  VarcharColumn,
} from '@src/common/common.column';

@ObjectType()
@Entity({ name: 'settings_groups' })
export class SettingsGroupsEntity extends ClosedEntity {
  @VarcharColumn('name', 100)
  name?: string;

  @VarcharColumn('description', 1024)
  description?: string;

  @PositionAscColumn()
  position?: string;

  @BooleanColumn('is_disabled')
  isDisabled: boolean;

  @Field(() => [SettingsEntity], { nullable: true })
  @OneToMany(() => SettingsEntity, (setting) => setting.group, {
    cascade: true,
  })
  settings: SettingsEntity[];
}
