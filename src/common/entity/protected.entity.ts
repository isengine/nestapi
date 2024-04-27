import { ObjectType } from '@nestjs/graphql';
import {
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { AuthEntity } from '@src/auth/auth.entity';

@ObjectType()
@Entity()
export class ProtectedEntity extends CommonEntity {
  @ManyToOne(() => AuthEntity)
  @JoinColumn({ name: 'auth_id', referencedColumnName: 'id' })
  auth: AuthEntity;
}
