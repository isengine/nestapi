import { ObjectType } from '@nestjs/graphql';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class SocketsFilter extends FilterType(SocketsEntity) {}
