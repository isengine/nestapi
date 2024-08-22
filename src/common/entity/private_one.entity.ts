import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';
import { ProtectedOneEntity } from '@src/common/entity/protected_one.entity';

@ObjectType()
@Entity()
export class PrivateOneEntity extends ProtectedOneEntity {}
