import { ObjectType } from '@nestjs/graphql';
import { ClientsEntity } from '@src/clients/clients.entity';
import { FilterType } from '@src/typeorm/types/filter.type';

@ObjectType()
export class ClientsFilter extends FilterType(ClientsEntity) {}
