import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';
import { ProtectedEntity } from '@src/common/entity/protected.entity';

@ObjectType()
@Entity()
export class PrivateEntity extends ProtectedEntity {}
