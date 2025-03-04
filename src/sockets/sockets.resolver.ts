import { Resolver } from '@nestjs/graphql';
import { ProtectedResolver } from '@src/common/resolver/protected.resolver';
import { SocketsDto } from './sockets.dto';
import { SocketsEntity } from './sockets.entity';
import { SocketsService } from './sockets.service';

@Resolver(SocketsEntity)
export class SocketsResolver extends ProtectedResolver(
  'sockets',
  SocketsDto,
  SocketsEntity,
)<SocketsDto, SocketsEntity, SocketsService> {
  constructor(readonly service: SocketsService) {
    super();
  }
}
