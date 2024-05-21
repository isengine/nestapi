import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ClosedEntity } from '@src/common/entity/closed.entity';
import { TypeValues } from '@src/common/common.enum';
import { SettingsGroupsEntity } from '@src/settings_groups/settings_groups.entity';

@ObjectType()
@Entity({ name: 'settings' })
export class SettingsEntity extends ClosedEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  name?: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  description?: string;

  @Field(() => SettingsGroupsEntity, { nullable: true })
  @ManyToOne(() => SettingsGroupsEntity, (settingsGroup) => settingsGroup.settings, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'settings_group_id', referencedColumnName: 'id' })
  group?: SettingsGroupsEntity;

  @Field(() => TypeValues, {
    nullable: true,
    defaultValue: TypeValues.DEFAULT,
  })
  @Column({
    type: 'enum',
    enum: TypeValues,
    default: TypeValues.DEFAULT,
    nullable: true,
  })
  type?: TypeValues;

  @Field({ nullable: true })
  @Column({
    type: 'int',
    nullable: true,
  })
  order?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  default?: string;

  @Field({ nullable: true })
  @Column({
    type: 'text',
    nullable: true,
  })
  value?: string;

  @Field({ defaultValue: false })
  @Column({ default: false, name: 'is_disabled' })
  isDisabled: boolean;
}
