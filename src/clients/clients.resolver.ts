import { Resolver } from '@nestjs/graphql';
import { ClientsDto } from '@src/clients/dto/clients.dto';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsFilter } from '@src/clients/clients.filter';
import { ClientsService } from '@src/clients/service/clients.service';
import { CommonResolver } from '@src/common/common.resolver';

@Resolver(ClientsEntity)
export class ClientsResolver extends CommonResolver(
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
