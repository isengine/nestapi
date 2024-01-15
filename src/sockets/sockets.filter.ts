import { ObjectType } from '@nestjs/graphql';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { FilterType } from '@src/typeorm/types/filter.type';

@ObjectType()
export class SocketsFilter extends FilterType(SocketsEntity) {}
