import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';
import { AuthRolesTypes } from '@src/auth_roles/auth_roles.enum';

@ObjectType()
@Entity({ name: 'auth_roles' })
export class AuthRolesEntity extends ProtectedEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  name?: string;

  @Field(() => AuthRolesTypes, { nullable: true, defaultValue: AuthRolesTypes.DEFAULT })
  @Column({
    type: 'enum',
    enum: AuthRolesTypes,
    default: AuthRolesTypes.DEFAULT,
    nullable: true,
  })
  type: AuthRolesTypes;
}
