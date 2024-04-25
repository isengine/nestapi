import { Resolver } from '@nestjs/graphql';
import { ClientsDto } from '@src/clients/clients.dto';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsFilter } from '@src/clients/clients.filter';
import { ClientsService } from '@src/clients/clients.service';
import { ProtectedResolver } from '@src/common/resolver/protected.resolver';

@Resolver(ClientsEntity)
export class ClientsResolver extends ProtectedResolver(
  'clients',
  ClientsEntity,
  ClientsDto,
  ClientsFilter,
)<
  ClientsService,
  ClientsEntity,
  ClientsDto,
  ClientsFilter
> {
  constructor(
    readonly service: ClientsService,
  ) {
    super();
  }
}
