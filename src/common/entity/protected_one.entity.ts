import { ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';
import { AuthEntity } from '@src/auth/auth.entity';

@ObjectType()
@Entity()
export class ProtectedOneEntity extends CommonEntity {
  @OneToOne(() => AuthEntity)
  @JoinColumn({ name: 'auth_id', referencedColumnName: 'id' })
  auth: AuthEntity;
}
