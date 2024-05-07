import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';
import { CommonEntity } from '@src/common/common.entity';

@ObjectType()
@Entity()
export class ClosedEntity extends CommonEntity {}
