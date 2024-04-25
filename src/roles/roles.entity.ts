import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { RolesTypes } from '@src/roles/roles.enum';

@ObjectType()
@Entity({ name: 'roles' })
export class RolesEntity extends ProtectedEntity {
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
}
