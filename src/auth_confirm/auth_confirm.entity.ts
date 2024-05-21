import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';

@ObjectType()
@Entity({ name: 'auth_confirm' })
export class AuthConfirmEntity extends ProtectedEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  code: string;

  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 32,
    nullable: true,
  })
  type: string;
}
