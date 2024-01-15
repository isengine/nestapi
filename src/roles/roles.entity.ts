import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '@src/typeorm/entity/common.entity';
import { RolesTypes } from '@src/roles/roles.enum';
import { UsersEntity } from '@src/users/users.entity';

@ObjectType()
@Entity({ name: 'roles' })
export class RolesEntity extends CommonEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  name?: string;

  @Field(() => RolesTypes, { nullable: true, defaultValue: RolesTypes.DEFAULT })
  @Column({
    type: 'enum',
    enum: RolesTypes,
    default: RolesTypes.DEFAULT,
    nullable: true,
  })
  type: RolesTypes;

  @ManyToOne(() => UsersEntity, (user) => user.roles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UsersEntity;
}
