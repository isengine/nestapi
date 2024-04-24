import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { AuthEntity } from '@src/auth/auth.entity';

@ObjectType()
@Entity({ name: 'confirm' })
export class ConfirmEntity extends CommonEntity {
  @Field({ nullable: true })
  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  code: string;

  @OneToOne(() => AuthEntity, (auth) => auth.confirm, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'auth_id', referencedColumnName: 'id' })
  auth: AuthEntity;
}
