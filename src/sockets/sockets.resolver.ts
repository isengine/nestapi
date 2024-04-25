import { Resolver } from '@nestjs/graphql';
import { CommonResolver } from '@src/common/resolver/common.resolver';
import { SocketsDto } from '@src/sockets/sockets.dto';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { SocketsFilter } from '@src/sockets/sockets.filter';
import { SocketsService } from '@src/sockets/sockets.service';

@Resolver(SocketsEntity)
export class SocketsResolver extends CommonResolver(
  'sockets',
  SocketsEntity,
  SocketsDto,
  SocketsFilter,
)<
  SocketsService,
  SocketsEntity,
  SocketsDto,
  SocketsFilter
> {
  constructor(
    readonly service: SocketsService,
  ) {
    super();
  }
}
