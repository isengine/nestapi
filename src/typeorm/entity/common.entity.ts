import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

@ObjectType()
@Entity()
export class CommonEntity extends BaseEntity {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Field({ nullable: true })
  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @Field({ nullable: true })
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
