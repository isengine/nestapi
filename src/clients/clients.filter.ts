import { ObjectType } from '@nestjs/graphql';
import { ClientsEntity } from '@src/clients/clients.entity';
import { FilterType } from '@src/common/type/filter.type';

@ObjectType()
export class ClientsFilter extends FilterType(ClientsEntity) {}
