import { Resolver } from '@nestjs/graphql';
import { ProtectedResolver } from '@src/common/resolver/protected.resolver';
import { SocketsDto } from '@src/sockets/sockets.dto';
import { SocketsEntity } from '@src/sockets/sockets.entity';
import { SocketsFilter } from '@src/sockets/sockets.filter';
import { SocketsService } from '@src/sockets/sockets.service';

@Resolver(SocketsEntity)
export class SocketsResolver extends ProtectedResolver(
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
