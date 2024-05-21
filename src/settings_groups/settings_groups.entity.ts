import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { ClosedEntity } from '@src/common/entity/closed.entity';
import { SettingsEntity } from '@src/settings/settings.entity';

@ObjectType()
@Entity({ name: 'settings_groups' })
export class SettingsGroupsEntity extends ClosedEntity {
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

  @Field({ nullable: true })
  @Column({
    type: 'int',
    nullable: true,
  })
  order?: string;

  @Field({ defaultValue: false })
  @Column({ default: false, name: 'is_disabled' })
  isDisabled: boolean;

  @Field(() => [SettingsEntity], { nullable: true })
  @OneToMany(() => SettingsEntity, (setting) => setting.group, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  settings: SettingsEntity[];
}
