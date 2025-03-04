import { Resolver } from '@nestjs/graphql';
import { ClientsDto } from '@src/clients/clients.dto';
import { ClientsEntity } from '@src/clients/clients.entity';
import { ClientsService } from '@src/clients/clients.service';
import { ProtectedResolver } from '@src/common/resolver/protected.resolver';

@Resolver(ClientsEntity)
export class ClientsResolver extends ProtectedResolver(
  'clients',
  ClientsDto,
  ClientsEntity,
)<ClientsDto, ClientsEntity, ClientsService> {
  constructor(readonly service: ClientsService) {
    super();
  }
}
