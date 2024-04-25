import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';

@ObjectType()
@Entity({ name: 'confirm' })
export class ConfirmEntity extends ProtectedEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  code: string;
}
