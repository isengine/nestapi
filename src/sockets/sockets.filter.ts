import { ObjectType } from '@nestjs/graphql';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { FilterType } from '@src/typeorm/type/filter.type';

@ObjectType()
export class SocketsFilter extends FilterType(SocketsEntity) {}
