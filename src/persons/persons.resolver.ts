import { Resolver } from '@nestjs/graphql';
import { PersonsDto } from '@src/persons/persons.dto';
import { PersonsEntity } from '@src/persons/persons.entity';
import { PersonsFilter } from '@src/persons/persons.filter';
import { PersonsService } from '@src/persons/persons.service';
import { PrivateResolver } from '@src/common/resolver/private.resolver';

@Resolver(PersonsEntity)
export class PersonsResolver extends PrivateResolver(
  'persons',
  PersonsEntity,
  PersonsDto,
  PersonsFilter,
)<
  PersonsService,
  PersonsEntity,
  PersonsDto,
  PersonsFilter
> {
  constructor(
    readonly service: PersonsService,
  ) {
    super();
  }
}
